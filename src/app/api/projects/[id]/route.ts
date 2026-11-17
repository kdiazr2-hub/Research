import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canAdminProject,
  canEditProjectMeta,
  requireMembership,
} from "@/lib/permissions";
import { isPhiType, PHI_TYPES, PROJECT_STATUSES, type Role } from "@/lib/types";
import {
  isReportingGuideline,
  REPORTING_GUIDELINES,
  REPORTING_GUIDELINE_VERSIONS,
} from "@/lib/reporting-guidelines";

type Ctx = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  reportingGuideline: z.enum(REPORTING_GUIDELINES).optional(),
  phiType: z.enum(PHI_TYPES).optional(),
  consentDocumented: z.boolean().optional(),
  consentDocUrl: z.string().url().nullable().optional(),
  legalBasis: z.string().max(500).nullable().optional(),
  analysisDeidDefault: z.boolean().optional(),
  retentionDestroyAt: z.string().datetime().nullable().optional(),
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

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          user: { select: { id: true, email: true, name: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json({
    project,
    membership: {
      role: membership.role,
      canViewPhi: membership.canViewPhi,
      canViewImaging: membership.canViewImaging,
    },
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
  if (!canEditProjectMeta(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_edit_project", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const data = parsed.data;
  const phiChanging =
    data.phiType !== undefined ||
    data.consentDocumented !== undefined ||
    data.consentDocUrl !== undefined ||
    data.legalBasis !== undefined ||
    data.analysisDeidDefault !== undefined ||
    data.retentionDestroyAt !== undefined;

  if (phiChanging && !canAdminProject(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "phi_flags_owner_only", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (data.phiType && !isPhiType(data.phiType)) {
    return NextResponse.json({ error: "invalid_phi_type" }, { status: 400 });
  }

  if (data.reportingGuideline && !isReportingGuideline(data.reportingGuideline)) {
    return NextResponse.json({ error: "invalid_guideline" }, { status: 400 });
  }

  const before = membership.project;

  const project = await prisma.project.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
      reportingGuideline: data.reportingGuideline,
      reportingGuidelineVersion: data.reportingGuideline
        ? REPORTING_GUIDELINE_VERSIONS[data.reportingGuideline]
        : undefined,
      phiType: data.phiType,
      consentDocumented: data.consentDocumented,
      consentDocUrl: data.consentDocUrl,
      legalBasis: data.legalBasis,
      analysisDeidDefault: data.analysisDeidDefault,
      retentionDestroyAt:
        data.retentionDestroyAt === undefined
          ? undefined
          : data.retentionDestroyAt === null
            ? null
            : new Date(data.retentionDestroyAt),
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "PROJECT_UPDATE",
    metadata: { fields: Object.keys(data) },
  });

  if (phiChanging) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "PHI_FLAG_CHANGE",
      metadata: {
        before: {
          phiType: before.phiType,
          consentDocumented: before.consentDocumented,
          analysisDeidDefault: before.analysisDeidDefault,
        },
        after: {
          phiType: project.phiType,
          consentDocumented: project.consentDocumented,
          analysisDeidDefault: project.analysisDeidDefault,
        },
      },
    });
  }

  return NextResponse.json(project);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id, {
    minRole: "OWNER",
  });
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id } });
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "PROJECT_DELETE",
    metadata: { name: membership.project.name },
  });

  return NextResponse.json({ ok: true });
}
