import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "PROJECT_CREATE"
  | "PROJECT_UPDATE"
  | "PROJECT_DELETE"
  | "MEMBER_INVITE"
  | "ROLE_CHANGE"
  | "PHI_FLAG_CHANGE"
  | "ACCESS_DENIED"
  | "DATA_FIELD_CREATE"
  | "DATA_FIELD_UPDATE"
  | "DATA_FIELD_PHI_MARK"
  | "DATA_ROW_CREATE"
  | "DATA_ROW_UPDATE"
  | "DATA_ROW_DELETE"
  | "DATA_CSV_IMPORT"
  | "DATA_CSV_EXPORT_RAW"
  | "DATA_CSV_EXPORT_DEID"
  | "NOTEBOOK_REGISTER"
  | "NOTEBOOK_UPDATE"
  | "NOTEBOOK_DELETE"
  | "ARTIFACT_REGISTER"
  | "ARTIFACT_DELETE"
  | "IMAGING_STUDY_CREATE"
  | "IMAGING_STUDY_UPDATE"
  | "IMAGING_UPLOAD"
  | "IMAGING_DOWNLOAD"
  | "IMAGING_WORKING_COPY"
  | "IMAGING_MARK_DELETE"
  | "IMAGING_PURGE_STUB"
  | "RETENTION_SET"
  | "SECURITY_CHECKLIST_VIEW";

export async function writeAudit(params: {
  userId?: string | null;
  projectId?: string | null;
  action: AuditAction | string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      userId: params.userId ?? null,
      projectId: params.projectId ?? null,
      action: params.action,
      metadata: JSON.stringify(params.metadata ?? {}),
    },
  });
}
