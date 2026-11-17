import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canEditNonPhiRows,
  canEditPhiRows,
  canExportRawPhi,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { deidentifyRows, parseCsv, rowsToCsv, slugifyFieldKey } from "@/lib/deid";
import { parseRowValues } from "@/lib/data-access";

type Ctx = { params: Promise<{ id: string }> };

/** GET ?mode=raw|deid — CSV download. Default follows analysisDeidDefault (deid). */
export async function GET(req: Request, ctx: Ctx) {
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
  const url = new URL(req.url);
  const requested = url.searchParams.get("mode");
  const preferDeid = membership.project.analysisDeidDefault !== false;
  const mode =
    requested === "raw" || requested === "deid"
      ? requested
      : preferDeid
        ? "deid"
        : "raw";

  const fields = await prisma.dataField.findMany({
    where: { projectId: id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  const dbRows = await prisma.dataRow.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "asc" },
  });
  const valueRows = dbRows.map((r) => parseRowValues(r.valuesJson));

  if (mode === "raw") {
    if (!canExportRawPhi(role, membership.canViewPhi)) {
      await writeAudit({
        userId: session.user.id,
        projectId: id,
        action: "ACCESS_DENIED",
        metadata: { reason: "raw_csv_denied", role },
      });
      return NextResponse.json(
        {
          error: "forbidden_raw_export",
          hint: "Use mode=deid — analysis uses de-identified export by default.",
        },
        { status: 403 }
      );
    }
    const headers = fields.map((f) => f.key);
    const csv = rowsToCsv(headers, valueRows);
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "DATA_CSV_EXPORT_RAW",
      metadata: { rows: dbRows.length, fields: headers.length },
    });
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="project-${id}-raw.csv"`,
      },
    });
  }

  // de-ID path (default for analysis)
  const result = deidentifyRows(id, fields, valueRows);
  const csv = rowsToCsv(result.headers, result.rows);
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "DATA_CSV_EXPORT_DEID",
    metadata: {
      rows: result.rows.length,
      stripped: result.strippedKeys,
      hashed: result.hashedKeys,
      via: "csv_download",
    },
  });
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="project-${id}-deid.csv"`,
    },
  });
}

/** POST — import CSV. PHI columns require PHI write grant. */
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
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const contentType = req.headers.get("content-type") || "";
  let text = "";
  let createMissingFields = false;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    createMissingFields = form.get("createMissingFields") === "true";
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file_required" }, { status: 400 });
    }
    text = await file.text();
  } else {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.text !== "string") {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }
    text = body.text;
    createMissingFields = Boolean(body.createMissingFields);
  }

  const { headers, rows } = parseCsv(text);
  if (headers.length === 0) {
    return NextResponse.json({ error: "empty_csv" }, { status: 400 });
  }

  let fields = await prisma.dataField.findMany({ where: { projectId: id } });
  const byKey = new Map(fields.map((f) => [f.key, f]));
  const byName = new Map(fields.map((f) => [f.name.toLowerCase(), f]));

  const headerKeys: string[] = [];
  for (const h of headers) {
    const existing = byKey.get(h) || byName.get(h.toLowerCase());
    if (existing) {
      headerKeys.push(existing.key);
      continue;
    }
    if (!createMissingFields) {
      return NextResponse.json(
        { error: "unknown_column", column: h },
        { status: 400 }
      );
    }
    if (!canEditPhiRows(role, membership.canViewPhi) && !canEditNonPhiRows(role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    // Schema create for missing cols requires schema edit (Owner / Inv+PHI)
    const { canEditDataSchema } = await import("@/lib/permissions");
    if (!canEditDataSchema(role, membership.canViewPhi)) {
      return NextResponse.json(
        { error: "cannot_create_fields", column: h },
        { status: 403 }
      );
    }
    let key = slugifyFieldKey(h);
    const keys = new Set(fields.map((f) => f.key));
    if (keys.has(key)) {
      let i = 2;
      while (keys.has(`${key}_${i}`)) i++;
      key = `${key}_${i}`;
    }
    const maxPos = fields.reduce((m, e) => Math.max(m, e.position), -1);
    const created = await prisma.dataField.create({
      data: {
        projectId: id,
        name: h.trim() || key,
        key,
        fieldType: "string",
        isPhi: false,
        deidMode: "strip",
        position: maxPos + 1,
      },
    });
    fields = [...fields, created];
    byKey.set(created.key, created);
    headerKeys.push(created.key);
  }

  const phiKeys = new Set(fields.filter((f) => f.isPhi).map((f) => f.key));
  const canPhi = canEditPhiRows(role, membership.canViewPhi);
  let imported = 0;
  let skippedPhi = 0;

  for (const cells of rows) {
    const values: Record<string, string> = {};
    let hadDeniedPhi = false;
    for (let i = 0; i < headerKeys.length; i++) {
      const key = headerKeys[i];
      const cell = cells[i] ?? "";
      if (phiKeys.has(key) && !canPhi) {
        hadDeniedPhi = true;
        continue;
      }
      values[key] = cell;
    }
    if (hadDeniedPhi && Object.keys(values).length === 0) {
      skippedPhi++;
      continue;
    }
    if (hadDeniedPhi) skippedPhi++;
    await prisma.dataRow.create({
      data: {
        projectId: id,
        valuesJson: JSON.stringify(values),
        createdById: session.user.id,
      },
    });
    imported++;
  }

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "DATA_CSV_IMPORT",
    metadata: { imported, skippedPhi, columns: headerKeys },
  });

  return NextResponse.json({ imported, skippedPhi, columns: headerKeys });
}
