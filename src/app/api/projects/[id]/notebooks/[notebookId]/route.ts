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
import { isNotebookKind } from "@/lib/types";
import { jupyterDeepLink } from "@/lib/data-access";

type Ctx = { params: Promise<{ id: string; notebookId: string }> };

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  kind: z.string().optional(),
  externalPath: z.string().max(2000).optional(),
  description: z.string().max(2000).optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, notebookId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canRegisterAnalysis(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.notebook.findFirst({
    where: { id: notebookId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  if (parsed.data.kind && !isNotebookKind(parsed.data.kind)) {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }

  const notebook = await prisma.notebook.update({
    where: { id: notebookId },
    data: {
      title: parsed.data.title?.trim(),
      kind: parsed.data.kind,
      externalPath: parsed.data.externalPath?.trim(),
      description: parsed.data.description?.trim(),
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "NOTEBOOK_UPDATE",
    metadata: { notebookId: notebook.id },
  });

  return NextResponse.json({
    notebook: {
      ...notebook,
      openHint: notebook.externalPath
        ? jupyterDeepLink(notebook.externalPath)
        : null,
    },
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, notebookId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canRegisterAnalysis(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.notebook.findFirst({
    where: { id: notebookId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.notebook.delete({ where: { id: notebookId } });
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "NOTEBOOK_DELETE",
    metadata: { notebookId, title: existing.title },
  });

  return NextResponse.json({ ok: true });
}
