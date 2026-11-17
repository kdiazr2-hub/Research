import type { GuidelineDefinition } from "./types";

/** Generic fallback when no EQUATOR guideline is selected yet. */
export const OTHER: GuidelineDefinition = {
  id: "OTHER",
  version: "n/a",
  name: {
    en: "Other / generic",
    es: "Otro / genérico",
  },
  shortDescription: {
    en: "Generic manuscript outline until a specific EQUATOR guideline is chosen",
    es: "Esquema genérico hasta elegir una guía EQUATOR específica",
  },
  sourceUrl: "https://www.equator-network.org/reporting-guidelines/",
  citation: "EQUATOR Network — browse reporting guidelines by study type.",
  sections: [
    { id: "title", title: { en: "Title", es: "Título" } },
    { id: "abstract", title: { en: "Abstract", es: "Resumen" } },
    { id: "introduction", title: { en: "Introduction", es: "Introducción" } },
    { id: "methods", title: { en: "Methods", es: "Métodos" } },
    { id: "results", title: { en: "Results", es: "Resultados" } },
    { id: "discussion", title: { en: "Discussion", es: "Discusión" } },
    {
      id: "ethics",
      title: { en: "Ethics / disclosures", es: "Ética / declaraciones" },
    },
  ],
  checklist: [
    {
      key: "other-01",
      code: "1",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Research question / objective is explicit",
        es: "La pregunta / objetivo de investigación es explícito",
      },
    },
    {
      key: "other-02",
      code: "2",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Study design is stated and justified",
        es: "El diseño del estudio está declarado y justificado",
      },
    },
    {
      key: "other-03",
      code: "3",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Methods are reproducible enough to audit",
        es: "Los métodos son suficientemente reproducibles para auditar",
      },
    },
    {
      key: "other-04",
      code: "4",
      section: { en: "Ethics / disclosures", es: "Ética / declaraciones" },
      title: {
        en: "Ethics / consent status is recorded",
        es: "El estado ético / de consentimiento está registrado",
      },
    },
    {
      key: "other-05",
      code: "5",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Limitations and implications are discussed",
        es: "Se discuten limitaciones e implicaciones",
      },
    },
  ],
};
