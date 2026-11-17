import type { GuidelineDefinition } from "./types";

/** CARE 2013 case report checklist — item titles from the public CARE statement structure. */
export const CARE: GuidelineDefinition = {
  id: "CARE",
  version: "2013",
  name: { en: "CARE (case report)", es: "CARE (reporte de caso)" },
  shortDescription: {
    en: "Case reports of individual patients",
    es: "Reportes de caso de pacientes individuales",
  },
  sourceUrl: "https://www.equator-network.org/reporting-guidelines/care/",
  citation: "Gagnier JJ et al. CARE guidelines. BMJ Case Reports / EQUATOR Network, 2013.",
  sections: [
    { id: "title", title: { en: "Title", es: "Título" } },
    { id: "keywords", title: { en: "Keywords", es: "Palabras clave" } },
    { id: "abstract", title: { en: "Abstract", es: "Resumen" } },
    { id: "introduction", title: { en: "Introduction", es: "Introducción" } },
    {
      id: "patient",
      title: { en: "Patient information", es: "Información del paciente" },
    },
    {
      id: "findings",
      title: { en: "Clinical findings", es: "Hallazgos clínicos" },
    },
    { id: "timeline", title: { en: "Timeline", es: "Línea de tiempo" } },
    {
      id: "diagnostic",
      title: { en: "Diagnostic assessment", es: "Evaluación diagnóstica" },
    },
    {
      id: "intervention",
      title: { en: "Therapeutic intervention", es: "Intervención terapéutica" },
    },
    {
      id: "followup",
      title: { en: "Follow-up and outcomes", es: "Seguimiento y desenlaces" },
    },
    { id: "discussion", title: { en: "Discussion", es: "Discusión" } },
    {
      id: "perspective",
      title: { en: "Patient perspective", es: "Perspectiva del paciente" },
    },
    {
      id: "consent",
      title: { en: "Informed consent", es: "Consentimiento informado" },
    },
  ],
  checklist: [
    {
      key: "care-01",
      code: "1",
      section: { en: "Title", es: "Título" },
      title: {
        en: "The diagnosis or intervention of primary focus followed by the words “case report”",
        es: "Diagnóstico o intervención principal seguido de las palabras “reporte de caso”",
      },
    },
    {
      key: "care-02",
      code: "2",
      section: { en: "Keywords", es: "Palabras clave" },
      title: {
        en: "2 to 5 key words that identify diagnoses or interventions in this case report",
        es: "2 a 5 palabras clave que identifiquen diagnósticos o intervenciones",
      },
    },
    {
      key: "care-03a",
      code: "3a",
      section: { en: "Abstract", es: "Resumen" },
      title: {
        en: "Introduction — What is unique about this case?",
        es: "Introducción — ¿Qué tiene de único este caso?",
      },
    },
    {
      key: "care-03b",
      code: "3b",
      section: { en: "Abstract", es: "Resumen" },
      title: {
        en: "Main symptoms and/or important clinical findings",
        es: "Síntomas principales y/o hallazgos clínicos importantes",
      },
    },
    {
      key: "care-03c",
      code: "3c",
      section: { en: "Abstract", es: "Resumen" },
      title: {
        en: "The main diagnoses, therapeutic interventions, and outcomes",
        es: "Diagnósticos principales, intervenciones y desenlaces",
      },
    },
    {
      key: "care-03d",
      code: "3d",
      section: { en: "Abstract", es: "Resumen" },
      title: {
        en: "Conclusion — What are the main “take-away” lessons?",
        es: "Conclusión — ¿Cuáles son las lecciones principales?",
      },
    },
    {
      key: "care-04",
      code: "4",
      section: { en: "Introduction", es: "Introducción" },
      title: {
        en: "One or two paragraphs summarizing why this case is unique",
        es: "Uno o dos párrafos que resuman por qué este caso es único",
      },
    },
    {
      key: "care-05a",
      code: "5a",
      section: { en: "Patient information", es: "Información del paciente" },
      title: {
        en: "De-identified demographic information and other patient-specific information",
        es: "Información demográfica desidentificada y datos específicos del paciente",
      },
    },
    {
      key: "care-05b",
      code: "5b",
      section: { en: "Patient information", es: "Información del paciente" },
      title: {
        en: "Main concerns and symptoms of the patient",
        es: "Principales preocupaciones y síntomas del paciente",
      },
    },
    {
      key: "care-05c",
      code: "5c",
      section: { en: "Patient information", es: "Información del paciente" },
      title: {
        en: "Medical, family, and psychosocial history including relevant genetic information",
        es: "Antecedentes médicos, familiares y psicosociales (genética relevante)",
      },
    },
    {
      key: "care-05d",
      code: "5d",
      section: { en: "Patient information", es: "Información del paciente" },
      title: {
        en: "Relevant past interventions and their outcomes",
        es: "Intervenciones previas relevantes y sus resultados",
      },
    },
    {
      key: "care-06",
      code: "6",
      section: { en: "Clinical findings", es: "Hallazgos clínicos" },
      title: {
        en: "Describe the relevant physical examination (PE) and other significant clinical findings",
        es: "Describir la exploración física y otros hallazgos clínicos significativos",
      },
    },
    {
      key: "care-07",
      code: "7",
      section: { en: "Timeline", es: "Línea de tiempo" },
      title: {
        en: "Historical and current information from this episode of care organized as a timeline",
        es: "Información histórica y actual de este episodio organizada como línea de tiempo",
      },
    },
    {
      key: "care-08a",
      code: "8a",
      section: { en: "Diagnostic assessment", es: "Evaluación diagnóstica" },
      title: {
        en: "Diagnostic methods (PE, laboratory testing, imaging, surveys)",
        es: "Métodos diagnósticos (exploración, laboratorio, imagen, encuestas)",
      },
    },
    {
      key: "care-08b",
      code: "8b",
      section: { en: "Diagnostic assessment", es: "Evaluación diagnóstica" },
      title: {
        en: "Diagnostic challenges (access, financial, or cultural)",
        es: "Retos diagnósticos (acceso, económicos o culturales)",
      },
    },
    {
      key: "care-08c",
      code: "8c",
      section: { en: "Diagnostic assessment", es: "Evaluación diagnóstica" },
      title: {
        en: "Diagnosis (including other diagnoses considered)",
        es: "Diagnóstico (incluidos otros diagnósticos considerados)",
      },
    },
    {
      key: "care-08d",
      code: "8d",
      section: { en: "Diagnostic assessment", es: "Evaluación diagnóstica" },
      title: {
        en: "Prognostic characteristics (e.g. staging) where applicable",
        es: "Características pronósticas (p. ej. estadificación) cuando aplique",
      },
    },
    {
      key: "care-09a",
      code: "9a",
      section: { en: "Therapeutic intervention", es: "Intervención terapéutica" },
      title: {
        en: "Types of intervention (pharmacologic, surgical, preventive, self-care)",
        es: "Tipos de intervención (farmacológica, quirúrgica, preventiva, autocuidado)",
      },
    },
    {
      key: "care-09b",
      code: "9b",
      section: { en: "Therapeutic intervention", es: "Intervención terapéutica" },
      title: {
        en: "Administration of intervention (dosage, strength, duration)",
        es: "Administración de la intervención (dosis, potencia, duración)",
      },
    },
    {
      key: "care-09c",
      code: "9c",
      section: { en: "Therapeutic intervention", es: "Intervención terapéutica" },
      title: {
        en: "Changes in intervention (with rationale)",
        es: "Cambios en la intervención (con justificación)",
      },
    },
    {
      key: "care-10a",
      code: "10a",
      section: { en: "Follow-up and outcomes", es: "Seguimiento y desenlaces" },
      title: {
        en: "Clinician- and patient-assessed outcomes",
        es: "Desenlaces evaluados por clínico y paciente",
      },
    },
    {
      key: "care-10b",
      code: "10b",
      section: { en: "Follow-up and outcomes", es: "Seguimiento y desenlaces" },
      title: {
        en: "Important follow-up diagnostic and other test results",
        es: "Resultados importantes de pruebas de seguimiento",
      },
    },
    {
      key: "care-10c",
      code: "10c",
      section: { en: "Follow-up and outcomes", es: "Seguimiento y desenlaces" },
      title: {
        en: "Intervention adherence and tolerability",
        es: "Adherencia y tolerabilidad de la intervención",
      },
    },
    {
      key: "care-10d",
      code: "10d",
      section: { en: "Follow-up and outcomes", es: "Seguimiento y desenlaces" },
      title: {
        en: "Adverse and unanticipated events",
        es: "Eventos adversos e inesperados",
      },
    },
    {
      key: "care-11a",
      code: "11a",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Strengths and limitations in your approach to this case",
        es: "Fortalezas y limitaciones del abordaje de este caso",
      },
    },
    {
      key: "care-11b",
      code: "11b",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "Discussion of the relevant medical literature",
        es: "Discusión de la literatura médica relevante",
      },
    },
    {
      key: "care-11c",
      code: "11c",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "The rationale for conclusions",
        es: "Fundamento de las conclusiones",
      },
    },
    {
      key: "care-11d",
      code: "11d",
      section: { en: "Discussion", es: "Discusión" },
      title: {
        en: "The primary “take-away” lessons of this case report",
        es: "Lecciones principales (“take-away”) de este reporte de caso",
      },
    },
    {
      key: "care-12",
      code: "12",
      section: { en: "Patient perspective", es: "Perspectiva del paciente" },
      title: {
        en: "The patient should share their perspective on the treatment(s) they received",
        es: "El paciente debe compartir su perspectiva sobre el/los tratamiento(s)",
      },
    },
    {
      key: "care-13",
      code: "13",
      section: { en: "Informed consent", es: "Consentimiento informado" },
      title: {
        en: "Did the patient give informed consent? Please provide if requested",
        es: "¿El paciente dio consentimiento informado? Proporcionarlo si se solicita",
      },
    },
  ],
};
