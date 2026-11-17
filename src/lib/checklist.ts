import { prisma } from "@/lib/prisma";
import {
  getGuideline,
  REPORTING_GUIDELINE_VERSIONS,
  isReportingGuideline,
  type ReportingGuideline,
} from "@/lib/equator";

export async function seedChecklistForProject(
  projectId: string,
  guidelineId: string
) {
  const guideline = getGuideline(guidelineId);
  await prisma.checklistItem.createMany({
    data: guideline.checklist.map((item) => ({
      projectId,
      itemKey: item.key,
      checked: false,
      notes: "",
    })),
  });
}

/**
 * Regenerate checklist when switching EQUATOR guideline.
 * Matching itemKeys keep checked + notes; orphaned keys are removed;
 * new keys are added unchecked.
 */
export async function regenerateChecklist(
  projectId: string,
  nextGuideline: ReportingGuideline,
  options?: { preserveMatching?: boolean }
) {
  const preserve = options?.preserveMatching !== false;
  const guideline = getGuideline(nextGuideline);
  const nextKeys = new Set(guideline.checklist.map((i) => i.key));

  const existing = await prisma.checklistItem.findMany({
    where: { projectId },
  });
  const byKey = new Map(existing.map((e) => [e.itemKey, e]));

  const toDelete = existing
    .filter((e) => !nextKeys.has(e.itemKey))
    .map((e) => e.id);

  if (toDelete.length) {
    await prisma.checklistItem.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  for (const item of guideline.checklist) {
    const prev = byKey.get(item.key);
    if (prev) {
      if (!preserve) {
        await prisma.checklistItem.update({
          where: { id: prev.id },
          data: { checked: false, notes: "" },
        });
      }
      // else keep checked/notes as-is
      continue;
    }
    await prisma.checklistItem.create({
      data: {
        projectId,
        itemKey: item.key,
        checked: false,
        notes: "",
      },
    });
  }

  return {
    version: REPORTING_GUIDELINE_VERSIONS[nextGuideline],
    preserved: preserve
      ? existing.filter((e) => nextKeys.has(e.itemKey)).length
      : 0,
    removed: toDelete.length,
    added: guideline.checklist.filter((i) => !byKey.has(i.key)).length,
  };
}

export function parseGuideline(value: string): ReportingGuideline {
  return isReportingGuideline(value) ? value : "OTHER";
}
