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
import { slugifyFieldKey } from "@/lib/deid";
import { visibleFields } from "@/lib/data-access";

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

  const role = membership.role as Role;
  const fields = await prisma.dataField.findMany({
    where: { projectId: id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  const visible = visibleFields(fields, role, membership.canViewPhi);

  return NextResponse.json({
    fields: visible,
    canAccessPhi: canAccessPhiTable(role, membership.canViewPhi),
    canEditSchema: canEditDataSchema(role, membership.canViewPhi),
    phiHidden: fields.length - visible.length,
  });
}

const createSchema = z.object({
  name: z.string().min(1).max(120),
  key: z.string().min(1).max(64).optional(),
  fieldType: z.string().default("string"),
  isPhi: z.boolean().optional(),
  deidMode: z.string().optional(),
  position: z.number().int().optional(),
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
  if (!canEditDataSchema(role, membership.canViewPhi)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_edit_data_schema", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const fieldType = parsed.data.fieldType;
  if (!isFieldType(fieldType)) {
    return NextResponse.json({ error: "invalid_field_type" }, { status: 400 });
  }

  const isPhi = parsed.data.isPhi ?? false;
  if (isPhi && !canAccessPhiTable(role, membership.canViewPhi)) {
    return NextResponse.json({ error: "forbidden_phi_mark" }, { status: 403 });
  }

  const deidMode = parsed.data.deidMode ?? "strip";
  if (!isDeidMode(deidMode)) {
    return NextResponse.json({ error: "invalid_deid_mode" }, { status: 400 });
  }

  let key = slugifyFieldKey(parsed.data.key || parsed.data.name);
  const existing = await prisma.dataField.findMany({
    where: { projectId: id },
    select: { key: true, position: true },
  });
  const keys = new Set(existing.map((e) => e.key));
  if (keys.has(key)) {
    let i = 2;
    while (keys.has(`${key}_${i}`)) i++;
    key = `${key}_${i}`;
  }

  const maxPos = existing.reduce((m, e) => Math.max(m, e.position), -1);
  const field = await prisma.dataField.create({
    data: {
      projectId: id,
      name: parsed.data.name.trim(),
      key,
      fieldType,
      isPhi,
      deidMode,
      position: parsed.data.position ?? maxPos + 1,
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: isPhi ? "DATA_FIELD_PHI_MARK" : "DATA_FIELD_CREATE",
    metadata: {
      fieldId: field.id,
      key: field.key,
      isPhi: field.isPhi,
      deidMode: field.deidMode,
    },
  });

  return NextResponse.json({ field }, { status: 201 });
}
