import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { AppShell } from "@/components/app-shell";
import { ProjectNav } from "@/components/project-nav";
import { projectNavLabels } from "@/lib/nav-labels";
import {
  canAccessPhiTable,
  canEditDataSchema,
  canEditNonPhiRows,
  canEditPhiRows,
  canExportRawPhi,
  canRunDeidExport,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import {
  parseRowValues,
  redactRowValues,
  visibleFields,
} from "@/lib/data-access";
import { DataClient } from "./data-client";

type Props = { params: Promise<{ id: string }> };

export default async function DataPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const membership = await prisma.membership.findUnique({
    where: { projectId_userId: { projectId: id, userId: session.user.id } },
    include: { project: true },
  });
  if (!membership) notFound();

  const locale = await getLocale();
  const t = getDictionary(locale);
  const role = membership.role as Role;

  const [fields, rows, exports] = await Promise.all([
    prisma.dataField.findMany({
      where: { projectId: id },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    }),
    prisma.dataRow.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.analysisExport.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const canPhi = canAccessPhiTable(role, membership.canViewPhi);
  const visible = visibleFields(fields, role, membership.canViewPhi);

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <p>
        <Link href="/projects">{t.back}</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{membership.project.name}</h1>
          <p>
            {t.data} · {t.yourRole}: {role}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {membership.project.analysisDeidDefault ? (
            <span className="badge accent">de-ID default</span>
          ) : null}
          {!canPhi ? <span className="badge">no PHI table</span> : null}
        </div>
      </div>
      <ProjectNav projectId={id} active="data" labels={projectNavLabels(t)} />
      <DataClient
        projectId={id}
        role={role}
        initialFields={visible}
        phiHidden={fields.length - visible.length}
        initialRows={rows.map((r) => ({
          id: r.id,
          values: redactRowValues(
            parseRowValues(r.valuesJson),
            fields,
            role,
            membership.canViewPhi
          ),
        }))}
        initialExports={exports.map((e) => ({
          id: e.id,
          fileName: e.fileName,
          rowCount: e.rowCount,
          fieldCount: e.fieldCount,
          phiFieldsStripped: e.phiFieldsStripped,
          phiFieldsHashed: e.phiFieldsHashed,
          createdAt: e.createdAt.toISOString(),
        }))}
        caps={{
          canAccessPhi: canPhi,
          canEditSchema: canEditDataSchema(role, membership.canViewPhi),
          canEditPhi: canEditPhiRows(role, membership.canViewPhi),
          canEditNonPhi: canEditNonPhiRows(role),
          canExportRaw: canExportRawPhi(role, membership.canViewPhi),
          canRunDeid: canRunDeidExport(role),
        }}
        labels={{
          fields: t.fields,
          fieldName: t.fieldName,
          fieldType: t.fieldType,
          phiField: t.phiField,
          deidMode: t.deidMode,
          deidStrip: t.deidStrip,
          deidHash: t.deidHash,
          addField: t.addField,
          rows: t.rows,
          addRow: t.addRow,
          importCsv: t.importCsv,
          exportCsvRaw: t.exportCsvRaw,
          exportCsvDeid: t.exportCsvDeid,
          createDeidDataset: t.createDeidDataset,
          deidDatasets: t.deidDatasets,
          noFields: t.noFields,
          noRows: t.noRows,
          noDeidExports: t.noDeidExports,
          phiHiddenNote: t.phiHiddenNote,
          analysisDeidOnly: t.analysisDeidOnly,
          analystDeidOnly: t.analystDeidOnly,
          delete: t.delete,
          save: t.save,
          error: t.error,
          success: t.success,
        }}
      />
    </AppShell>
  );
}
