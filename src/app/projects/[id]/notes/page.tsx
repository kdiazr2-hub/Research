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
import { NotesClient } from "./notes-client";

type Props = { params: Promise<{ id: string }> };

export default async function NotesPage({ params }: Props) {
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

  const [references, notes] = await Promise.all([
    prisma.reference.findMany({
      where: { projectId: id },
      select: { id: true, citeKey: true, title: true },
      orderBy: { citeKey: "asc" },
    }),
    prisma.note.findMany({
      where: { projectId: id },
      orderBy: { updatedAt: "desc" },
      include: {
        reference: { select: { id: true, citeKey: true, title: true } },
        author: { select: { id: true, email: true, name: true } },
      },
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
            {t.notes} · {t.yourRole}: {role}
          </p>
        </div>
      </div>
      <ProjectNav projectId={id} active="notes" labels={projectNavLabels(t)} />
      <NotesClient
        projectId={id}
        references={references}
        initial={notes.map((n) => ({
          ...n,
          updatedAt: n.updatedAt.toISOString(),
        }))}
        canEdit={canEditLiterature(role)}
        labels={{
          newNote: t.newNote,
          title: t.noteTitle,
          body: t.noteBody,
          page: t.pageStub,
          highlight: t.highlightStub,
          reference: t.linkedReference,
          save: t.save,
          delete: t.delete,
          empty: t.noNotes,
          readonly: t.readOnlyRole,
          error: t.error,
          success: t.success,
        }}
      />
    </AppShell>
  );
}
