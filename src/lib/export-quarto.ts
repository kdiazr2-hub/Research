import { execFile } from "child_process";
import { promisify } from "util";
import { mkdir, writeFile, readFile, rm } from "fs/promises";
import path from "path";
import { exportRoot, ensureDir } from "@/lib/storage";

const execFileAsync = promisify(execFile);

export type ExportRef = {
  citeKey: string;
  bibtexRaw: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi: string;
  url: string;
  entryType: string;
};

export async function pandocAvailable(): Promise<boolean> {
  try {
    await execFileAsync("pandoc", ["--version"]);
    return true;
  } catch {
    return false;
  }
}

function ensureBibtex(refs: ExportRef[]): string {
  return refs
    .map((r) => {
      if (r.bibtexRaw.trim()) return r.bibtexRaw.trim();
      return [
        `@${r.entryType || "article"}{${r.citeKey},`,
        r.title ? `  title = {${r.title}},` : "",
        r.authors ? `  author = {${r.authors}},` : "",
        r.year ? `  year = {${r.year}},` : "",
        r.journal ? `  journal = {${r.journal}},` : "",
        r.doi ? `  doi = {${r.doi}},` : "",
        r.url ? `  url = {${r.url}},` : "",
        "}",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export async function writeQuartoSkeleton(params: {
  projectId: string;
  projectName: string;
  markdown: string;
  refs: ExportRef[];
}): Promise<{ dir: string; qmdPath: string; bibPath: string }> {
  const stamp = Date.now();
  const dir = path.join(exportRoot(), params.projectId, String(stamp));
  await ensureDir(dir);
  const qmdPath = path.join(dir, "manuscript.qmd");
  const bibPath = path.join(dir, "references.bib");
  const readmePath = path.join(dir, "README-EXPORT.md");

  let body = params.markdown;
  if (!body.includes("bibliography:")) {
    body = `---\ntitle: "${params.projectName.replace(/"/g, '\\"')}"\nbibliography: references.bib\n---\n\n${body}`;
  }

  await writeFile(qmdPath, body, "utf8");
  await writeFile(bibPath, ensureBibtex(params.refs) + "\n", "utf8");
  await writeFile(
    readmePath,
    `# Export skeleton (Quarto / Pandoc)

Generated for project **${params.projectName}**.

## Files

- \`manuscript.qmd\` — Markdown + YAML frontmatter
- \`references.bib\` — project library as BibTeX
- \`manuscript.docx\` / \`manuscript.tex\` — present if Pandoc ran successfully on the server

## Run locally (if Pandoc is not installed on the server)

Install [Pandoc](https://pandoc.org/installing.html) (and optionally [Quarto](https://quarto.org/docs/get-started/)).

\`\`\`bash
# Word
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.docx

# LaTeX
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.tex

# Or with Quarto
quarto render manuscript.qmd --to docx
quarto render manuscript.qmd --to latex
\`\`\`

Citations in the draft use Pandoc citekeys: \`[@smith2020]\`.
`,
    "utf8"
  );

  return { dir, qmdPath, bibPath };
}

export async function tryPandocExport(
  dir: string,
  qmdPath: string,
  bibPath: string
): Promise<{ docx: boolean; tex: boolean; message: string }> {
  const has = await pandocAvailable();
  if (!has) {
    return {
      docx: false,
      tex: false,
      message:
        "Pandoc not found on PATH. Download the Quarto/Pandoc skeleton zip and run the commands in README-EXPORT.md locally.",
    };
  }

  const docxPath = path.join(dir, "manuscript.docx");
  const texPath = path.join(dir, "manuscript.tex");
  let docx = false;
  let tex = false;
  const errors: string[] = [];

  try {
    await execFileAsync("pandoc", [
      qmdPath,
      "--citeproc",
      `--bibliography=${bibPath}`,
      "-o",
      docxPath,
    ]);
    docx = true;
  } catch (e) {
    errors.push(`docx: ${e instanceof Error ? e.message : String(e)}`);
  }

  try {
    await execFileAsync("pandoc", [
      qmdPath,
      "--citeproc",
      `--bibliography=${bibPath}`,
      "-o",
      texPath,
    ]);
    tex = true;
  } catch (e) {
    errors.push(`tex: ${e instanceof Error ? e.message : String(e)}`);
  }

  return {
    docx,
    tex,
    message: errors.length
      ? `Pandoc partial: ${errors.join("; ")}`
      : "Pandoc generated Word and LaTeX.",
  };
}

/** Build a simple zip without external deps (store-only, sufficient for MVP). */
export async function zipDirectoryFiles(
  dir: string,
  files: string[]
): Promise<Buffer> {
  // Prefer system `zip` if available.
  try {
    const out = path.join(dir, "export.zip");
    await execFileAsync("zip", ["-q", "-j", out, ...files.map((f) => path.join(dir, f))], {
      cwd: dir,
    });
    const buf = await readFile(out);
    await rm(out).catch(() => undefined);
    return buf;
  } catch {
    // Fallback: concatenate as a tar-like text bundle is wrong for binary;
    // require zip. Re-throw a clear error.
    throw new Error(
      "zip utility not available; install zip or download individual files"
    );
  }
}

export async function listExportArtifacts(dir: string): Promise<string[]> {
  const { readdir } = await import("fs/promises");
  return readdir(dir);
}

export async function ensureExportScratch(): Promise<void> {
  await mkdir(exportRoot(), { recursive: true });
}
