import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { canViewFullAudit, requireMembership } from "@/lib/permissions";
import type { Role } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

const LIMITED_ACTIONS = [
  "PROJECT_CREATE",
  "PROJECT_UPDATE",
  "MEMBER_INVITE",
  "ROLE_CHANGE",
  "PHI_FLAG_CHANGE",
  "GUIDELINE_CHANGE",
  "DATA_FIELD_PHI_MARK",
  "DATA_CSV_EXPORT_DEID",
  "NOTEBOOK_REGISTER",
  "RETENTION_SET",
  "IMAGING_MARK_DELETE",
  "IMAGING_PURGE_STUB",
];

/** Hardened audit feed with action / user / date filters (M3). */
export async function GET(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  const isOwner = canViewFullAudit(role);
  const url = new URL(req.url);
  const action = url.searchParams.get("action")?.trim() || "";
  const userEmail = url.searchParams.get("user")?.trim().toLowerCase() || "";
  const q = url.searchParams.get("q")?.trim().toLowerCase() || "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const take = Math.min(
    Number(url.searchParams.get("limit") || "100") || 100,
    500
  );

  const createdAt: { gte?: Date; lte?: Date } = {};
  if (from) {
    const d = new Date(from);
    if (!Number.isNaN(d.getTime())) createdAt.gte = d;
  }
  if (to) {
    const d = new Date(to);
    if (!Number.isNaN(d.getTime())) createdAt.lte = d;
  }

  const logs = await prisma.auditLog.findMany({
    where: {
      projectId: id,
      ...(action ? { action } : {}),
      ...(Object.keys(createdAt).length ? { createdAt } : {}),
      ...(userEmail
        ? { user: { email: { contains: userEmail } } }
        : {}),
    },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: isOwner ? take : Math.min(take, 100),
  });

  let visible = isOwner
    ? logs
    : logs.filter((l) => LIMITED_ACTIONS.includes(l.action));

  if (q) {
    visible = visible.filter((l) => {
      const hay = `${l.action} ${l.user?.email ?? ""} ${l.metadata}`.toLowerCase();
      return hay.includes(q);
    });
  }

  // Distinct actions for filter UI
  const actionRows = await prisma.auditLog.findMany({
    where: { projectId: id },
    select: { action: true },
    distinct: ["action"],
    orderBy: { action: "asc" },
  });

  return NextResponse.json({
    fullAccess: isOwner,
    actions: actionRows
      .map((a) => a.action)
      .filter((a) => (isOwner ? true : LIMITED_ACTIONS.includes(a))),
    entries: visible.map((l) => ({
      id: l.id,
      action: l.action,
      createdAt: l.createdAt,
      user: l.user,
      metadata: JSON.parse(l.metadata || "{}"),
      metadataRaw: l.metadata,
    })),
  });
}
