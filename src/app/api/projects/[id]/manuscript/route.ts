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
import { seedManuscriptMarkdown } from "@/lib/manuscript";
import { getLocale } from "@/i18n/get-locale";

type Ctx = { params: Promise<{ id: string }> };

async function getOrCreateManuscript(
  projectId: string,
  projectName: string,
  guideline: string,
  locale: string
) {
  const existing = await prisma.manuscript.findUnique({
    where: { projectId },
  });
  if (existing) return existing;

  return prisma.manuscript.create({
    data: {
      projectId,
      title: projectName,
      markdown: seedManuscriptMarkdown(projectName, guideline, locale),
    },
  });
}

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

  const locale = await getLocale();
  const manuscript = await getOrCreateManuscript(
    id,
    membership.project.name,
    membership.project.reportingGuideline,
    locale
  );

  const references = await prisma.reference.findMany({
    where: { projectId: id },
    select: { id: true, citeKey: true, title: true, authors: true, year: true },
    orderBy: { citeKey: "asc" },
  });

  return NextResponse.json({
    manuscript,
    references,
    canEdit: canEditLiterature(membership.role as Role),
  });
}

const updateSchema = z.object({
  title: z.string().max(300).optional(),
  markdown: z.string().max(500_000).optional(),
  reseed: z.boolean().optional(),
});

export async function PUT(req: Request, ctx: Ctx) {
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
      metadata: { reason: "cannot_edit_manuscript", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const locale = await getLocale();
  let manuscript = await getOrCreateManuscript(
    id,
    membership.project.name,
    membership.project.reportingGuideline,
    locale
  );

  if (parsed.data.reseed) {
    manuscript = await prisma.manuscript.update({
      where: { id: manuscript.id },
      data: {
        markdown: seedManuscriptMarkdown(
          membership.project.name,
          membership.project.reportingGuideline,
          locale
        ),
        title: membership.project.name,
      },
    });
  } else {
    manuscript = await prisma.manuscript.update({
      where: { id: manuscript.id },
      data: {
        title: parsed.data.title,
        markdown: parsed.data.markdown,
      },
    });
  }

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "MANUSCRIPT_UPDATE",
    metadata: { reseed: Boolean(parsed.data.reseed) },
  });

  return NextResponse.json({ manuscript });
}
