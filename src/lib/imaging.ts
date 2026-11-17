import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

export const IMAGING_MODALITIES = [
  "CT",
  "MR",
  "XR",
  "US",
  "NM",
  "PT",
  "OT",
] as const;
export type ImagingModality = (typeof IMAGING_MODALITIES)[number];

export const IMAGING_FILE_KINDS = [
  "dicom",
  "png",
  "jpeg",
  "nifti",
  "other",
] as const;
export type ImagingFileKind = (typeof IMAGING_FILE_KINDS)[number];

export const RETENTION_STATUSES = [
  "ACTIVE",
  "MARKED_DELETE",
  "PURGED",
] as const;
export type RetentionStatus = (typeof RETENTION_STATUSES)[number];

export function isImagingModality(v: string): v is ImagingModality {
  return (IMAGING_MODALITIES as readonly string[]).includes(v);
}

export function isImagingFileKind(v: string): v is ImagingFileKind {
  return (IMAGING_FILE_KINDS as readonly string[]).includes(v);
}

export function isRetentionStatus(v: string): v is RetentionStatus {
  return (RETENTION_STATUSES as readonly string[]).includes(v);
}

/** Guess file kind from filename / mime. */
export function detectImagingKind(
  fileName: string,
  contentType: string
): ImagingFileKind {
  const lower = fileName.toLowerCase();
  if (
    lower.endsWith(".dcm") ||
    lower.endsWith(".dicom") ||
    contentType.includes("dicom")
  ) {
    return "dicom";
  }
  if (lower.endsWith(".nii") || lower.endsWith(".nii.gz")) return "nifti";
  if (lower.endsWith(".png") || contentType === "image/png") return "png";
  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    contentType === "image/jpeg"
  ) {
    return "jpeg";
  }
  return "other";
}

const ALLOWED_EXT = [
  ".dcm",
  ".dicom",
  ".png",
  ".jpg",
  ".jpeg",
  ".nii",
  ".nii.gz",
  ".zip",
];

export function isAllowedImagingUpload(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return ALLOWED_EXT.some((ext) => lower.endsWith(ext));
}

export type ImagingIdentifiers = {
  patientName?: string;
  patientId?: string;
  mrn?: string;
  accessionNumber?: string;
  institution?: string;
  [key: string]: string | undefined;
};

/** Keys treated as obvious identifiers — stripped from working-copy metadata. */
export const IDENTIFIER_KEYS = [
  "patientName",
  "patientId",
  "mrn",
  "accessionNumber",
  "institution",
  "PatientName",
  "PatientID",
  "PatientBirthDate",
  "PatientSex",
  "OtherPatientIDs",
  "OtherPatientNames",
  "ReferringPhysicianName",
  "PerformingPhysicianName",
  "OperatorsName",
  "InstitutionName",
  "InstitutionAddress",
  "StationName",
  "DeviceSerialNumber",
] as const;

export type WorkingCopyMetadata = {
  studyId: string;
  projectId: string;
  subjectKey: string;
  modality: string;
  studyDate: string | null;
  accessionStub: string;
  description: string;
  fileKind: string;
  /** Explicit: pixels / DICOM bytes are NOT included */
  pixelsIncluded: false;
  identifiersRedacted: true;
  note: string;
};

/** Build vault-safe working-copy metadata (no identifiers, no pixels). */
export function stripImagingIdentifiers(input: {
  studyId: string;
  projectId: string;
  subjectKey: string;
  modality: string;
  studyDate: Date | null;
  accessionStub: string;
  description: string;
  fileKind: string;
}): WorkingCopyMetadata {
  return {
    studyId: input.studyId,
    projectId: input.projectId,
    subjectKey: input.subjectKey,
    modality: input.modality,
    studyDate: input.studyDate ? input.studyDate.toISOString().slice(0, 10) : null,
    accessionStub: input.accessionStub,
    description: input.description,
    fileKind: input.fileKind,
    pixelsIncluded: false,
    identifiersRedacted: true,
    note:
      "Working copy: identifiers stripped. Imaging bytes stay in vault and are never sent to analysis notebooks by default.",
  };
}

function vaultKey(): Buffer | null {
  const raw = process.env.IMAGING_VAULT_KEY || "";
  if (!raw) return null;
  return createHash("sha256").update(raw).digest();
}

/**
 * Encrypt buffer for vault storage (AES-256-GCM).
 * If IMAGING_VAULT_KEY is unset, stores plaintext with a "plain:" prefix
 * (local-dev fallback; volume encryption still expected in production).
 */
export function encryptVaultBytes(plain: Buffer): Buffer {
  const key = vaultKey();
  if (!key) {
    return Buffer.concat([Buffer.from("plain:"), plain]);
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([Buffer.from("v1:"), iv, tag, enc]);
}

export function decryptVaultBytes(stored: Buffer): Buffer {
  if (stored.subarray(0, 6).toString() === "plain:") {
    return stored.subarray(6);
  }
  if (stored.subarray(0, 3).toString() !== "v1:") {
    throw new Error("unknown_vault_format");
  }
  const key = vaultKey();
  if (!key) {
    throw new Error("vault_key_required");
  }
  const iv = stored.subarray(3, 15);
  const tag = stored.subarray(15, 31);
  const enc = stored.subarray(31);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]);
}

export function makeAccessionStub(projectId: string, subjectKey: string): string {
  return (
    "ACC-" +
    createHash("sha256")
      .update(`${projectId}|${subjectKey}|${Date.now()}`)
      .digest("hex")
      .slice(0, 10)
      .toUpperCase()
  );
}
