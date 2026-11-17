import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canRegisterAnalysis,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";

type Ctx = { params: Promise<{ id: string; artifactId: string }> };

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, artifactId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canRegisterAnalysis(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.analysisArtifact.findFirst({
    where: { id: artifactId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.analysisArtifact.delete({ where: { id: artifactId } });
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "ARTIFACT_DELETE",
    metadata: { artifactId, title: existing.title },
  });

  return NextResponse.json({ ok: true });
}
