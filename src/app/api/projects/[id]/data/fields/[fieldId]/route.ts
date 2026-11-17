import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canAccessPhiTable,
  canEditDataSchema,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { isDeidMode, isFieldType } from "@/lib/types";

type Ctx = { params: Promise<{ id: string; fieldId: string }> };

const patchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  fieldType: z.string().optional(),
  isPhi: z.boolean().optional(),
  deidMode: z.string().optional(),
  position: z.number().int().optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, fieldId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canEditDataSchema(role, membership.canViewPhi)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_edit_data_schema", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.dataField.findFirst({
    where: { id: fieldId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (parsed.data.fieldType && !isFieldType(parsed.data.fieldType)) {
    return NextResponse.json({ error: "invalid_field_type" }, { status: 400 });
  }
  if (parsed.data.deidMode && !isDeidMode(parsed.data.deidMode)) {
    return NextResponse.json({ error: "invalid_deid_mode" }, { status: 400 });
  }

  const nextIsPhi = parsed.data.isPhi ?? existing.isPhi;
  if (
    (parsed.data.isPhi === true || existing.isPhi) &&
    !canAccessPhiTable(role, membership.canViewPhi)
  ) {
    return NextResponse.json({ error: "forbidden_phi_mark" }, { status: 403 });
  }

  const wasPhi = existing.isPhi;
  const field = await prisma.dataField.update({
    where: { id: fieldId },
    data: {
      name: parsed.data.name?.trim(),
      fieldType: parsed.data.fieldType,
      isPhi: parsed.data.isPhi,
      deidMode: parsed.data.deidMode,
      position: parsed.data.position,
    },
  });

  const phiChanged =
    parsed.data.isPhi !== undefined && parsed.data.isPhi !== wasPhi;

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: phiChanged ? "DATA_FIELD_PHI_MARK" : "DATA_FIELD_UPDATE",
    metadata: {
      fieldId: field.id,
      key: field.key,
      isPhi: field.isPhi,
      wasPhi,
      deidMode: field.deidMode,
      nextIsPhi,
    },
  });

  return NextResponse.json({ field });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, fieldId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canEditDataSchema(role, membership.canViewPhi)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.dataField.findFirst({
    where: { id: fieldId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (existing.isPhi && !canAccessPhiTable(role, membership.canViewPhi)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.dataField.delete({ where: { id: fieldId } });
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "DATA_FIELD_UPDATE",
    metadata: { deleted: true, fieldId, key: existing.key, isPhi: existing.isPhi },
  });

  return NextResponse.json({ ok: true });
}
