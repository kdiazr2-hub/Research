import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canEditNonPhiRows,
  canEditPhiRows,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import {
  mergeRowValues,
  parseRowValues,
  redactRowValues,
} from "@/lib/data-access";

type Ctx = { params: Promise<{ id: string; rowId: string }> };

const patchSchema = z.object({
  values: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, rowId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canEditNonPhiRows(role) && !canEditPhiRows(role, membership.canViewPhi)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.dataRow.findFirst({
    where: { id: rowId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const fields = await prisma.dataField.findMany({ where: { projectId: id } });
  const incoming: Record<string, string> = {};
  for (const [k, v] of Object.entries(parsed.data.values)) {
    incoming[k] = String(v);
  }

  const { values, deniedPhiWrite } = mergeRowValues({
    existing: parseRowValues(existing.valuesJson),
    incoming,
    fields,
    role,
    canViewPhi: membership.canViewPhi,
  });

  if (
    deniedPhiWrite &&
    Object.keys(incoming).some((k) => fields.find((f) => f.key === k)?.isPhi)
  ) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "phi_row_write_denied", role, rowId },
    });
    return NextResponse.json({ error: "forbidden_phi_write" }, { status: 403 });
  }

  const row = await prisma.dataRow.update({
    where: { id: rowId },
    data: { valuesJson: JSON.stringify(values) },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "DATA_ROW_UPDATE",
    metadata: { rowId: row.id, keys: Object.keys(incoming) },
  });

  return NextResponse.json({
    row: {
      id: row.id,
      values: redactRowValues(values, fields, role, membership.canViewPhi),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, rowId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  // Deleting a row that may contain PHI requires PHI edit rights.
  if (!canEditPhiRows(role, membership.canViewPhi)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_delete_row", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.dataRow.findFirst({
    where: { id: rowId, projectId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.dataRow.delete({ where: { id: rowId } });
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "DATA_ROW_DELETE",
    metadata: { rowId },
  });

  return NextResponse.json({ ok: true });
}
