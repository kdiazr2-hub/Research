import type { GuidelineDefinition } from "./types";

/** STROBE observational studies checklist — common item structure. */
export const STROBE: GuidelineDefinition = {
  id: "STROBE",
  version: "2007",
  name: {
    en: "STROBE (observational)",
    es: "STROBE (observacional)",
  },
  shortDescription: {
    en: "Cohort, case-control, and cross-sectional studies",
    es: "Estudios de cohortes, casos y controles y transversales",
  },
  sourceUrl: "https://www.equator-network.org/reporting-guidelines/strobe/",
  citation: "von Elm E et al. STROBE statement. Lancet 2007;370:1453–1457.",
  sections: [
    { id: "title-abstract", title: { en: "Title and abstract", es: "Título y resumen" } },
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
      key: "strobe-01a",
      code: "1a",
      section: { en: "Title and abstract", es: "Título y resumen" },
      title: {
        en: "Indicate the study’s design with a commonly used term in the title or abstract",
        es: "Indicar el diseño del estudio con un término habitual en título o resumen",
      },
    },
    {
      key: "strobe-01b",
      code: "1b",
      section: { en: "Title and abstract", es: "Título y resumen" },
      title: {
        en: "Provide in the abstract an informative and balanced summary",
        es: "Proporcionar en el resumen un resumen informativo y equilibrado",
      },
    },
    {
      key: "strobe-02",
      code: "2",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Explain the scientific background and rationale for the investigation",
        es: "Explicar antecedentes científicos y justificación de la investigación",
      },
    },
    {
      key: "strobe-03",
      code: "3",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "State specific objectives, including any pre-specified hypotheses",
        es: "Declarar objetivos específicos, incluidas hipótesis preespecificadas",
      },
    },
    {
      key: "strobe-04",
      code: "4",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Present key elements of study design early in the paper",
        es: "Presentar elementos clave del diseño temprano en el artículo",
      },
    },
    {
      key: "strobe-05",
      code: "5",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe the setting, locations, and relevant dates",
        es: "Describir el escenario, ubicaciones y fechas relevantes",
      },
    },
    {
      key: "strobe-06",
      code: "6",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Give the eligibility criteria, and the sources and methods of selection of participants",
        es: "Criterios de elegibilidad y fuentes/métodos de selección de participantes",
      },
    },
    {
      key: "strobe-07",
      code: "7",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Clearly define all outcomes, exposures, predictors, potential confounders, and effect modifiers",
        es: "Definir desenlaces, exposiciones, predictores, confusores y modificadores",
      },
    },
    {
      key: "strobe-08",
      code: "8",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "For each variable of interest, give sources of data and details of methods of assessment",
        es: "Para cada variable: fuentes de datos y métodos de evaluación",
      },
    },
    {
      key: "strobe-09",
      code: "9",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe any efforts to address potential sources of bias",
        es: "Describir esfuerzos para abordar posibles fuentes de sesgo",
      },
    },
    {
      key: "strobe-10",
      code: "10",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Explain how the study size was arrived at",
        es: "Explicar cómo se llegó al tamaño del estudio",
      },
    },
    {
      key: "strobe-11",
      code: "11",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Explain how quantitative variables were handled in the analyses",
        es: "Explicar cómo se manejaron las variables cuantitativas en los análisis",
      },
    },
    {
      key: "strobe-12a",
      code: "12a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe all statistical methods, including those used to control for confounding",
        es: "Describir todos los métodos estadísticos, incluido control de confusión",
      },
    },
    {
      key: "strobe-12b",
      code: "12b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe any methods used to examine subgroups and interactions",
        es: "Describir métodos para examinar subgrupos e interacciones",
      },
    },
    {
      key: "strobe-12c",
      code: "12c",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Explain how missing data were addressed",
        es: "Explicar cómo se abordaron los datos faltantes",
      },
    },
    {
      key: "strobe-12d",
      code: "12d",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "If applicable, explain how loss to follow-up / matching / sampling strategy was addressed",
        es: "Si aplica: pérdidas de seguimiento / emparejamiento / muestreo",
      },
    },
    {
      key: "strobe-12e",
      code: "12e",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Describe any sensitivity analyses",
        es: "Describir cualquier análisis de sensibilidad",
      },
    },
    {
      key: "strobe-13a",
      code: "13a",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Report numbers of individuals at each stage of study",
        es: "Informar números de individuos en cada etapa del estudio",
      },
    },
    {
      key: "strobe-13b",
      code: "13b",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Give reasons for non-participation at each stage",
        es: "Dar motivos de no participación en cada etapa",
      },
    },
    {
      key: "strobe-13c",
      code: "13c",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Consider use of a flow diagram",
        es: "Considerar el uso de un diagrama de flujo",
      },
    },
    {
      key: "strobe-14a",
      code: "14a",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Give characteristics of study participants",
        es: "Dar características de los participantes del estudio",
      },
    },
    {
      key: "strobe-14b",
      code: "14b",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Indicate number of participants with missing data for each variable of interest",
        es: "Indicar número con datos faltantes por variable de interés",
      },
    },
    {
      key: "strobe-15",
      code: "15",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Report numbers of outcome events or summary measures over time / by exposure",
        es: "Informar eventos o medidas resumen a lo largo del tiempo / por exposición",
      },
    },
    {
      key: "strobe-16a",
      code: "16a",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Give unadjusted estimates and, if applicable, confounder-adjusted estimates",
        es: "Dar estimaciones no ajustadas y, si aplica, ajustadas por confusores",
      },
    },
    {
      key: "strobe-16b",
      code: "16b",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Report category boundaries when continuous variables were categorized",
        es: "Informar límites de categoría si se categorizaron variables continuas",
      },
    },
    {
      key: "strobe-16c",
      code: "16c",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "If relevant, consider translating estimates of relative risk into absolute risk",
        es: "Si es relevante, traducir riesgo relativo a riesgo absoluto",
      },
    },
    {
      key: "strobe-17",
      code: "17",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Report other analyses done — e.g. analyses of subgroups and interactions",
        es: "Informar otros análisis realizados (subgrupos e interacciones)",
      },
    },
    {
      key: "strobe-18",
      code: "18",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Summarise key results with reference to study objectives",
        es: "Resumir resultados clave con referencia a los objetivos",
      },
    },
    {
      key: "strobe-19",
      code: "19",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Discuss limitations of the study, taking into account sources of potential bias",
        es: "Discutir limitaciones, considerando fuentes de sesgo potencial",
      },
    },
    {
      key: "strobe-20",
      code: "20",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Give a cautious overall interpretation of results considering objectives and evidence",
        es: "Interpretación global cautelosa considerando objetivos y evidencia",
      },
    },
    {
      key: "strobe-21",
      code: "21",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Discuss the generalisability (external validity) of the study results",
        es: "Discutir la generalizabilidad (validez externa) de los resultados",
      },
    },
    {
      key: "strobe-22",
      code: "22",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Give the source of funding and the role of the funders",
        es: "Indicar fuente de financiación y rol de los financiadores",
      },
    },
  ],
};
