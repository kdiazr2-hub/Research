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
import { canEditLiterature } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { seedManuscriptMarkdown } from "@/lib/manuscript";
import { ManuscriptClient } from "./manuscript-client";

type Props = { params: Promise<{ id: string }> };

export default async function ManuscriptPage({ params }: Props) {
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

  let manuscript = await prisma.manuscript.findUnique({ where: { projectId: id } });
  if (!manuscript) {
    manuscript = await prisma.manuscript.create({
      data: {
        projectId: id,
        title: membership.project.name,
        markdown: seedManuscriptMarkdown(
          membership.project.name,
          membership.project.reportingGuideline,
          locale
        ),
      },
    });
  }

  const references = await prisma.reference.findMany({
    where: { projectId: id },
    select: {
      id: true,
      citeKey: true,
      title: true,
      authors: true,
      year: true,
    },
    orderBy: { citeKey: "asc" },
  });

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <p>
        <Link href="/projects">{t.back}</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{membership.project.name}</h1>
          <p>
            {t.manuscript} · {t.yourRole}: {role}
          </p>
        </div>
      </div>
      <ProjectNav
        projectId={id}
        active="manuscript"
        labels={projectNavLabels(t)}
      />
      <ManuscriptClient
        projectId={id}
        initialTitle={manuscript.title}
        initialMarkdown={manuscript.markdown}
        references={references}
        canEdit={canEditLiterature(role)}
        labels={{
          title: t.draftTitle,
          save: t.save,
          reseed: t.reseedOutline,
          insertCite: t.insertCitation,
          citeHint: t.citeHint,
          readonly: t.readOnlyRole,
          error: t.error,
          success: t.success,
        }}
      />
    </AppShell>
  );
}
