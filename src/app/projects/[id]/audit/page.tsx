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
import { canViewFullAudit } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { AuditClient } from "./audit-client";

type Props = { params: Promise<{ id: string }> };

const LIMITED = [
  "PROJECT_CREATE",
  "PROJECT_UPDATE",
  "MEMBER_INVITE",
  "ROLE_CHANGE",
  "PHI_FLAG_CHANGE",
  "GUIDELINE_CHANGE",
  "DATA_FIELD_PHI_MARK",
  "DATA_CSV_EXPORT_DEID",
  "NOTEBOOK_REGISTER",
  "RETENTION_SET",
  "IMAGING_MARK_DELETE",
  "IMAGING_PURGE_STUB",
];

export default async function AuditPage({ params }: Props) {
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
  const fullAccess = canViewFullAudit(role);

  const logs = await prisma.auditLog.findMany({
    where: { projectId: id },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const visible = fullAccess
    ? logs
    : logs.filter((l) => LIMITED.includes(l.action));

  const actions = [
    ...new Set(
      (fullAccess ? logs : visible).map((l) => l.action)
    ),
  ].sort();

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <p>
        <Link href="/projects">{t.back}</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{membership.project.name}</h1>
          <p>
            {t.audit} · {t.yourRole}: {role}
          </p>
        </div>
        <Link className="badge" href={`/projects/${id}/security`}>
          {t.security}
        </Link>
      </div>
      <ProjectNav projectId={id} active="audit" labels={projectNavLabels(t)} />
      <section className="panel">
        <h2>{t.audit}</h2>
        <AuditClient
          projectId={id}
          fullAccess={fullAccess}
          actions={actions}
          initialEntries={visible.map((l) => ({
            id: l.id,
            action: l.action,
            createdAt: l.createdAt.toISOString(),
            userEmail: l.user?.email ?? "—",
            metadata: l.metadata,
          }))}
          labels={{
            auditLimited: t.auditLimited,
            filterAction: t.filterAction,
            filterAll: t.filterAll,
            filterUser: t.filterUser,
            filterQuery: t.filterQuery,
            filterFrom: t.filterFrom,
            filterTo: t.filterTo,
            applyFilters: t.applyFilters,
            error: t.error,
          }}
        />
      </section>
    </AppShell>
  );
}
