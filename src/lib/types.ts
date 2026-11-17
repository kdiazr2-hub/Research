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

export const FIELD_TYPES = [
  "string",
  "number",
  "boolean",
  "date",
  "text",
] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export function isFieldType(value: string): value is FieldType {
  return (FIELD_TYPES as readonly string[]).includes(value);
}

export const DEID_MODES = ["strip", "hash"] as const;
export type DeidMode = (typeof DEID_MODES)[number];

export function isDeidMode(value: string): value is DeidMode {
  return (DEID_MODES as readonly string[]).includes(value);
}

export const NOTEBOOK_KINDS = ["ipynb", "py", "qmd"] as const;
export type NotebookKind = (typeof NOTEBOOK_KINDS)[number];

export function isNotebookKind(value: string): value is NotebookKind {
  return (NOTEBOOK_KINDS as readonly string[]).includes(value);
}

export const ARTIFACT_KINDS = ["figure", "table", "other"] as const;
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];

export function isArtifactKind(value: string): value is ArtifactKind {
  return (ARTIFACT_KINDS as readonly string[]).includes(value);
}
