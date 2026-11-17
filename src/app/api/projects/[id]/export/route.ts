import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import { requireMembership } from "@/lib/permissions";
import { seedManuscriptMarkdown } from "@/lib/manuscript";
import { getLocale } from "@/i18n/get-locale";
import {
  ensureExportScratch,
  listExportArtifacts,
  tryPandocExport,
  writeQuartoSkeleton,
  zipDirectoryFiles,
} from "@/lib/export-quarto";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "zip";

  const locale = await getLocale();
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

  const refs = await prisma.reference.findMany({ where: { projectId: id } });
  await ensureExportScratch();
  const { dir, qmdPath, bibPath } = await writeQuartoSkeleton({
    projectId: id,
    projectName: membership.project.name,
    markdown: manuscript.markdown,
    refs,
  });

  const pandoc = await tryPandocExport(dir, qmdPath, bibPath);

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "MANUSCRIPT_EXPORT",
    metadata: { format, pandoc },
  });

  if (format === "docx" && pandoc.docx) {
    const buf = await readFile(path.join(dir, "manuscript.docx"));
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="manuscript.docx"`,
      },
    });
  }

  if (format === "tex" && pandoc.tex) {
    const buf = await readFile(path.join(dir, "manuscript.tex"));
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/x-tex",
        "Content-Disposition": `attachment; filename="manuscript.tex"`,
      },
    });
  }

  const artifacts = await listExportArtifacts(dir);
  const wanted = artifacts.filter((f) =>
    [
      "manuscript.qmd",
      "references.bib",
      "README-EXPORT.md",
      "manuscript.docx",
      "manuscript.tex",
    ].includes(f)
  );

  try {
    const zip = await zipDirectoryFiles(dir, wanted);
    return new NextResponse(new Uint8Array(zip), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="manuscript-export.zip"`,
        "X-Export-Pandoc": pandoc.message,
      },
    });
  } catch {
    return NextResponse.json({
      ok: true,
      dir,
      artifacts: wanted,
      pandoc,
      hint: "Zip unavailable; use format=qmd skeleton files under EXPORT_ROOT or install `zip`/`pandoc`.",
    });
  }
}
