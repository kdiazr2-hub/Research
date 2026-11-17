import type { GuidelineDefinition } from "./types";

/** CONSORT 2010 randomized trial checklist — public item structure. */
export const CONSORT: GuidelineDefinition = {
  id: "CONSORT",
  version: "2010",
  name: {
    en: "CONSORT (randomized trial)",
    es: "CONSORT (ensayo aleatorizado)",
  },
  shortDescription: {
    en: "Parallel-group randomized controlled trials",
    es: "Ensayos controlados aleatorizados de grupos paralelos",
  },
  sourceUrl: "https://www.equator-network.org/reporting-guidelines/consort/",
  citation: "Schulz KF et al. CONSORT 2010 statement. BMJ 2010;340:c332.",
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
      key: "consort-01a",
      code: "1a",
      section: { en: "Title and abstract", es: "Título y resumen" },
      title: {
        en: "Identification as a randomised trial in the title",
        es: "Identificación como ensayo aleatorizado en el título",
      },
    },
    {
      key: "consort-01b",
      code: "1b",
      section: { en: "Title and abstract", es: "Título y resumen" },
      title: {
        en: "Structured summary of trial design, methods, results, and conclusions",
        es: "Resumen estructurado de diseño, métodos, resultados y conclusiones",
      },
    },
    {
      key: "consort-02a",
      code: "2a",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Scientific background and explanation of rationale",
        es: "Antecedentes científicos y justificación",
      },
    },
    {
      key: "consort-02b",
      code: "2b",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Specific objectives or hypotheses",
        es: "Objetivos o hipótesis específicos",
      },
    },
    {
      key: "consort-03a",
      code: "3a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Description of trial design (e.g. parallel, factorial)",
        es: "Descripción del diseño del ensayo (p. ej. paralelo, factorial)",
      },
    },
    {
      key: "consort-03b",
      code: "3b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Important changes to methods after trial commencement",
        es: "Cambios importantes de métodos tras el inicio del ensayo",
      },
    },
    {
      key: "consort-04a",
      code: "4a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Eligibility criteria for participants",
        es: "Criterios de elegibilidad de los participantes",
      },
    },
    {
      key: "consort-04b",
      code: "4b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Settings and locations where the data were collected",
        es: "Escenarios y lugares donde se recopilaron los datos",
      },
    },
    {
      key: "consort-05",
      code: "5",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "The interventions for each group with sufficient details to allow replication",
        es: "Intervenciones por grupo con detalle suficiente para replicación",
      },
    },
    {
      key: "consort-06a",
      code: "6a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Completely defined pre-specified primary and secondary outcome measures",
        es: "Desenlaces primarios y secundarios preespecificados completamente definidos",
      },
    },
    {
      key: "consort-06b",
      code: "6b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Any changes to trial outcomes after the trial commenced",
        es: "Cualquier cambio de desenlaces tras el inicio del ensayo",
      },
    },
    {
      key: "consort-07a",
      code: "7a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "How sample size was determined",
        es: "Cómo se determinó el tamaño muestral",
      },
    },
    {
      key: "consort-07b",
      code: "7b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "When applicable, explanation of any interim analyses and stopping guidelines",
        es: "Cuando aplique, análisis interinos y reglas de detención",
      },
    },
    {
      key: "consort-08a",
      code: "8a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Method used to generate the random allocation sequence",
        es: "Método para generar la secuencia de asignación aleatoria",
      },
    },
    {
      key: "consort-08b",
      code: "8b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Type of randomisation; details of any restriction",
        es: "Tipo de aleatorización; detalles de cualquier restricción",
      },
    },
    {
      key: "consort-09",
      code: "9",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Mechanism used to implement the random allocation sequence",
        es: "Mecanismo para implementar la secuencia de asignación",
      },
    },
    {
      key: "consort-10",
      code: "10",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Who generated the allocation sequence, who enrolled, who assigned",
        es: "Quién generó la secuencia, quién enroló, quién asignó",
      },
    },
    {
      key: "consort-11a",
      code: "11a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "If done, who was blinded after assignment and how",
        es: "Si se hizo, quién fue cegado tras la asignación y cómo",
      },
    },
    {
      key: "consort-11b",
      code: "11b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "If relevant, description of the similarity of interventions",
        es: "Si es relevante, similitud de las intervenciones",
      },
    },
    {
      key: "consort-12a",
      code: "12a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Statistical methods used to compare groups for primary and secondary outcomes",
        es: "Métodos estadísticos para comparar grupos en desenlaces",
      },
    },
    {
      key: "consort-12b",
      code: "12b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Methods for additional analyses, such as subgroup analyses and adjusted analyses",
        es: "Métodos para análisis adicionales (subgrupos, ajustados)",
      },
    },
    {
      key: "consort-13a",
      code: "13a",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "For each group, numbers randomly assigned, receiving intended treatment, analysed",
        es: "Por grupo: asignados, que recibieron tratamiento, analizados",
      },
    },
    {
      key: "consort-13b",
      code: "13b",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "For each group, losses and exclusions after randomisation, with reasons",
        es: "Por grupo: pérdidas y exclusiones tras aleatorización, con motivos",
      },
    },
    {
      key: "consort-14a",
      code: "14a",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Dates defining the periods of recruitment and follow-up",
        es: "Fechas que definen periodos de reclutamiento y seguimiento",
      },
    },
    {
      key: "consort-14b",
      code: "14b",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Why the trial ended or was stopped",
        es: "Por qué terminó o se detuvo el ensayo",
      },
    },
    {
      key: "consort-15",
      code: "15",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "A table showing baseline demographic and clinical characteristics",
        es: "Tabla de características demográficas y clínicas basales",
      },
    },
    {
      key: "consort-16",
      code: "16",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "For each group, number of participants included in each analysis",
        es: "Por grupo, número de participantes en cada análisis",
      },
    },
    {
      key: "consort-17a",
      code: "17a",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "For each primary and secondary outcome, results for each group and estimated effect size",
        es: "Por desenlace: resultados por grupo y tamaño del efecto estimado",
      },
    },
    {
      key: "consort-17b",
      code: "17b",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "For binary outcomes, presentation of both absolute and relative effect sizes",
        es: "Para desenlaces binarios, efecto absoluto y relativo",
      },
    },
    {
      key: "consort-18",
      code: "18",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Results of any other analyses performed, including subgroup analyses",
        es: "Resultados de otros análisis, incluidos subgrupos",
      },
    },
    {
      key: "consort-19",
      code: "19",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "All important harms or unintended effects in each group",
        es: "Todos los daños o efectos no deseados importantes por grupo",
      },
    },
    {
      key: "consort-20",
      code: "20",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Trial limitations, addressing sources of potential bias and imprecision",
        es: "Limitaciones del ensayo, sesgos potenciales e imprecisión",
      },
    },
    {
      key: "consort-21",
      code: "21",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Generalisability (external validity, applicability) of the trial findings",
        es: "Generalizabilidad (validez externa) de los hallazgos",
      },
    },
    {
      key: "consort-22",
      code: "22",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Interpretation consistent with results, balancing benefits and harms",
        es: "Interpretación coherente con resultados, balanceando beneficios y daños",
      },
    },
    {
      key: "consort-23",
      code: "23",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Registration number and name of trial registry",
        es: "Número de registro y nombre del registro del ensayo",
      },
    },
    {
      key: "consort-24",
      code: "24",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Where the full trial protocol can be accessed, if available",
        es: "Dónde se puede acceder al protocolo completo, si está disponible",
      },
    },
    {
      key: "consort-25",
      code: "25",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Sources of funding and other support; role of funders",
        es: "Fuentes de financiación y apoyo; rol de los financiadores",
      },
    },
  ],
};
