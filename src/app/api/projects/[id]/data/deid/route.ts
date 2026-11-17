import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canReadDeid,
  canRunDeidExport,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { deidentifyRows, rowsToCsv } from "@/lib/deid";
import { parseRowValues } from "@/lib/data-access";
import {
  ensureDir,
  projectAnalysisDir,
  safeFileName,
  storageRoot,
} from "@/lib/storage";

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
  if (!canReadDeid(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const exports = await prisma.analysisExport.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    exports,
    analysisDeidDefault: membership.project.analysisDeidDefault,
    canRun: canRunDeidExport(role),
    note: "Analysis pipelines should consume only these de-identified datasets by default.",
  });
}

/** POST — materialize a de-ID CSV under storage/.../analysis/ and register it. */
export async function POST(_req: Request, ctx: Ctx) {
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
  if (!canRunDeidExport(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_run_deid", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const fields = await prisma.dataField.findMany({
    where: { projectId: id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  const dbRows = await prisma.dataRow.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "asc" },
  });
  const valueRows = dbRows.map((r) => parseRowValues(r.valuesJson));
  const result = deidentifyRows(id, fields, valueRows);
  const csv = rowsToCsv(result.headers, result.rows);

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = safeFileName(`deid-${stamp}.csv`);
  const dir = projectAnalysisDir(id);
  await ensureDir(dir);
  const abs = path.join(dir, fileName);
  await writeFile(abs, csv, "utf8");
  const relativePath = path.relative(storageRoot(), abs);

  const record = await prisma.analysisExport.create({
    data: {
      projectId: id,
      fileName,
      relativePath,
      rowCount: result.rows.length,
      fieldCount: result.headers.length,
      phiFieldsStripped: result.strippedKeys.join(","),
      phiFieldsHashed: result.hashedKeys.join(","),
      createdById: session.user.id,
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "DATA_CSV_EXPORT_DEID",
    metadata: {
      exportId: record.id,
      fileName,
      relativePath,
      rows: record.rowCount,
      stripped: result.strippedKeys,
      hashed: result.hashedKeys,
      via: "analysis_dataset",
    },
  });

  return NextResponse.json(
    {
      export: record,
      absolutePath: abs,
      hint: "Point notebooks at this analysis/ CSV — never at raw PHI tables.",
    },
    { status: 201 }
  );
}
