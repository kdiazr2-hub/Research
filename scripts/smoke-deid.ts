import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { deidentifyRows, rowsToCsv } from "../src/lib/deid";

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.findFirst({
    where: { name: "Synthetic CT observational pilot" },
  });
  if (!project) throw new Error("no project");

  const fields = await prisma.dataField.findMany({
    where: { projectId: project.id },
    orderBy: { position: "asc" },
  });
  const rows = await prisma.dataRow.findMany({ where: { projectId: project.id } });
  const valueRows = rows.map((r) => JSON.parse(r.valuesJson) as Record<string, string>);
  const result = deidentifyRows(project.id, fields, valueRows);
  console.log("headers", result.headers);
  console.log("stripped", result.strippedKeys);
  console.log("hashed", result.hashedKeys);
  console.log("sample", result.rows[0]);

  const csv = rowsToCsv(result.headers, result.rows);
  const dir = path.join("storage", "projects", project.id, "analysis");
  await mkdir(dir, { recursive: true });
  const fileName = "deid-seed-smoke.csv";
  await writeFile(path.join(dir, fileName), csv);
  const relativePath = path.join("projects", project.id, "analysis", fileName);

  const existing = await prisma.analysisExport.findFirst({
    where: { projectId: project.id, fileName },
  });
  const exp =
    existing ??
    (await prisma.analysisExport.create({
      data: {
        projectId: project.id,
        fileName,
        relativePath,
        rowCount: result.rows.length,
        fieldCount: result.headers.length,
        phiFieldsStripped: result.strippedKeys.join(","),
        phiFieldsHashed: result.hashedKeys.join(","),
      },
    }));
  console.log("export", exp.id, relativePath);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
