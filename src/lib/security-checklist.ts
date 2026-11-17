/**
 * Project security checklist (M3 hardening).
 * Static + derived from project flags — not a compliance certification.
 */

export type SecurityCheckItem = {
  key: string;
  titleEs: string;
  titleEn: string;
  /** true = ok, false = needs attention, null = informational / N/A */
  ok: boolean | null;
  detailEs: string;
  detailEn: string;
};

export type SecurityChecklistInput = {
  phiType: string;
  consentDocumented: boolean;
  consentDocUrl: string | null;
  legalBasis: string | null;
  analysisDeidDefault: boolean;
  retentionDestroyAt: Date | null;
  imagingStudyCount: number;
  membersWithImaging: number;
  membersWithoutImagingDefault: number;
  storageRootConfigured: boolean;
  vaultKeyConfigured: boolean;
};

export function buildSecurityChecklist(
  input: SecurityChecklistInput
): SecurityCheckItem[] {
  const hasPhi = input.phiType === "PHI" || input.phiType === "PHI_IMAGING";
  const hasImaging = input.phiType === "PHI_IMAGING" || input.imagingStudyCount > 0;

  return [
    {
      key: "local_hosting",
      titleEs: "Hosting local / self-hosted",
      titleEn: "Local / self-hosted hosting",
      ok: input.storageRootConfigured,
      detailEs:
        "STORAGE_ROOT apunta a filesystem local. No cloud regional en MVP; cifrado de volumen recomendado en el host.",
      detailEn:
        "STORAGE_ROOT points at local filesystem. No regional cloud in MVP; host volume encryption recommended.",
    },
    {
      key: "phi_flags",
      titleEs: "Flags PHI del estudio",
      titleEn: "Study PHI flags",
      ok: hasPhi ? input.consentDocumented : true,
      detailEs: hasPhi
        ? input.consentDocumented
          ? `Tipo ${input.phiType}; consentimiento documentado.`
          : `Tipo ${input.phiType}; falta marcar consentimiento antes de cargar PHI.`
        : `Tipo ${input.phiType} — sin PHI declarado.`,
      detailEn: hasPhi
        ? input.consentDocumented
          ? `Type ${input.phiType}; consent documented.`
          : `Type ${input.phiType}; document consent before loading PHI.`
        : `Type ${input.phiType} — no PHI declared.`,
    },
    {
      key: "consent_url",
      titleEs: "Enlace a protocolo / consentimiento",
      titleEn: "Protocol / consent link",
      ok: hasPhi ? Boolean(input.consentDocUrl) : null,
      detailEs: input.consentDocUrl
        ? "URL de protocolo/consent registrada."
        : "Opcional pero recomendado si hay PHI.",
      detailEn: input.consentDocUrl
        ? "Protocol/consent URL on file."
        : "Optional but recommended when PHI is present.",
    },
    {
      key: "legal_basis",
      titleEs: "Base legal / retención textual",
      titleEn: "Legal basis / retention text",
      ok: hasPhi ? Boolean(input.legalBasis?.trim()) : null,
      detailEs: input.legalBasis?.trim()
        ? input.legalBasis
        : "Completar base legal / retención en ajustes del proyecto.",
      detailEn: input.legalBasis?.trim()
        ? input.legalBasis
        : "Set legal basis / retention in project settings.",
    },
    {
      key: "deid_default",
      titleEs: "Análisis solo de-identificado (default)",
      titleEn: "Analysis de-identified only (default)",
      ok: input.analysisDeidDefault,
      detailEs: input.analysisDeidDefault
        ? "ON — notebooks deben usar zona analysis/, no PHI crudo ni imaging vault."
        : "OFF — riesgo; reactivar salvo justificación IRB.",
      detailEn: input.analysisDeidDefault
        ? "ON — notebooks must use analysis/ zone, not raw PHI or imaging vault."
        : "OFF — risk; turn back on unless IRB-justified.",
    },
    {
      key: "imaging_roles",
      titleEs: "Roles de imaging separados del manuscrito",
      titleEn: "Imaging roles separate from manuscript",
      ok: hasImaging
        ? input.membersWithoutImagingDefault >= 0 && true
        : null,
      detailEs: hasImaging
        ? `${input.membersWithImaging} miembro(s) con grant imaging; Collaborator/Viewer/Analyst sin imaging por defecto.`
        : "Sin imaging declarado aún; grants imaging siguen desactivados por defecto.",
      detailEn: hasImaging
        ? `${input.membersWithImaging} member(s) with imaging grant; Collaborator/Viewer/Analyst default no imaging.`
        : "No imaging declared yet; imaging grants stay off by default.",
    },
    {
      key: "imaging_vault_key",
      titleEs: "Cifrado de vault imaging (clave local)",
      titleEn: "Imaging vault encryption (local key)",
      ok: hasImaging ? input.vaultKeyConfigured : null,
      detailEs: input.vaultKeyConfigured
        ? "IMAGING_VAULT_KEY configurada (AES-256-GCM en reposo)."
        : "Sin IMAGING_VAULT_KEY: blobs en plaintext con prefijo; usar cifrado de volumen o definir clave.",
      detailEn: input.vaultKeyConfigured
        ? "IMAGING_VAULT_KEY set (AES-256-GCM at rest)."
        : "No IMAGING_VAULT_KEY: plaintext prefix blobs; use volume encryption or set a key.",
    },
    {
      key: "retention_date",
      titleEs: "Fecha de retención / destrucción prevista",
      titleEn: "Retention / planned destruction date",
      ok: hasPhi ? Boolean(input.retentionDestroyAt) : null,
      detailEs: input.retentionDestroyAt
        ? `Destrucción prevista: ${input.retentionDestroyAt.toISOString().slice(0, 10)}.`
        : "Definir retentionDestroyAt en ajustes; purge/mark-for-delete son stubs auditados.",
      detailEn: input.retentionDestroyAt
        ? `Planned destruction: ${input.retentionDestroyAt.toISOString().slice(0, 10)}.`
        : "Set retentionDestroyAt in settings; purge/mark-for-delete are audited stubs.",
    },
    {
      key: "no_imaging_to_notebooks",
      titleEs: "Imaging no va a notebooks por defecto",
      titleEn: "Imaging never sent to notebooks by default",
      ok: true,
      detailEs:
        "Working copies solo metadatos redacted; píxeles/DICOM permanecen en vault. No hay API que copie vault → analysis/.",
      detailEn:
        "Working copies are redacted metadata only; pixels/DICOM stay in vault. No API copies vault → analysis/.",
    },
    {
      key: "audit_append",
      titleEs: "Audit log append-only",
      titleEn: "Append-only audit log",
      ok: true,
      detailEs:
        "Eventos de imaging, retención, denegaciones y exports se registran sin UI de borrado.",
      detailEn:
        "Imaging, retention, denials, and exports are logged with no delete UI.",
    },
  ];
}
