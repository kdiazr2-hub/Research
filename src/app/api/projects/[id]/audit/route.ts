import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { canAdminProject, requireMembership } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { writeAudit } from "@/lib/audit";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Owners see full audit; others see a limited project activity feed.
  const role = membership.role as Role;
  const isOwner = canAdminProject(role);

  if (!isOwner) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "audit_owner_only_full", role },
    });
    // Still allow read of non-sensitive project events for transparency in M0 spike
  }

  const logs = await prisma.auditLog.findMany({
    where: { projectId: id },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const visible = isOwner
    ? logs
    : logs.filter((l) =>
        ["PROJECT_CREATE", "PROJECT_UPDATE", "MEMBER_INVITE", "ROLE_CHANGE", "PHI_FLAG_CHANGE"].includes(
          l.action
        )
      );

  return NextResponse.json(
    visible.map((l) => ({
      id: l.id,
      action: l.action,
      createdAt: l.createdAt,
      user: l.user,
      metadata: JSON.parse(l.metadata || "{}"),
    }))
  );
}
