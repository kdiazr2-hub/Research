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
  | "ACCESS_DENIED";

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
