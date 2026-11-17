import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canEditLiterature,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import {
  detectAndParseBibliography,
  uniqueCiteKey,
} from "@/lib/bibtex";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Literature is not PHI — Analyst/Viewer may list refs without canViewPhi.
  const refs = await prisma.reference.findMany({
    where: { projectId: id },
    orderBy: [{ year: "desc" }, { citeKey: "asc" }],
    include: { _count: { select: { notes: true } } },
  });

  return NextResponse.json({
    references: refs,
    canEdit: canEditLiterature(membership.role as Role),
    phiNote:
      "Reference library is scientific metadata only; opening refs does not grant PHI/imaging access.",
  });
}

const importSchema = z.object({
  text: z.string().min(1).max(500_000),
  format: z.enum(["auto", "bibtex", "ris"]).optional(),
});

export async function POST(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canEditLiterature(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_edit_literature", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = importSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const items = detectAndParseBibliography(parsed.data.text);
  if (items.length === 0) {
    return NextResponse.json({ error: "no_entries_parsed" }, { status: 400 });
  }

  const existing = await prisma.reference.findMany({
    where: { projectId: id },
    select: { citeKey: true },
  });
  const keys = new Set(existing.map((e) => e.citeKey));

  const created = [];
  for (const item of items) {
    const citeKey = uniqueCiteKey(item.citeKey, keys);
    const row = await prisma.reference.create({
      data: {
        projectId: id,
        citeKey,
        title: item.title,
        authors: item.authors,
        year: item.year,
        journal: item.journal,
        doi: item.doi,
        url: item.url,
        abstract: item.abstract,
        entryType: item.entryType,
        tags: item.tags,
        bibtexRaw: item.bibtexRaw.includes(`{${item.citeKey},`)
          ? item.bibtexRaw.replace(`{${item.citeKey},`, `{${citeKey},`)
          : item.bibtexRaw,
      },
    });
    created.push(row);
  }

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "REFERENCES_IMPORT",
    metadata: { count: created.length, keys: created.map((c) => c.citeKey) },
  });

  return NextResponse.json({ imported: created.length, references: created });
}
