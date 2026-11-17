import type { Dictionary } from "@/i18n/dictionaries";

export function projectNavLabels(t: Dictionary) {
  return {
    overview: t.overview,
    library: t.library,
    notes: t.notes,
    data: t.data,
    imaging: t.imaging,
    analysis: t.analysis,
    manuscript: t.manuscript,
    export: t.export,
    security: t.security,
    audit: t.audit,
  };
}
