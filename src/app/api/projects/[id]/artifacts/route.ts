import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canRegisterAnalysis,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { isArtifactKind } from "@/lib/types";

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

  const artifacts = await prisma.analysisArtifact.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
    include: {
      notebook: { select: { id: true, title: true, kind: true } },
    },
  });

  return NextResponse.json({
    artifacts,
    canRegister: canRegisterAnalysis(membership.role as Role),
  });
}

const createSchema = z.object({
  title: z.string().min(1).max(200),
  kind: z.string().default("figure"),
  pathOrUrl: z.string().max(2000).optional(),
  notebookId: z.string().nullable().optional(),
  provenance: z
    .object({
      analysisExportId: z.string().optional(),
      datasetPath: z.string().optional(),
      notes: z.string().optional(),
      contentHash: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request, ctx: Ctx) {
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
  if (!canRegisterAnalysis(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_register_artifact", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  if (!isArtifactKind(parsed.data.kind)) {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }

  if (parsed.data.notebookId) {
    const nb = await prisma.notebook.findFirst({
      where: { id: parsed.data.notebookId, projectId: id },
    });
    if (!nb) {
      return NextResponse.json({ error: "notebook_not_found" }, { status: 400 });
    }
  }

  if (parsed.data.provenance?.analysisExportId) {
    const exp = await prisma.analysisExport.findFirst({
      where: {
        id: parsed.data.provenance.analysisExportId,
        projectId: id,
      },
    });
    if (!exp) {
      return NextResponse.json(
        { error: "analysis_export_not_found" },
        { status: 400 }
      );
    }
  }

  const artifact = await prisma.analysisArtifact.create({
    data: {
      projectId: id,
      notebookId: parsed.data.notebookId || null,
      title: parsed.data.title.trim(),
      kind: parsed.data.kind,
      pathOrUrl: parsed.data.pathOrUrl?.trim() ?? "",
      provenanceJson: JSON.stringify(parsed.data.provenance ?? {}),
      createdById: session.user.id,
    },
    include: {
      notebook: { select: { id: true, title: true, kind: true } },
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "ARTIFACT_REGISTER",
    metadata: {
      artifactId: artifact.id,
      kind: artifact.kind,
      notebookId: artifact.notebookId,
      provenance: parsed.data.provenance ?? {},
    },
  });

  return NextResponse.json({ artifact }, { status: 201 });
}
