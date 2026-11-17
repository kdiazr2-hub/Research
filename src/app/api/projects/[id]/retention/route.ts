import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canManageRetention,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  retentionDestroyAt: z.string().datetime().nullable(),
});

/** GET project retention summary; PATCH set project-level retention date (Owner). */
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

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      retentionDestroyAt: true,
      legalBasis: true,
      phiType: true,
    },
  });
  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [active, marked, purged] = await Promise.all([
    prisma.imagingStudy.count({
      where: { projectId: id, retentionStatus: "ACTIVE" },
    }),
    prisma.imagingStudy.count({
      where: { projectId: id, retentionStatus: "MARKED_DELETE" },
    }),
    prisma.imagingStudy.count({
      where: { projectId: id, retentionStatus: "PURGED" },
    }),
  ]);

  return NextResponse.json({
    retentionDestroyAt: project.retentionDestroyAt,
    legalBasis: project.legalBasis,
    phiType: project.phiType,
    imaging: { active, markedDelete: marked, purged },
    note: "Purge/mark-for-delete are audited stubs; scheduled batch purge deferred.",
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
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
  if (!canManageRetention(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "retention_owner_only", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const before = membership.project.retentionDestroyAt;
  const project = await prisma.project.update({
    where: { id },
    data: {
      retentionDestroyAt:
        parsed.data.retentionDestroyAt === null
          ? null
          : new Date(parsed.data.retentionDestroyAt),
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "RETENTION_SET",
    metadata: {
      before: before?.toISOString() ?? null,
      after: project.retentionDestroyAt?.toISOString() ?? null,
    },
  });

  return NextResponse.json({
    retentionDestroyAt: project.retentionDestroyAt,
  });
}
