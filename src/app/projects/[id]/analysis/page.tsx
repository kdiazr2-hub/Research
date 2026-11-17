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
import { canRegisterAnalysis } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { jupyterDeepLink } from "@/lib/data-access";
import { AnalysisClient } from "./analysis-client";

type Props = { params: Promise<{ id: string }> };

export default async function AnalysisPage({ params }: Props) {
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

  const [notebooks, artifacts, exports] = await Promise.all([
    prisma.notebook.findMany({
      where: { projectId: id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { artifacts: true } } },
    }),
    prisma.analysisArtifact.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
      include: {
        notebook: { select: { id: true, title: true, kind: true } },
      },
    }),
    prisma.analysisExport.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <p>
        <Link href="/projects">{t.back}</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{membership.project.name}</h1>
          <p>
            {t.analysis} · {t.yourRole}: {role}
          </p>
        </div>
        <span className="badge accent">Python only · no kernel</span>
      </div>
      <ProjectNav
        projectId={id}
        active="analysis"
        labels={projectNavLabels(t)}
      />
      <p className="hint">{t.analysisDeidOnly}</p>
      <p className="hint">{t.noImagingToNotebooks}</p>
      <AnalysisClient
        projectId={id}
        canRegister={canRegisterAnalysis(role)}
        role={role}
        initialNotebooks={notebooks.map((n) => ({
          id: n.id,
          title: n.title,
          kind: n.kind,
          externalPath: n.externalPath,
          fileName: n.fileName,
          description: n.description,
          openHint: n.externalPath ? jupyterDeepLink(n.externalPath) : null,
          artifactCount: n._count.artifacts,
        }))}
        initialArtifacts={artifacts.map((a) => ({
          id: a.id,
          title: a.title,
          kind: a.kind,
          pathOrUrl: a.pathOrUrl,
          provenanceJson: a.provenanceJson,
          notebook: a.notebook,
        }))}
        exports={exports.map((e) => ({
          id: e.id,
          fileName: e.fileName,
          relativePath: e.relativePath,
        }))}
        labels={{
          notebooks: t.notebooks,
          registerNotebook: t.registerNotebook,
          notebookTitle: t.notebookTitle,
          notebookKind: t.notebookKind,
          notebookPath: t.notebookPath,
          notebookUpload: t.notebookUpload,
          openExternal: t.openExternal,
          openInstructions: t.openInstructions,
          artifacts: t.artifacts,
          registerArtifact: t.registerArtifact,
          artifactKind: t.artifactKind,
          artifactPath: t.artifactPath,
          provenance: t.provenance,
          linkNotebook: t.linkNotebook,
          linkDataset: t.linkDataset,
          noNotebooks: t.noNotebooks,
          noArtifacts: t.noArtifacts,
          analysisDeidOnly: t.analysisDeidOnly,
          delete: t.delete,
          description: t.description,
          error: t.error,
          success: t.success,
        }}
      />
    </AppShell>
  );
}
