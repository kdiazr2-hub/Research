import { CARE } from "./care";
import { PRISMA } from "./prisma";
import { CONSORT } from "./consort";
import { STROBE } from "./strobe";
import { SPIRIT } from "./spirit";
import { STARD } from "./stard";
import { OTHER } from "./other";
import {
  REPORTING_GUIDELINES,
  isReportingGuideline,
  type GuidelineDefinition,
  type ReportingGuideline,
} from "./types";

export * from "./types";

export const GUIDELINES: Record<ReportingGuideline, GuidelineDefinition> = {
  CARE,
  PRISMA,
  CONSORT,
  STROBE,
  SPIRIT,
  STARD,
  OTHER,
};

export const REPORTING_GUIDELINE_VERSIONS: Record<ReportingGuideline, string> =
  Object.fromEntries(
    REPORTING_GUIDELINES.map((id) => [id, GUIDELINES[id].version])
  ) as Record<ReportingGuideline, string>;

export function getGuideline(id: string): GuidelineDefinition {
  if (isReportingGuideline(id)) return GUIDELINES[id];
  return OTHER;
}

export function guidelineOptions() {
  return REPORTING_GUIDELINES.map((id) => ({
    id,
    version: GUIDELINES[id].version,
    name: GUIDELINES[id].name,
    sourceUrl: GUIDELINES[id].sourceUrl,
  }));
}
