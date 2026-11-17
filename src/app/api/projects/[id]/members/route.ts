import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import { canInvite, requireMembership } from "@/lib/permissions";
import { isRole, type Role } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

const inviteRoles = ["INVESTIGATOR", "COLLABORATOR", "ANALYST", "VIEWER"] as const;

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(inviteRoles),
  canViewPhi: z.boolean().optional(),
  canViewImaging: z.boolean().optional(),
});

const roleChangeSchema = z.object({
  membershipId: z.string().min(1),
  role: z.enum(["OWNER", "INVESTIGATOR", "COLLABORATOR", "ANALYST", "VIEWER"]),
  canViewPhi: z.boolean().optional(),
  canViewImaging: z.boolean().optional(),
});

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

  const members = await prisma.membership.findMany({
    where: { projectId: id },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(members);
}

export async function POST(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership || !canInvite(membership.role as Role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "invite_owner_only" },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: "user_not_found", hint: "Register the user first in M0" },
      { status: 404 }
    );
  }

  const existing = await prisma.membership.findUnique({
    where: { projectId_userId: { projectId: id, userId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "already_member" }, { status: 409 });
  }

  const created = await prisma.membership.create({
    data: {
      projectId: id,
      userId: user.id,
      role: parsed.data.role,
      canViewPhi: parsed.data.canViewPhi ?? false,
      canViewImaging: parsed.data.canViewImaging ?? false,
    },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "MEMBER_INVITE",
    metadata: {
      invitedUserId: user.id,
      email: user.email,
      role: created.role,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership || !canInvite(membership.role as Role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "role_change_owner_only" },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = roleChangeSchema.safeParse(body);
  if (!parsed.success || !isRole(parsed.data.role)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const target = await prisma.membership.findFirst({
    where: { id: parsed.data.membershipId, projectId: id },
  });
  if (!target) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (target.role === "OWNER" && parsed.data.role !== "OWNER") {
    const ownerCount = await prisma.membership.count({
      where: { projectId: id, role: "OWNER" },
    });
    if (ownerCount <= 1) {
      return NextResponse.json(
        { error: "last_owner" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.membership.update({
    where: { id: target.id },
    data: {
      role: parsed.data.role,
      canViewPhi: parsed.data.canViewPhi,
      canViewImaging: parsed.data.canViewImaging,
    },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "ROLE_CHANGE",
    metadata: {
      membershipId: target.id,
      targetUserId: target.userId,
      from: target.role,
      to: updated.role,
      canViewPhi: updated.canViewPhi,
      canViewImaging: updated.canViewImaging,
    },
  });

  return NextResponse.json(updated);
}
