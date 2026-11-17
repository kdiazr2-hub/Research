import type { GuidelineDefinition } from "./types";

/** STARD 2015 diagnostic accuracy studies — public checklist item titles. */
export const STARD: GuidelineDefinition = {
  id: "STARD",
  version: "2015",
  name: {
    en: "STARD (diagnostic accuracy)",
    es: "STARD (exactitud diagnóstica)",
  },
  shortDescription: {
    en: "Studies of diagnostic accuracy",
    es: "Estudios de exactitud diagnóstica",
  },
  sourceUrl: "https://www.equator-network.org/reporting-guidelines/stard/",
  citation: "Bossuyt PM et al. STARD 2015. BMJ 2015;351:h5527.",
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
      key: "stard-01",
      code: "1",
      section: { en: "Title and abstract", es: "Título y resumen" },
      title: {
        en: "Identification as a study of diagnostic accuracy using at least one measure of accuracy",
        es: "Identificar como estudio de exactitud diagnóstica con ≥1 medida de exactitud",
      },
    },
    {
      key: "stard-02",
      code: "2",
      section: { en: "Title and abstract", es: "Título y resumen" },
      title: {
        en: "Structured abstract of study objectives, methods, results, and conclusions",
        es: "Resumen estructurado de objetivos, métodos, resultados y conclusiones",
      },
    },
    {
      key: "stard-03",
      code: "3",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Scientific and clinical background, including the intended use and clinical role of the index test",
        es: "Antecedentes científicos y clínicos; uso e rol clínico de la prueba índice",
      },
    },
    {
      key: "stard-04",
      code: "4",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Study objectives and hypotheses",
        es: "Objetivos e hipótesis del estudio",
      },
    },
    {
      key: "stard-05",
      code: "5",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Whether data collection was planned before the index test and reference standard were performed",
        es: "Si la recolección se planificó antes de realizar prueba índice y estándar de referencia",
      },
    },
    {
      key: "stard-06",
      code: "6",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Eligibility criteria",
        es: "Criterios de elegibilidad",
      },
    },
    {
      key: "stard-07",
      code: "7",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "On what basis potentially eligible participants were identified",
        es: "Sobre qué base se identificaron participantes potencialmente elegibles",
      },
    },
    {
      key: "stard-08",
      code: "8",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Where and when potentially eligible participants were identified",
        es: "Dónde y cuándo se identificaron participantes potencialmente elegibles",
      },
    },
    {
      key: "stard-09",
      code: "9",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Whether participants formed a consecutive, random, or convenience series",
        es: "Si los participantes formaron una serie consecutiva, aleatoria o de conveniencia",
      },
    },
    {
      key: "stard-10a",
      code: "10a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Index test, in sufficient detail to allow replication",
        es: "Prueba índice, con detalle suficiente para replicación",
      },
    },
    {
      key: "stard-10b",
      code: "10b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Reference standard, in sufficient detail to allow replication",
        es: "Estándar de referencia, con detalle suficiente para replicación",
      },
    },
    {
      key: "stard-11",
      code: "11",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Rationale for choosing the reference standard",
        es: "Justificación de la elección del estándar de referencia",
      },
    },
    {
      key: "stard-12a",
      code: "12a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Definition of and rationale for test positivity cut-offs or result categories of the index test",
        es: "Definición y justificación de puntos de corte / categorías de la prueba índice",
      },
    },
    {
      key: "stard-12b",
      code: "12b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Definition of and rationale for test positivity cut-offs or result categories of the reference standard",
        es: "Definición y justificación de puntos de corte del estándar de referencia",
      },
    },
    {
      key: "stard-13a",
      code: "13a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Whether clinical information and reference standard results were available to those performing/reading the index test",
        es: "Si quienes leyeron la prueba índice tenían información clínica / del estándar",
      },
    },
    {
      key: "stard-13b",
      code: "13b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Whether clinical information and index test results were available to those assessing the reference standard",
        es: "Si quienes evaluaron el estándar tenían información clínica / de la prueba índice",
      },
    },
    {
      key: "stard-14",
      code: "14",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Methods for estimating or comparing measures of diagnostic accuracy",
        es: "Métodos para estimar o comparar medidas de exactitud diagnóstica",
      },
    },
    {
      key: "stard-15",
      code: "15",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "How indeterminate index test or reference standard results were handled",
        es: "Cómo se manejaron resultados indeterminados",
      },
    },
    {
      key: "stard-16",
      code: "16",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "How missing data on the index test and reference standard were handled",
        es: "Cómo se manejaron datos faltantes de prueba índice y estándar",
      },
    },
    {
      key: "stard-17",
      code: "17",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Any analyses of variability in diagnostic accuracy, distinguishing pre-specified from exploratory",
        es: "Análisis de variabilidad de exactitud; preespecificados vs exploratorios",
      },
    },
    {
      key: "stard-18",
      code: "18",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Intended sample size and how it was determined",
        es: "Tamaño muestral previsto y cómo se determinó",
      },
    },
    {
      key: "stard-19",
      code: "19",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Flow of participants, using a diagram",
        es: "Flujo de participantes, usando un diagrama",
      },
    },
    {
      key: "stard-20",
      code: "20",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Baseline demographic and clinical characteristics of participants",
        es: "Características demográficas y clínicas basales de los participantes",
      },
    },
    {
      key: "stard-21a",
      code: "21a",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Distribution of severity of disease in those with the target condition",
        es: "Distribución de la gravedad en quienes tienen la condición objetivo",
      },
    },
    {
      key: "stard-21b",
      code: "21b",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Distribution of alternative diagnoses in those without the target condition",
        es: "Distribución de diagnósticos alternativos en quienes no tienen la condición",
      },
    },
    {
      key: "stard-22",
      code: "22",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Time interval and any clinical interventions between index test and reference standard",
        es: "Intervalo temporal e intervenciones clínicas entre prueba índice y estándar",
      },
    },
    {
      key: "stard-23",
      code: "23",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Cross tabulation of the index test results by the results of the reference standard",
        es: "Tabla cruzada de resultados de prueba índice vs estándar de referencia",
      },
    },
    {
      key: "stard-24",
      code: "24",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Estimates of diagnostic accuracy and their precision",
        es: "Estimaciones de exactitud diagnóstica y su precisión",
      },
    },
    {
      key: "stard-25",
      code: "25",
      section: { en: "Results", es: "Resultados" },
      title: {
        en: "Any adverse events from performing the index test or the reference standard",
        es: "Eventos adversos al realizar la prueba índice o el estándar",
      },
    },
    {
      key: "stard-26",
      code: "26",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Study limitations, including sources of potential bias, statistical uncertainty, and generalisability",
        es: "Limitaciones: sesgos potenciales, incertidumbre estadística y generalizabilidad",
      },
    },
    {
      key: "stard-27",
      code: "27",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Implications for practice, including the intended use and clinical role of the index test",
        es: "Implicaciones para la práctica: uso e rol clínico de la prueba índice",
      },
    },
    {
      key: "stard-28",
      code: "28",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Registration number and name of registry",
        es: "Número de registro y nombre del registro",
      },
    },
    {
      key: "stard-29",
      code: "29",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Where the full study protocol can be accessed",
        es: "Dónde se puede acceder al protocolo completo del estudio",
      },
    },
    {
      key: "stard-30",
      code: "30",
      section: { en: "Other information", es: "Otra información" },
      title: {
        en: "Sources of funding and other support; role of funders",
        es: "Fuentes de financiación y apoyo; rol de los financiadores",
      },
    },
  ],
};
