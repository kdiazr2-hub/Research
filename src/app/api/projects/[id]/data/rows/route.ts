import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canAccessPhiTable,
  canEditNonPhiRows,
  canEditPhiRows,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import {
  mergeRowValues,
  parseRowValues,
  redactRowValues,
  visibleFields,
} from "@/lib/data-access";

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

  // Analyst / Viewer without PHI: redirect them toward de-ID, not raw rows with PHI.
  // They may still see non-PHI columns if any exist.
  const rows = await prisma.dataRow.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "asc" },
  });

  const visible = visibleFields(fields, role, membership.canViewPhi);
  const payload = rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    values: redactRowValues(
      parseRowValues(r.valuesJson),
      fields,
      role,
      membership.canViewPhi
    ),
  }));

  return NextResponse.json({
    fields: visible,
    rows: payload,
    canAccessPhi: canAccessPhiTable(role, membership.canViewPhi),
    canEditPhi: canEditPhiRows(role, membership.canViewPhi),
    canEditNonPhi: canEditNonPhiRows(role),
    analysisDeidDefault: membership.project.analysisDeidDefault,
  });
}

const createSchema = z.object({
  values: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
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
  if (!canEditNonPhiRows(role) && !canEditPhiRows(role, membership.canViewPhi)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_edit_rows", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Collaborators without PHI grant: allow non-PHI row entry only.
  if (
    !canEditPhiRows(role, membership.canViewPhi) &&
    role !== "COLLABORATOR" &&
    role !== "OWNER" &&
    role !== "INVESTIGATOR"
  ) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const fields = await prisma.dataField.findMany({ where: { projectId: id } });
  const incoming: Record<string, string> = {};
  for (const [k, v] of Object.entries(parsed.data.values)) {
    incoming[k] = String(v);
  }

  const { values, deniedPhiWrite } = mergeRowValues({
    existing: {},
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
      metadata: { reason: "phi_row_write_denied", role },
    });
    return NextResponse.json({ error: "forbidden_phi_write" }, { status: 403 });
  }

  const row = await prisma.dataRow.create({
    data: {
      projectId: id,
      valuesJson: JSON.stringify(values),
      createdById: session.user.id,
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "DATA_ROW_CREATE",
    metadata: { rowId: row.id, keys: Object.keys(values) },
  });

  return NextResponse.json(
    {
      row: {
        id: row.id,
        values: redactRowValues(values, fields, role, membership.canViewPhi),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
    },
    { status: 201 }
  );
}
