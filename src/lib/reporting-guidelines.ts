/** Re-export EQUATOR catalog for backward-compatible imports. */
export {
  REPORTING_GUIDELINES,
  REPORTING_GUIDELINE_VERSIONS,
  isReportingGuideline,
  getGuideline,
  guidelineOptions,
  GUIDELINES,
  pickLocale,
  type ReportingGuideline,
  type GuidelineDefinition,
  type ChecklistItemDef,
  type ManuscriptSection,
} from "@/lib/equator";

import { getGuideline } from "@/lib/equator";

/** @deprecated Prefer getGuideline(id).checklist */
export function checklistFor(guideline: string) {
  return getGuideline(guideline).checklist.map((item) => ({
    id: item.key,
    label: item.title.en,
    section: item.section.en,
  }));
}
