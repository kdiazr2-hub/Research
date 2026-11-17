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
  canAccessImaging,
  canEditImaging,
  canManageRetention,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { writeAudit } from "@/lib/audit";
import { ImagingClient } from "./imaging-client";

type Props = { params: Promise<{ id: string }> };

export default async function ImagingPage({ params }: Props) {
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
  const canAccess = canAccessImaging(role, membership.canViewImaging);

  if (!canAccess) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "no_imaging_access_page", role },
    });
  }

  const studies = canAccess
    ? await prisma.imagingStudy.findMany({
        where: { projectId: id },
        orderBy: [{ studyDate: "desc" }, { createdAt: "desc" }],
      })
    : [];

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <p>
        <Link href="/projects">{t.back}</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{membership.project.name}</h1>
          <p>
            {t.imaging} · {t.yourRole}: {role}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <span className="badge accent">{membership.project.phiType}</span>
          {!canAccess ? <span className="badge">no imaging</span> : null}
        </div>
      </div>
      <ProjectNav
        projectId={id}
        active="imaging"
        labels={projectNavLabels(t)}
      />

      {!canAccess ? (
        <section className="panel">
          <p className="error">{t.imagingDenied}</p>
          <p className="hint">{t.imagingSeparateFromManuscript}</p>
        </section>
      ) : (
        <ImagingClient
          projectId={id}
          canEdit={canEditImaging(role, membership.canViewImaging)}
          canRetention={canManageRetention(role)}
          retentionDestroyAt={
            membership.project.retentionDestroyAt?.toISOString() ?? null
          }
          initialStudies={studies.map((s) => ({
            id: s.id,
            subjectKey: s.subjectKey,
            modality: s.modality,
            studyDate: s.studyDate?.toISOString() ?? null,
            accessionStub: s.accessionStub,
            description: s.description,
            fileName: s.fileName,
            fileKind: s.fileKind,
            fileSize: s.fileSize,
            hasVaultFile: Boolean(s.vaultPath),
            hasWorkingCopy: Boolean(s.workingCopyPath),
            retentionStatus: s.retentionStatus,
            markedDeleteAt: s.markedDeleteAt?.toISOString() ?? null,
            purgedAt: s.purgedAt?.toISOString() ?? null,
            createdAt: s.createdAt.toISOString(),
          }))}
          labels={{
            imagingVaultNote: t.imagingVaultNote,
            noImagingToNotebooks: t.noImagingToNotebooks,
            retention: t.retention,
            retentionDate: t.retentionDate,
            retentionStubNote: t.retentionStubNote,
            addStudy: t.addStudy,
            subjectKey: t.subjectKey,
            modality: t.modality,
            studyDate: t.studyDate,
            accessionStub: t.accessionStub,
            accessionAuto: t.accessionAuto,
            description: t.description,
            patientNameVaultOnly: t.patientNameVaultOnly,
            mrnVaultOnly: t.mrnVaultOnly,
            uploadFile: t.uploadFile,
            studies: t.studies,
            noStudies: t.noStudies,
            downloadVault: t.downloadVault,
            downloadWorking: t.downloadWorking,
            markDelete: t.markDelete,
            purgeStub: t.purgeStub,
            save: t.save,
            error: t.error,
            success: t.success,
          }}
        />
      )}
    </AppShell>
  );
}
