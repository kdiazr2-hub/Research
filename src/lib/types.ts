export const ROLES = [
  "OWNER",
  "INVESTIGATOR",
  "COLLABORATOR",
  "ANALYST",
  "VIEWER",
] as const;

export type Role = (typeof ROLES)[number];

export const PHI_TYPES = ["NONE", "PHI", "PHI_IMAGING"] as const;
export type PhiType = (typeof PHI_TYPES)[number];

export const PROJECT_STATUSES = [
  "LITERATURE",
  "DATA",
  "ANALYSIS",
  "WRITING",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export {
  REPORTING_GUIDELINES,
  type ReportingGuideline,
  isReportingGuideline,
} from "@/lib/reporting-guidelines";

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function isPhiType(value: string): value is PhiType {
  return (PHI_TYPES as readonly string[]).includes(value);
}
