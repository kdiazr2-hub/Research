import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import { isPhiType, PHI_TYPES, PROJECT_STATUSES } from "@/lib/types";
import {
  isReportingGuideline,
  REPORTING_GUIDELINES,
  REPORTING_GUIDELINE_VERSIONS,
} from "@/lib/reporting-guidelines";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  reportingGuideline: z.enum(REPORTING_GUIDELINES).optional(),
  phiType: z.enum(PHI_TYPES).optional(),
  consentDocumented: z.boolean().optional(),
  consentDocUrl: z.string().url().optional().nullable(),
  legalBasis: z.string().max(500).optional().nullable(),
  analysisDeidDefault: z.boolean().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
});

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        include: {
          _count: { select: { memberships: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    memberships.map((m) => ({
      role: m.role,
      canViewPhi: m.canViewPhi,
      canViewImaging: m.canViewImaging,
      project: m.project,
    }))
  );
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const phiType = parsed.data.phiType ?? "NONE";
  if (!isPhiType(phiType)) {
    return NextResponse.json({ error: "invalid_phi_type" }, { status: 400 });
  }

  const reportingGuideline = parsed.data.reportingGuideline ?? "OTHER";
  if (!isReportingGuideline(reportingGuideline)) {
    return NextResponse.json({ error: "invalid_guideline" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? "",
      reportingGuideline,
      reportingGuidelineVersion:
        REPORTING_GUIDELINE_VERSIONS[reportingGuideline],
      phiType,
      consentDocumented: parsed.data.consentDocumented ?? false,
      consentDocUrl: parsed.data.consentDocUrl ?? null,
      legalBasis: parsed.data.legalBasis ?? null,
      analysisDeidDefault: parsed.data.analysisDeidDefault ?? true,
      status: parsed.data.status ?? "LITERATURE",
      memberships: {
        create: {
          userId: session.user.id,
          role: "OWNER",
          canViewPhi: phiType !== "NONE",
          canViewImaging: phiType === "PHI_IMAGING",
        },
      },
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: project.id,
    action: "PROJECT_CREATE",
    metadata: {
      name: project.name,
      phiType: project.phiType,
      reportingGuideline: project.reportingGuideline,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
