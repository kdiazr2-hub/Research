/** EQUATOR reporting guidelines — M0 stub. Full templates land in M1+. */

export const REPORTING_GUIDELINES = ["CARE", "PRISMA", "OTHER"] as const;
export type ReportingGuideline = (typeof REPORTING_GUIDELINES)[number];

export const REPORTING_GUIDELINE_VERSIONS: Record<ReportingGuideline, string> = {
  CARE: "2013",
  PRISMA: "2020",
  OTHER: "n/a",
};

export type ChecklistItem = {
  id: string;
  label: string;
  section?: string;
};

/** Short key-item stubs only — not full EQUATOR checklists. */
export const CHECKLIST_STUBS: Record<ReportingGuideline, ChecklistItem[]> = {
  CARE: [
    { id: "care-title", section: "Title", label: "Diagnosis or intervention in title" },
    { id: "care-abstract", section: "Abstract", label: "Structured abstract present" },
    { id: "care-consent", section: "Patient", label: "Informed consent documented" },
    { id: "care-timeline", section: "Timeline", label: "Clinical timeline included" },
    { id: "care-discussion", section: "Discussion", label: "Strengths and limitations stated" },
  ],
  PRISMA: [
    { id: "prisma-title", section: "Title", label: "Identify as systematic review" },
    { id: "prisma-protocol", section: "Methods", label: "Protocol registration (e.g. PROSPERO)" },
    { id: "prisma-eligibility", section: "Methods", label: "Eligibility criteria stated" },
    { id: "prisma-search", section: "Methods", label: "Information sources and search date" },
    { id: "prisma-flow", section: "Results", label: "Study selection flow diagram" },
  ],
  OTHER: [
    { id: "other-objective", section: "Intro", label: "Research question / objective clear" },
    { id: "other-methods", section: "Methods", label: "Methods reproducible enough to audit" },
    { id: "other-ethics", section: "Ethics", label: "Ethics / consent status recorded" },
  ],
};

export function isReportingGuideline(value: string): value is ReportingGuideline {
  return (REPORTING_GUIDELINES as readonly string[]).includes(value);
}

export function checklistFor(guideline: string): ChecklistItem[] {
  if (isReportingGuideline(guideline)) return CHECKLIST_STUBS[guideline];
  return CHECKLIST_STUBS.OTHER;
}
