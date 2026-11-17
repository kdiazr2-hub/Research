import type { GuidelineDefinition } from "./types";

/** PRISMA 2020 systematic review checklist — public item structure. */
export const PRISMA: GuidelineDefinition = {
  id: "PRISMA",
  version: "2020",
  name: {
    en: "PRISMA (systematic review)",
    es: "PRISMA (revisión sistemática)",
  },
  shortDescription: {
    en: "Systematic reviews and meta-analyses",
    es: "Revisiones sistemáticas y metaanálisis",
  },
  sourceUrl: "https://www.equator-network.org/reporting-guidelines/prisma/",
  citation: "Page MJ et al. PRISMA 2020 statement. BMJ 2021;372:n71.",
  sections: [
    { id: "title", title: { en: "Title", es: "Título" } },
    { id: "abstract", title: { en: "Abstract", es: "Resumen" } },
    { id: "introduction", title: { en: "Introduction", es: "Introducción" } },
    { id: "methods", title: { en: "Methods", es: "Métodos" } },
    { id: "results", title: { en: "Results", es: "Resultados" } },
    { id: "discussion", title: { en: "Discussion", es: "Discusión" } },
    {
      id: "other",
      title: { en: "Other information", es: "Otra información" },
    },
  ],
  checklist: [
    {
      key: "prisma-01",
      code: "1",
      section: { en: "Title", es: "Título" },
      title: {
        en: "Identify the report as a systematic review",
        es: "Identificar el informe como revisión sistemática",
      },
    },
    {
      key: "prisma-02",
      code: "2",
      section: { en: "Abstract", es: "Resumen" },
      title: {
        en: "See the PRISMA 2020 for Abstracts checklist",
        es: "Ver la checklist PRISMA 2020 para resúmenes",
      },
    },
    {
      key: "prisma-03",
      code: "3",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Describe the rationale for the review in the context of existing knowledge",
        es: "Describir la justificación de la revisión en el contexto del conocimiento existente",
      },
    },
    {
      key: "prisma-04",
      code: "4",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Provide an explicit statement of the objective(s) or question(s)",
        es: "Declarar de forma explícita el/los objetivo(s) o pregunta(s)",
      },
    },
    {
      key: "prisma-05",
      code: "5",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Specify inclusion and exclusion criteria and how studies were grouped",
        es: "Especificar criterios de inclusión/exclusión y cómo se agruparon los estudios",
      },
    },
    {
      key: "prisma-06",
      code: "6",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Specify all databases, registers, websites, organisations, reference lists searched",
        es: "Especificar bases de datos, registros, sitios y listas de referencias consultadas",
      },
    },
    {
      key: "prisma-07",
      code: "7",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Present the full search strategies for all databases and registers",
        es: "Presentar las estrategias de búsqueda completas para todas las fuentes",
      },
    },
    {
      key: "prisma-08",
      code: "8",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Specify the methods used to decide whether a study met inclusion criteria",
        es: "Especificar cómo se decidió si un estudio cumplía criterios de inclusión",
      },
    },
    {
      key: "prisma-09",
      code: "9",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Specify methods used to collect data from reports",
        es: "Especificar métodos para recopilar datos de los informes",
      },
    },
    {
      key: "prisma-10a",
      code: "10a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "List and define all outcomes for which data were sought",
        es: "Listar y definir todos los desenlaces para los que se buscaron datos",
      },
    },
    {
      key: "prisma-10b",
      code: "10b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "List and define all other variables for which data were sought",
        es: "Listar y definir todas las demás variables buscadas",
      },
    },
    {
      key: "prisma-11",
      code: "11",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Specify methods used to assess risk of bias in included studies",
        es: "Especificar métodos para evaluar el riesgo de sesgo",
      },
    },
    {
      key: "prisma-12",
      code: "12",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Specify for each outcome the effect measure(s) used",
        es: "Especificar para cada desenlace la(s) medida(s) de efecto usada(s)",
      },
    },
    {
      key: "prisma-13a",
      code: "13a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe processes used to decide which studies were eligible for each synthesis",
        es: "Describir cómo se decidió qué estudios eran elegibles para cada síntesis",
      },
    },
    {
      key: "prisma-13b",
      code: "13b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe any methods required to prepare the data for presentation or synthesis",
        es: "Describir métodos para preparar los datos para presentación o síntesis",
      },
    },
    {
      key: "prisma-13c",
      code: "13c",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe any methods used to tabulate or display results of individual studies",
        es: "Describir métodos para tabular o mostrar resultados de estudios individuales",
      },
    },
    {
      key: "prisma-13d",
      code: "13d",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe any methods used to synthesize results and explore heterogeneity",
        es: "Describir métodos de síntesis y exploración de heterogeneidad",
      },
    },
    {
      key: "prisma-13e",
      code: "13e",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe any methods used to assess risk of bias due to missing results",
        es: "Describir métodos para sesgo por resultados faltantes",
      },
    },
    {
      key: "prisma-13f",
      code: "13f",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe any methods used to assess certainty in the body of evidence",
        es: "Describir métodos para evaluar certeza del cuerpo de evidencia",
      },
    },
    {
      key: "prisma-14",
      code: "14",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Describe results of the search and selection process (preferably flow diagram)",
        es: "Describir búsqueda y selección (preferiblemente diagrama de flujo)",
      },
    },
    {
      key: "prisma-15",
      code: "15",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Cite each included study and present its characteristics",
        es: "Citar cada estudio incluido y presentar sus características",
      },
    },
    {
      key: "prisma-16a",
      code: "16a",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Present assessments of risk of bias for each included study",
        es: "Presentar evaluaciones de riesgo de sesgo por estudio",
      },
    },
    {
      key: "prisma-16b",
      code: "16b",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Present results of all statistical syntheses conducted",
        es: "Presentar resultados de todas las síntesis estadísticas",
      },
    },
    {
      key: "prisma-17",
      code: "17",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Present results of all investigations of possible causes of heterogeneity",
        es: "Presentar investigaciones de posibles causas de heterogeneidad",
      },
    },
    {
      key: "prisma-18",
      code: "18",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Present results of all sensitivity analyses",
        es: "Presentar resultados de todos los análisis de sensibilidad",
      },
    },
    {
      key: "prisma-19",
      code: "19",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Provide a general interpretation of the results in the context of other evidence",
        es: "Interpretación general de los resultados en contexto de otra evidencia",
      },
    },
    {
      key: "prisma-20",
      code: "20",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Discuss any limitations of the evidence and of the review processes",
        es: "Discutir limitaciones de la evidencia y de los procesos de revisión",
      },
    },
    {
      key: "prisma-21",
      code: "21",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Discuss implications of the results for practice, policy, and future research",
        es: "Implicaciones para práctica, políticas e investigación futura",
      },
    },
    {
      key: "prisma-22",
      code: "22",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Provide registration information for the review",
        es: "Proporcionar información de registro de la revisión",
      },
    },
    {
      key: "prisma-23",
      code: "23",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Describe sources of financial or non-financial support",
        es: "Describir fuentes de apoyo financiero o no financiero",
      },
    },
    {
      key: "prisma-24",
      code: "24",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Declare any competing interests of review authors",
        es: "Declarar conflictos de interés de los autores",
      },
    },
    {
      key: "prisma-25",
      code: "25",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Report which of the authors did what for the review",
        es: "Informar qué autor realizó cada parte de la revisión",
      },
    },
    {
      key: "prisma-26",
      code: "26",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Report how the public / patients were involved in the review",
        es: "Informar cómo participó el público / pacientes en la revisión",
      },
    },
    {
      key: "prisma-27",
      code: "27",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Describe where the data, code, and materials can be accessed",
        es: "Describir dónde se pueden acceder a datos, código y materiales",
      },
    },
  ],
};
