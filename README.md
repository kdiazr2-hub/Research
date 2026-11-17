# Investigación — Research Hub (M1)

Local-first clinical / biomedical **research project hub**.  
**M0:** auth, projects, roles, PHI/consent flags, EQUATOR templates + checklist, audit.  
**M1:** BibTeX/RIS library, PDF attach, notes linked to refs, Markdown manuscript with citekeys, Quarto/Pandoc export path.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| App | **Next.js 15** (App Router) + TypeScript | Per product plan |
| DB | **SQLite** via Prisma 5 | Local-first; Postgres later |
| Auth | **NextAuth.js** email + password (bcrypt) | No SMTP required |
| i18n | Cookie + dictionaries **ES/EN** | Header switcher |
| Files | Local `STORAGE_ROOT` / `EXPORT_ROOT` | PDFs + export scratch |
| Export | Quarto/Pandoc skeleton → `.docx` / `.tex` | Pandoc optional on PATH |

## Prerequisites

- Node.js 20+ and npm
- Optional: [Pandoc](https://pandoc.org/installing.html) (and/or Quarto) for server-side Word/LaTeX; without it the zip still downloads with run instructions

## Run locally

```bash
cp .env.example .env
# defaults are fine for local

npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo users (seed)

| Email | Password | Role on fixture project |
| --- | --- | --- |
| `kevin@example.com` | `password123` | OWNER |
| `ana@example.com` | `password123` | COLLABORATOR |
| `luis@example.com` | `password123` | ANALYST (read literature; no PHI flags) |

Fixture: **Synthetic CT observational pilot** (CARE, `PHI_IMAGING` flags, sample BibTeX refs + note + draft).

## M1 what works

1. Project nav: Overview · Library · Notes · Manuscript · Export
2. Import **BibTeX** or **RIS** into the project library (no Zotero sync)
3. Reference list; attach/store PDF under `STORAGE_ROOT/projects/<id>/pdfs/`
4. Notes linked to a reference with optional **page** / **highlight** stubs
5. Markdown draft seeded from EQUATOR section outline; insert `[@citeKey]`
6. Export zip: `manuscript.qmd` + `references.bib` + `README-EXPORT.md`; if Pandoc is on PATH, also `.docx` / `.tex`
7. Roles: Collaborator/Owner/Investigator can edit literature; Viewer/Analyst read-only. Opening refs does **not** grant PHI/imaging

## Stubbed / deferred

- Live Zotero sync
- Full PDF.js viewer / real highlight anchoring (page/highlight are stubs)
- Rich CSL formatting in-browser (Pandoc `--citeproc` on export)
- Python notebooks, tabular PHI capture, imaging vault (M2/M3)
- In-app Word preview

## Export without server Pandoc

Unzip the download, then:

```bash
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.docx
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.tex
# or: quarto render manuscript.qmd --to docx
```

## API sketch (M1 additions)

- `GET|POST /api/projects/:id/references`
- `GET|DELETE /api/projects/:id/references/:refId`
- `GET|POST /api/projects/:id/references/:refId/pdf`
- `GET|POST /api/projects/:id/notes`
- `PATCH|DELETE /api/projects/:id/notes/:noteId`
- `GET|PUT /api/projects/:id/manuscript`
- `POST /api/projects/:id/export?format=zip|docx|tex`

## Postgres later

1. Set `DATABASE_URL=postgresql://…`
2. In `prisma/schema.prisma`, set `provider = "postgresql"`
3. `npx prisma migrate dev`
