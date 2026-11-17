import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { AppShell } from "@/components/app-shell";
import { canAdminProject, canEditProjectMeta } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { checklistFor } from "@/lib/reporting-guidelines";
import { MembersPanel } from "./members-panel";
import { PhiSettingsForm } from "./phi-settings-form";
import { AuditPanel } from "./audit-panel";
import { ChecklistStub } from "./checklist-stub";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const membership = await prisma.membership.findUnique({
    where: {
      projectId_userId: { projectId: id, userId: session.user.id },
    },
  });
  if (!membership) notFound();

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { user: { select: { id: true, email: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
      auditLogs: {
        include: { user: { select: { id: true, email: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });
  if (!project) notFound();

  const locale = await getLocale();
  const t = getDictionary(locale);
  const role = membership.role as Role;
  const isOwner = canAdminProject(role);
  const canEdit = canEditProjectMeta(role);

  const auditVisible = isOwner
    ? project.auditLogs
    : project.auditLogs.filter((l) =>
        [
          "PROJECT_CREATE",
          "PROJECT_UPDATE",
          "MEMBER_INVITE",
          "ROLE_CHANGE",
          "PHI_FLAG_CHANGE",
        ].includes(l.action)
      );

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <p>
        <Link href="/projects">{t.back}</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{project.name}</h1>
          <p>
            {project.description || "—"} · {t.yourRole}: {role}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <span className="badge accent">
            {project.reportingGuideline} {project.reportingGuidelineVersion}
          </span>
          <span className="badge accent">{project.phiType}</span>
          <span className="badge">{project.status}</span>
          {project.analysisDeidDefault ? (
            <span className="badge">de-ID default</span>
          ) : null}
        </div>
      </div>

      <section className="panel">
        <h2>{t.checklist}</h2>
        <ChecklistStub
          title={t.checklist}
          guideline={project.reportingGuideline}
          version={project.reportingGuidelineVersion}
          items={checklistFor(project.reportingGuideline)}
          stubNote={t.checklistStubNote}
        />
      </section>

      <div className="panel-grid two">
        <section className="panel">
          <h2>{t.members}</h2>
          <MembersPanel
            projectId={project.id}
            canManage={isOwner}
            members={project.memberships.map((m) => ({
              id: m.id,
              role: m.role,
              canViewPhi: m.canViewPhi,
              canViewImaging: m.canViewImaging,
              user: m.user,
            }))}
            labels={{
              members: t.members,
              invite: t.invite,
              inviteEmail: t.inviteEmail,
              role: t.role,
              changeRole: t.changeRole,
              error: t.error,
            }}
          />
        </section>

        <section className="panel">
          <h2>{t.settings}</h2>
          {canEdit ? (
            <PhiSettingsForm
              projectId={project.id}
              canChangePhiFlags={isOwner}
              initial={{
                name: project.name,
                description: project.description,
                reportingGuideline: project.reportingGuideline,
                phiType: project.phiType,
                consentDocumented: project.consentDocumented,
                consentDocUrl: project.consentDocUrl ?? "",
                legalBasis: project.legalBasis ?? "",
                analysisDeidDefault: project.analysisDeidDefault,
              }}
              labels={{
                projectName: t.projectName,
                description: t.description,
                reportingGuideline: t.reportingGuideline,
                care: t.care,
                prisma: t.prisma,
                otherGeneric: t.otherGeneric,
                phiType: t.phiType,
                phiNone: t.phiNone,
                phi: t.phi,
                phiImaging: t.phiImaging,
                consent: t.consent,
                consentUrl: t.consentUrl,
                legalBasis: t.legalBasis,
                analysisDeid: t.analysisDeid,
                save: t.save,
                error: t.error,
                success: t.success,
              }}
            />
          ) : (
            <p className="empty">
              {t.reportingGuideline}: {project.reportingGuideline} · {t.phiType}:{" "}
              {project.phiType} · consent: {String(project.consentDocumented)} ·
              de-ID default: {String(project.analysisDeidDefault)}
            </p>
          )}
        </section>
      </div>

      <section className="panel">
        <h2>{t.audit}</h2>
        <AuditPanel
          entries={auditVisible.map((l) => ({
            id: l.id,
            action: l.action,
            createdAt: l.createdAt.toISOString(),
            userEmail: l.user?.email ?? "—",
            metadata: l.metadata,
          }))}
        />
      </section>
    </AppShell>
  );
}
