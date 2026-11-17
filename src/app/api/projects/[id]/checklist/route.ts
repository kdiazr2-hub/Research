import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { canEditProjectMeta, requireMembership } from "@/lib/permissions";
import { getGuideline, pickLocale } from "@/lib/equator";
import { seedChecklistForProject } from "@/lib/checklist";
import type { Role } from "@/lib/types";
import { getLocale } from "@/i18n/get-locale";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  itemKey: z.string().min(1),
  checked: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
});

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

  const project = membership.project;
  const guideline = getGuideline(project.reportingGuideline);
  const locale = await getLocale();

  let states = await prisma.checklistItem.findMany({
    where: { projectId: id },
  });

  if (states.length === 0 && guideline.checklist.length > 0) {
    await seedChecklistForProject(id, project.reportingGuideline);
    states = await prisma.checklistItem.findMany({ where: { projectId: id } });
  }

  const byKey = new Map(states.map((s) => [s.itemKey, s]));

  return NextResponse.json({
    guideline: project.reportingGuideline,
    version: project.reportingGuidelineVersion,
    sourceUrl: guideline.sourceUrl,
    citation: guideline.citation,
    sections: guideline.sections.map((s) => ({
      id: s.id,
      title: pickLocale(s.title, locale),
    })),
    items: guideline.checklist.map((item) => {
      const state = byKey.get(item.key);
      return {
        key: item.key,
        code: item.code,
        section: pickLocale(item.section, locale),
        title: pickLocale(item.title, locale),
        checked: state?.checked ?? false,
        notes: state?.notes ?? "",
      };
    }),
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership || !canEditProjectMeta(membership.role as Role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const guideline = getGuideline(membership.project.reportingGuideline);
  if (!guideline.checklist.some((i) => i.key === parsed.data.itemKey)) {
    return NextResponse.json({ error: "unknown_item" }, { status: 400 });
  }

  const updated = await prisma.checklistItem.upsert({
    where: {
      projectId_itemKey: {
        projectId: id,
        itemKey: parsed.data.itemKey,
      },
    },
    create: {
      projectId: id,
      itemKey: parsed.data.itemKey,
      checked: parsed.data.checked ?? false,
      notes: parsed.data.notes ?? "",
    },
    update: {
      checked: parsed.data.checked,
      notes: parsed.data.notes,
    },
  });

  return NextResponse.json(updated);
}
