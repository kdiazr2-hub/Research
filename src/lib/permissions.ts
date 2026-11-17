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

/**
 * Raw PHI table access: Owner always; Investigator only with canViewPhi grant.
 * Collaborator / Analyst / Viewer default to no PHI table access.
 */
export function canAccessPhiTable(role: Role, canViewPhi: boolean): boolean {
  if (role === "OWNER") return true;
  if (role === "INVESTIGATOR" && canViewPhi) return true;
  return false;
}

/**
 * Define / edit field schema: Owner or Investigator.
 * Marking a field as PHI still requires canAccessPhiTable (Owner / Inv+grant).
 */
export function canEditDataSchema(role: Role, _canViewPhi: boolean): boolean {
  return role === "OWNER" || role === "INVESTIGATOR";
}

/**
 * Enter / edit rows that may contain PHI values.
 * Owner / Investigator+PHI only. Collaborators do not get PHI table write.
 */
export function canEditPhiRows(role: Role, canViewPhi: boolean): boolean {
  return canAccessPhiTable(role, canViewPhi);
}

/**
 * Collaborator may help with non-PHI column entry when they lack PHI grant.
 * Analyst/Viewer never write tabular data.
 */
export function canEditNonPhiRows(role: Role): boolean {
  return (
    role === "OWNER" ||
    role === "INVESTIGATOR" ||
    role === "COLLABORATOR"
  );
}

/** Any member may list / download de-identified analysis datasets. */
export function canReadDeid(role: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.VIEWER;
}

/**
 * Trigger a de-ID export into analysis/: Owner, Investigator, Collaborator, Analyst.
 * Viewers may download existing de-ID exports but not create new ones.
 */
export function canRunDeidExport(role: Role): boolean {
  return (
    role === "OWNER" ||
    role === "INVESTIGATOR" ||
    role === "COLLABORATOR" ||
    role === "ANALYST"
  );
}

/** Register notebooks / artifacts: Owner, Investigator, Collaborator, Analyst. */
export function canRegisterAnalysis(role: Role): boolean {
  return (
    role === "OWNER" ||
    role === "INVESTIGATOR" ||
    role === "COLLABORATOR" ||
    role === "ANALYST"
  );
}

/** Raw PHI CSV export (not de-ID) — same gate as PHI table access. */
export function canExportRawPhi(role: Role, canViewPhi: boolean): boolean {
  return canAccessPhiTable(role, canViewPhi);
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
