# Investigación — Research Hub (M2)

Local-first clinical / biomedical **research project hub**.  
**M0:** auth, projects, roles, PHI/consent flags, EQUATOR templates + checklist, audit.  
**M1:** BibTeX/RIS library, PDF attach, notes linked to refs, Markdown manuscript with citekeys, Quarto/Pandoc export path.  
**M2:** tabular data fields/rows, PHI mark + de-ID → `analysis/`, Python notebook/artifact registration (no in-app kernel).

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| App | **Next.js 15** (App Router) + TypeScript | Per product plan |
| DB | **SQLite** via Prisma 5 | Local-first; Postgres later |
| Auth | **NextAuth.js** email + password (bcrypt) | No SMTP required |
| i18n | Cookie + dictionaries **ES/EN** | Header switcher |
| Files | Local `STORAGE_ROOT` / `EXPORT_ROOT` | PDFs, `analysis/` CSVs, notebook uploads |
| Export | Quarto/Pandoc skeleton → `.docx` / `.tex` | Pandoc optional on PATH |
| Analysis | External Jupyter / VS Code / Positron | Python only; de-ID datasets by default |

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
| `kevin@example.com` | `password123` | OWNER (PHI table R/W) |
| `ana@example.com` | `password123` | COLLABORATOR (no PHI table; non-PHI columns only) |
| `luis@example.com` | `password123` | ANALYST (de-ID datasets + notebooks; no PHI table) |

Fixture: **Synthetic CT observational pilot** (CARE, `PHI_IMAGING` flags, sample BibTeX, tabular fields with PHI mark, stub notebook + artifact).

## M2 what works

1. Project nav: Overview · Library · Notes · **Data** · **Analysis** · Manuscript · Export
2. Define tabular **fields** (name, type, PHI flag, de-ID mode strip/hash)
3. Enter **rows**; import/export **CSV**
4. **De-ID export** strips/hashes PHI → CSV under `STORAGE_ROOT/projects/<id>/analysis/` (default analysis path)
5. Register **Python** notebooks/scripts (`.ipynb` / `.py` / `.qmd` path or upload); deep-link / open instructions (no kernel)
6. Register **artifacts** (figure/table) with provenance (notebook + analysis dataset)
7. Roles: Owner / Investigator+PHI grant edit PHI tables; Collaborator/Viewer default without PHI table access; Analyst gets de-ID only
8. Audit: `DATA_FIELD_PHI_MARK`, `DATA_CSV_EXPORT_DEID`, `NOTEBOOK_REGISTER`, …

## Stubbed / deferred

- Live Zotero sync
- Full PDF.js viewer / real highlight anchoring
- Rich CSL formatting in-browser
- **Imaging vault / DICOM** (M3)
- Embedded Jupyter kernel, R, AI features
- In-app Word preview

## Export without server Pandoc

Unzip the download, then:

```bash
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.docx
pandoc manuscript.qmd --citeproc --bibliography=references.bib -o manuscript.tex
# or: quarto render manuscript.qmd --to docx
```

## API sketch (M2 additions)

- `GET|POST /api/projects/:id/data/fields`
- `PATCH|DELETE /api/projects/:id/data/fields/:fieldId`
- `GET|POST /api/projects/:id/data/rows`
- `PATCH|DELETE /api/projects/:id/data/rows/:rowId`
- `GET|POST /api/projects/:id/data/csv` (`?mode=raw|deid`)
- `GET|POST /api/projects/:id/data/deid` · `GET .../deid/:exportId`
- `GET|POST /api/projects/:id/notebooks` · `PATCH|DELETE .../notebooks/:id`
- `GET|POST /api/projects/:id/artifacts` · `DELETE .../artifacts/:id`

## Postgres later

1. Set `DATABASE_URL=postgresql://…`
2. In `prisma/schema.prisma`, set `provider = "postgresql"`
3. `npx prisma migrate dev`
