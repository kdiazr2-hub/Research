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
import { LibraryClient } from "./library-client";

type Props = { params: Promise<{ id: string }> };

export default async function LibraryPage({ params }: Props) {
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

  const references = await prisma.reference.findMany({
    where: { projectId: id },
    orderBy: [{ year: "desc" }, { citeKey: "asc" }],
    include: { _count: { select: { notes: true } } },
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
            {t.library} · {t.yourRole}: {role}
          </p>
        </div>
      </div>
      <ProjectNav projectId={id} active="library" labels={projectNavLabels(t)} />
      <LibraryClient
        projectId={id}
        initial={references}
        canEdit={canEditLiterature(role)}
        labels={{
          import: t.importBib,
          pasteBib: t.pasteBib,
          attachPdf: t.attachPdf,
          delete: t.delete,
          notes: t.notes,
          empty: t.noReferences,
          readonly: t.readOnlyRole,
          error: t.error,
          success: t.success,
          phiSafe: t.libraryPhiSafe,
        }}
      />
    </AppShell>
  );
}
