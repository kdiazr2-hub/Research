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
import type { Role } from "@/lib/types";
import { ExportClient } from "./export-client";

type Props = { params: Promise<{ id: string }> };

export default async function ExportPage({ params }: Props) {
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

  const howto =
    locale === "es"
      ? `# Si Pandoc no está en el servidor

Instala Pandoc (https://pandoc.org/installing.html) y opcionalmente Quarto.

cd <carpeta-descomprimida>
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.docx
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.tex

# O con Quarto
quarto render manuscript.qmd --to docx
quarto render manuscript.qmd --to latex`
      : `# If Pandoc is not on the server

Install Pandoc (https://pandoc.org/installing.html) and optionally Quarto.

cd <unzipped-folder>
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.docx
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.tex

# Or with Quarto
quarto render manuscript.qmd --to docx
quarto render manuscript.qmd --to latex`;

  return (
    <AppShell locale={locale} t={t} email={session.user.email}>
      <p>
        <Link href="/projects">{t.back}</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{membership.project.name}</h1>
          <p>
            {t.export} · {t.yourRole}: {role}
          </p>
        </div>
      </div>
      <ProjectNav projectId={id} active="export" labels={projectNavLabels(t)} />
      <ExportClient
        projectId={id}
        labels={{
          exportZip: t.exportZip,
          exportDocx: t.exportDocx,
          exportTex: t.exportTex,
          howto,
          pandocHint: t.pandocHint,
          error: t.error,
        }}
      />
    </AppShell>
  );
}
