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
import { buildSecurityChecklist } from "@/lib/security-checklist";
import { writeAudit } from "@/lib/audit";
import { storageRoot } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export default async function SecurityPage({ params }: Props) {
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

  const [imagingStudyCount, members] = await Promise.all([
    prisma.imagingStudy.count({ where: { projectId: id } }),
    prisma.membership.findMany({ where: { projectId: id } }),
  ]);

  const membersWithImaging = members.filter(
    (m) => m.role === "OWNER" || m.canViewImaging
  ).length;
  const membersWithoutImagingDefault = members.filter(
    (m) =>
      (m.role === "COLLABORATOR" ||
        m.role === "VIEWER" ||
        m.role === "ANALYST") &&
      !m.canViewImaging
  ).length;

  const items = buildSecurityChecklist({
    phiType: membership.project.phiType,
    consentDocumented: membership.project.consentDocumented,
    consentDocUrl: membership.project.consentDocUrl,
    legalBasis: membership.project.legalBasis,
    analysisDeidDefault: membership.project.analysisDeidDefault,
    retentionDestroyAt: membership.project.retentionDestroyAt,
    imagingStudyCount,
    membersWithImaging,
    membersWithoutImagingDefault,
    storageRootConfigured: Boolean(storageRoot()),
    vaultKeyConfigured: Boolean(process.env.IMAGING_VAULT_KEY),
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "SECURITY_CHECKLIST_VIEW",
    metadata: { itemCount: items.length },
  });

  const okCount = items.filter((i) => i.ok === true).length;
  const warnCount = items.filter((i) => i.ok === false).length;

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <p>
        <Link href="/projects">{t.back}</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{membership.project.name}</h1>
          <p>
            {t.security} · {t.yourRole}: {membership.role}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <span className="badge accent">
            {okCount} OK · {warnCount} {locale === "es" ? "atención" : "attention"}
          </span>
          <Link className="badge" href={`/projects/${id}/audit`}>
            {t.audit}
          </Link>
        </div>
      </div>
      <ProjectNav
        projectId={id}
        active="security"
        labels={projectNavLabels(t)}
      />

      <section className="panel">
        <h2>{t.securityChecklist}</h2>
        <p className="hint">{t.securityDisclaimer}</p>
        <table className="table">
          <thead>
            <tr>
              <th>Status</th>
              <th>{locale === "es" ? "Ítem" : "Item"}</th>
              <th>{locale === "es" ? "Detalle" : "Detail"}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key}>
                <td>
                  {item.ok === true ? (
                    <span className="badge accent">OK</span>
                  ) : item.ok === false ? (
                    <span className="badge" style={{ color: "var(--danger)" }}>
                      !
                    </span>
                  ) : (
                    <span className="badge">info</span>
                  )}
                </td>
                <td>{locale === "es" ? item.titleEs : item.titleEn}</td>
                <td className="meta">
                  {locale === "es" ? item.detailEs : item.detailEn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
