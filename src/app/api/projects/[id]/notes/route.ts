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

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const referenceId = url.searchParams.get("referenceId") || undefined;

  const notes = await prisma.note.findMany({
    where: { projectId: id, ...(referenceId ? { referenceId } : {}) },
    orderBy: { updatedAt: "desc" },
    include: {
      reference: { select: { id: true, citeKey: true, title: true } },
      author: { select: { id: true, email: true, name: true } },
    },
  });

  return NextResponse.json({
    notes,
    canEdit: canEditLiterature(membership.role as Role),
  });
}

const createSchema = z.object({
  referenceId: z.string().min(1),
  title: z.string().max(300).optional(),
  body: z.string().max(50_000).optional(),
  pageStub: z.string().max(40).optional(),
  highlightStub: z.string().max(2000).optional(),
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
      metadata: { reason: "cannot_edit_notes", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const ref = await prisma.reference.findFirst({
    where: { id: parsed.data.referenceId, projectId: id },
  });
  if (!ref) {
    return NextResponse.json({ error: "reference_not_found" }, { status: 404 });
  }

  const note = await prisma.note.create({
    data: {
      projectId: id,
      referenceId: parsed.data.referenceId,
      authorId: session.user.id,
      title: parsed.data.title ?? "",
      body: parsed.data.body ?? "",
      pageStub: parsed.data.pageStub ?? "",
      highlightStub: parsed.data.highlightStub ?? "",
    },
    include: {
      reference: { select: { id: true, citeKey: true, title: true } },
      author: { select: { id: true, email: true, name: true } },
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "NOTE_CREATE",
    metadata: { noteId: note.id, citeKey: ref.citeKey },
  });

  return NextResponse.json({ note });
}
