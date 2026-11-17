import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { AppShell } from "@/components/app-shell";
import { CreateProjectForm } from "./create-project-form";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const t = getDictionary(locale);

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: {
      project: { include: { _count: { select: { memberships: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <div className="page-header">
        <div>
          <h1>{t.myProjects}</h1>
          <p>{t.tagline}</p>
        </div>
      </div>

      <section className="panel">
        <h2>{t.newProject}</h2>
        <CreateProjectForm
          locale={locale}
          labels={{
            projectName: t.projectName,
            description: t.description,
            reportingGuideline: t.reportingGuideline,
            phiType: t.phiType,
            phiNone: t.phiNone,
            phi: t.phi,
            phiImaging: t.phiImaging,
            consent: t.consent,
            analysisDeid: t.analysisDeid,
            create: t.create,
            error: t.error,
          }}
        />
      </section>

      <section className="grid-projects">
        {memberships.length === 0 ? (
          <p className="empty">{t.noProjects}</p>
        ) : (
          memberships.map((m) => (
            <Link
              key={m.id}
              href={`/projects/${m.projectId}`}
              className="project-row"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div>
                <h2>{m.project.name}</h2>
                <div className="meta">
                  {m.project.reportingGuideline} · {t.status}: {m.project.status}{" "}
                  · {t.phiType}: {m.project.phiType} · {t.yourRole}: {m.role} ·{" "}
                  {m.project._count.memberships} {t.members.toLowerCase()}
                </div>
              </div>
              <span className="badge accent">{m.role}</span>
            </Link>
          ))
        )}
      </section>
    </AppShell>
  );
}
