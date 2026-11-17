import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canEditLiterature,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { storageRoot } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string; refId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, refId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const reference = await prisma.reference.findFirst({
    where: { id: refId, projectId: id },
    include: {
      notes: {
        orderBy: { updatedAt: "desc" },
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
      },
    },
  });
  if (!reference) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    reference,
    canEdit: canEditLiterature(membership.role as Role),
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, refId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canEditLiterature(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_delete_reference", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const reference = await prisma.reference.findFirst({
    where: { id: refId, projectId: id },
  });
  if (!reference) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (reference.pdfPath) {
    const abs = path.join(storageRoot(), reference.pdfPath);
    await unlink(abs).catch(() => undefined);
  }

  await prisma.reference.delete({ where: { id: refId } });
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "REFERENCE_DELETE",
    metadata: { citeKey: reference.citeKey },
  });

  return NextResponse.json({ ok: true });
}
