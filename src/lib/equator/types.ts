export const REPORTING_GUIDELINES = [
  "CARE",
  "PRISMA",
  "CONSORT",
  "STROBE",
  "SPIRIT",
  "STARD",
  "OTHER",
] as const;

export type ReportingGuideline = (typeof REPORTING_GUIDELINES)[number];

export type Localized = { en: string; es: string };

export type ManuscriptSection = {
  id: string;
  title: Localized;
  description?: Localized;
};

export type ChecklistItemDef = {
  /** Stable key within a guideline, e.g. care-01 */
  key: string;
  /** Official item number / code when applicable */
  code: string;
  section: Localized;
  title: Localized;
};

export type GuidelineDefinition = {
  id: ReportingGuideline;
  version: string;
  name: Localized;
  shortDescription: Localized;
  /** EQUATOR Network page (public) */
  sourceUrl: string;
  citation: string;
  sections: ManuscriptSection[];
  checklist: ChecklistItemDef[];
};

export function isReportingGuideline(value: string): value is ReportingGuideline {
  return (REPORTING_GUIDELINES as readonly string[]).includes(value);
}

export function pickLocale(text: Localized, locale: string): string {
  return locale.startsWith("es") ? text.es : text.en;
}
