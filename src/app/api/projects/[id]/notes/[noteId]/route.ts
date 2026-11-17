import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canEditLiterature,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";

type Ctx = { params: Promise<{ id: string; noteId: string }> };

const updateSchema = z.object({
  title: z.string().max(300).optional(),
  body: z.string().max(50_000).optional(),
  pageStub: z.string().max(40).optional(),
  highlightStub: z.string().max(2000).optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, noteId } = await ctx.params;
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
      metadata: { reason: "cannot_edit_notes", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const existing = await prisma.note.findFirst({
    where: { id: noteId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const note = await prisma.note.update({
    where: { id: noteId },
    data: parsed.data,
    include: {
      reference: { select: { id: true, citeKey: true, title: true } },
      author: { select: { id: true, email: true, name: true } },
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "NOTE_UPDATE",
    metadata: { noteId },
  });

  return NextResponse.json({ note });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, noteId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canEditLiterature(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.note.findFirst({
    where: { id: noteId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.note.delete({ where: { id: noteId } });
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "NOTE_DELETE",
    metadata: { noteId },
  });

  return NextResponse.json({ ok: true });
}
