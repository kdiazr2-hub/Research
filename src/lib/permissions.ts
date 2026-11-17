import type { Role } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { writeAudit } from "@/lib/audit";

/** Role hierarchy for project administration (higher = more privilege). */
const ROLE_RANK: Record<Role, number> = {
  VIEWER: 1,
  ANALYST: 2,
  COLLABORATOR: 3,
  INVESTIGATOR: 4,
  OWNER: 5,
};

export function roleAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function canAdminProject(role: Role): boolean {
  return role === "OWNER";
}

export function canEditProjectMeta(role: Role): boolean {
  return role === "OWNER" || role === "INVESTIGATOR";
}

export function canInvite(role: Role): boolean {
  return role === "OWNER";
}

/** Library / notes / draft write: Owner, Investigator, Collaborator. */
export function canEditLiterature(role: Role): boolean {
  return (
    role === "OWNER" || role === "INVESTIGATOR" || role === "COLLABORATOR"
  );
}

/** All members can read literature; Analyst/Viewer are read-only. */
export function canReadLiterature(role: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.VIEWER;
}

/**
 * Literature refs are scientific metadata (not patient PHI).
 * Analysts may read the library/notes/draft but never gain PHI/imaging
 * privileges merely by opening references.
 */
export function literatureIsPhiSafe(_role: Role): boolean {
  return true;
}

export async function requireMembership(
  userId: string,
  projectId: string,
  options?: { minRole?: Role; auditOnDeny?: boolean }
) {
  const membership = await prisma.membership.findUnique({
    where: { projectId_userId: { projectId, userId } },
    include: { project: true },
  });

  if (!membership) {
    if (options?.auditOnDeny !== false) {
      await writeAudit({
        userId,
        projectId,
        action: "ACCESS_DENIED",
        metadata: { reason: "not_a_member" },
      });
    }
    return null;
  }

  const role = membership.role as Role;

  if (options?.minRole && !roleAtLeast(role, options.minRole)) {
    if (options?.auditOnDeny !== false) {
      await writeAudit({
        userId,
        projectId,
        action: "ACCESS_DENIED",
        metadata: {
          reason: "insufficient_role",
          role,
          required: options.minRole,
        },
      });
    }
    return null;
  }

  return membership;
}
