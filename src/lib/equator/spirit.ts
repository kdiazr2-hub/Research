import type { GuidelineDefinition } from "./types";

/**
 * SPIRIT 2013 trial protocol — condensed to the standard 33-item checklist
 * structure (item titles). See EQUATOR for full guidance.
 */
export const SPIRIT: GuidelineDefinition = {
  id: "SPIRIT",
  version: "2013",
  name: {
    en: "SPIRIT (trial protocol)",
    es: "SPIRIT (protocolo de ensayo)",
  },
  shortDescription: {
    en: "Protocols for clinical trials",
    es: "Protocolos de ensayos clínicos",
  },
  sourceUrl: "https://www.equator-network.org/reporting-guidelines/spirit-2013/",
  citation: "Chan A-W et al. SPIRIT 2013 statement. Ann Intern Med 2013;158:200–207.",
  sections: [
    {
      id: "admin",
      title: { en: "Administrative information", es: "Información administrativa" },
    },
    { id: "introduction", title: { en: "Introduction", es: "Introducción" } },
    { id: "methods", title: { en: "Methods", es: "Métodos" } },
    {
      id: "ethics",
      title: { en: "Ethics and dissemination", es: "Ética y difusión" },
    },
    { id: "appendices", title: { en: "Appendices", es: "Anexos" } },
  ],
  checklist: [
    {
      key: "spirit-01",
      code: "1",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "Descriptive title identifying study design, population, interventions, and trial acronym",
        es: "Título descriptivo con diseño, población, intervenciones y acrónimo",
      },
    },
    {
      key: "spirit-02a",
      code: "2a",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "Trial identifier and registry name; if not yet registered, name of intended registry",
        es: "Identificador del ensayo y registro; si no está registrado, registro previsto",
      },
    },
    {
      key: "spirit-02b",
      code: "2b",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "All items from the World Health Organization Trial Registration Data Set",
        es: "Todos los ítems del conjunto de datos de registro de ensayos de la OMS",
      },
    },
    {
      key: "spirit-03",
      code: "3",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "Date and version identifier",
        es: "Fecha e identificador de versión",
      },
    },
    {
      key: "spirit-04",
      code: "4",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "Sources and types of financial, material, and other support",
        es: "Fuentes y tipos de apoyo financiero, material y de otro tipo",
      },
    },
    {
      key: "spirit-05a",
      code: "5a",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "Names, affiliations, and roles of protocol contributors",
        es: "Nombres, afiliaciones y roles de los contribuidores del protocolo",
      },
    },
    {
      key: "spirit-05b",
      code: "5b",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "Name and contact information for the trial sponsor",
        es: "Nombre y contacto del promotor del ensayo",
      },
    },
    {
      key: "spirit-05c",
      code: "5c",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "Role of study sponsor and funders",
        es: "Rol del promotor y financiadores del estudio",
      },
    },
    {
      key: "spirit-05d",
      code: "5d",
      section: { en: "Administrative information", es: "Información administrativa" },
      title: {
        en: "Composition, roles, and responsibilities of the coordinating centre / committees",
        es: "Composición, roles y responsabilidades del centro coordinador / comités",
      },
    },
    {
      key: "spirit-06a",
      code: "6a",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Description of research question and justification for undertaking the trial",
        es: "Pregunta de investigación y justificación para realizar el ensayo",
      },
    },
    {
      key: "spirit-06b",
      code: "6b",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Explanation for choice of comparators",
        es: "Explicación de la elección de comparadores",
      },
    },
    {
      key: "spirit-07",
      code: "7",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "Specific objectives or hypotheses",
        es: "Objetivos o hipótesis específicos",
      },
    },
    {
      key: "spirit-08",
      code: "8",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Description of trial design including type of trial and allocation ratio",
        es: "Diseño del ensayo, tipo y ratio de asignación",
      },
    },
    {
      key: "spirit-09",
      code: "9",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Description of study settings and list of countries where data will be collected",
        es: "Escenarios del estudio y países donde se recopilarán datos",
      },
    },
    {
      key: "spirit-10",
      code: "10",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Inclusion and exclusion criteria for participants",
        es: "Criterios de inclusión y exclusión de participantes",
      },
    },
    {
      key: "spirit-11a",
      code: "11a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Interventions for each group with sufficient detail to allow replication",
        es: "Intervenciones por grupo con detalle suficiente para replicación",
      },
    },
    {
      key: "spirit-11b",
      code: "11b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Criteria for discontinuing or modifying allocated interventions",
        es: "Criterios para suspender o modificar intervenciones asignadas",
      },
    },
    {
      key: "spirit-11c",
      code: "11c",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Strategies to improve adherence to intervention protocols",
        es: "Estrategias para mejorar la adherencia a los protocolos",
      },
    },
    {
      key: "spirit-11d",
      code: "11d",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Relevant concomitant care and interventions that are permitted or prohibited",
        es: "Cuidados e intervenciones concomitantes permitidos o prohibidos",
      },
    },
    {
      key: "spirit-12",
      code: "12",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Primary, secondary, and other outcomes, including analysis metric and time point",
        es: "Desenlaces primario/secundarios: métrica de análisis y momento",
      },
    },
    {
      key: "spirit-13",
      code: "13",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Time schedule of enrolment, interventions, assessments, and visits",
        es: "Cronograma de enrolamiento, intervenciones, evaluaciones y visitas",
      },
    },
    {
      key: "spirit-14",
      code: "14",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Estimated number of participants needed and how sample size was determined",
        es: "Número estimado de participantes y cómo se determinó el tamaño muestral",
      },
    },
    {
      key: "spirit-15",
      code: "15",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Strategies for achieving adequate participant enrolment",
        es: "Estrategias para lograr un enrolamiento adecuado",
      },
    },
    {
      key: "spirit-16a",
      code: "16a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Method of generating the allocation sequence",
        es: "Método para generar la secuencia de asignación",
      },
    },
    {
      key: "spirit-16b",
      code: "16b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Mechanism of implementing the allocation sequence",
        es: "Mecanismo para implementar la secuencia de asignación",
      },
    },
    {
      key: "spirit-16c",
      code: "16c",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Who will generate the allocation sequence, enrol, and assign participants",
        es: "Quién generará la secuencia, enrolará y asignará participantes",
      },
    },
    {
      key: "spirit-17a",
      code: "17a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Who will be blinded after assignment to interventions",
        es: "Quién estará cegado tras la asignación a intervenciones",
      },
    },
    {
      key: "spirit-17b",
      code: "17b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "If blinded, circumstances under which unblinding is permissible",
        es: "Si hay cegamiento, circunstancias en que se permite el desenmascaramiento",
      },
    },
    {
      key: "spirit-18a",
      code: "18a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Plans for assessment and collection of outcome, baseline, and other data",
        es: "Planes de evaluación y recolección de desenlaces y datos basales",
      },
    },
    {
      key: "spirit-18b",
      code: "18b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Plans to promote participant retention and complete follow-up",
        es: "Planes para promover retención y seguimiento completo",
      },
    },
    {
      key: "spirit-19",
      code: "19",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Data management plans including coding, security, and storage",
        es: "Planes de gestión de datos: codificación, seguridad y almacenamiento",
      },
    },
    {
      key: "spirit-20a",
      code: "20a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Statistical methods for analysing primary and secondary outcomes",
        es: "Métodos estadísticos para desenlaces primario y secundarios",
      },
    },
    {
      key: "spirit-20b",
      code: "20b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Methods for any additional analyses (e.g. subgroup and adjusted analyses)",
        es: "Métodos para análisis adicionales (subgrupos, ajustados)",
      },
    },
    {
      key: "spirit-20c",
      code: "20c",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Definition of analysis population relating to protocol non-adherence",
        es: "Definición de la población de análisis ante no adherencia al protocolo",
      },
    },
    {
      key: "spirit-21a",
      code: "21a",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Composition of data monitoring committee; summary of its role",
        es: "Composición del comité de monitorización de datos; resumen de su rol",
      },
    },
    {
      key: "spirit-21b",
      code: "21b",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Description of any interim analyses and stopping guidelines",
        es: "Descripción de análisis interinos y reglas de detención",
      },
    },
    {
      key: "spirit-22",
      code: "22",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Plans for collecting, assessing, reporting, and managing solicited and spontaneously reported adverse events",
        es: "Planes para eventos adversos solicitados y espontáneos",
      },
    },
    {
      key: "spirit-23",
      code: "23",
      section: { en: "Methods", es: "Métodos" },
      title: {
        en: "Frequency and procedures for auditing trial conduct",
        es: "Frecuencia y procedimientos de auditoría de la conducta del ensayo",
      },
    },
    {
      key: "spirit-24",
      code: "24",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Plans for seeking research ethics committee / IRB approval",
        es: "Planes para solicitar aprobación ética / IRB",
      },
    },
    {
      key: "spirit-25",
      code: "25",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Plans for communicating important protocol modifications",
        es: "Planes para comunicar modificaciones importantes del protocolo",
      },
    },
    {
      key: "spirit-26a",
      code: "26a",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Who will obtain informed consent and how",
        es: "Quién obtendrá el consentimiento informado y cómo",
      },
    },
    {
      key: "spirit-26b",
      code: "26b",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Additional consent provisions for collection and use of participant data and biological specimens",
        es: "Consentimiento adicional para datos y especímenes biológicos",
      },
    },
    {
      key: "spirit-27",
      code: "27",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "How personal information about potential and enrolled participants will be collected, shared, and maintained",
        es: "Cómo se recopilará, compartirá y mantendrá la información personal",
      },
    },
    {
      key: "spirit-28",
      code: "28",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Financial and other competing interests for investigators",
        es: "Intereses financieros y otros conflictos de los investigadores",
      },
    },
    {
      key: "spirit-29",
      code: "29",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Statement of who will have access to the final trial dataset",
        es: "Quién tendrá acceso al conjunto de datos final del ensayo",
      },
    },
    {
      key: "spirit-30",
      code: "30",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Provisions for ancillary and post-trial care",
        es: "Disposiciones para cuidados auxiliares y post-ensayo",
      },
    },
    {
      key: "spirit-31a",
      code: "31a",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Plans for investigators and sponsor to communicate trial results",
        es: "Planes para comunicar resultados del ensayo",
      },
    },
    {
      key: "spirit-31b",
      code: "31b",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Authorship eligibility guidelines and any intended use of professional writers",
        es: "Criterios de autoría y uso previsto de redactores profesionales",
      },
    },
    {
      key: "spirit-31c",
      code: "31c",
      section: { en: "Ethics and dissemination", es: "Ética y difusión" },
      title: {
        en: "Plans for granting public access to the full protocol, participant-level dataset, and code",
        es: "Planes de acceso público a protocolo, datos y código",
      },
    },
    {
      key: "spirit-32",
      code: "32",
      section: { en: "Appendices", es: "Anexos" },
      title: {
        en: "Model consent form and other related documentation given to participants",
        es: "Modelo de consentimiento y documentación relacionada para participantes",
      },
    },
    {
      key: "spirit-33",
      code: "33",
      section: { en: "Appendices", es: "Anexos" },
      title: {
        en: "Plans for collection, laboratory evaluation, and storage of biological specimens",
        es: "Planes de recolección, evaluación y almacenamiento de especímenes biológicos",
      },
    },
  ],
};
