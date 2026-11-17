# Investigación — Research Hub (M3)

Local-first clinical / biomedical **research project hub**.  
**M0:** auth, projects, roles, PHI/consent flags, EQUATOR templates + checklist, audit.  
**M1:** BibTeX/RIS library, PDF attach, notes linked to refs, Markdown manuscript with citekeys, Quarto/Pandoc export path.  
**M2:** tabular data fields/rows, PHI mark + de-ID → `analysis/`, Python notebook/artifact registration (no in-app kernel).  
**M3:** imaging vault (metadata + encrypted/local upload), imaging roles separate from manuscript, working-copy ID strip, retention stubs, hardened audit filters, security checklist.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| App | **Next.js 15** (App Router) + TypeScript | Per product plan |
| DB | **SQLite** via Prisma 5 | Local-first; Postgres later |
| Auth | **NextAuth.js** email + password (bcrypt) | No SMTP required |
| i18n | Cookie + dictionaries **ES/EN** | Header switcher |
| Files | Local `STORAGE_ROOT` / `EXPORT_ROOT` | PDFs, `analysis/`, notebooks, **imaging vault** |
| Imaging | Metadata + AES-GCM vault blobs (optional key) | **Not a PACS / DICOM viewer** |
| Export | Quarto/Pandoc skeleton → `.docx` / `.tex` | Pandoc optional on PATH |
| Analysis | External Jupyter / VS Code / Positron | Python only; de-ID datasets; **no imaging by default** |

## Prerequisites

- Node.js 20+ and npm
- Optional: [Pandoc](https://pandoc.org/installing.html) (and/or Quarto) for server-side Word/LaTeX

## Run locally

```bash
cp .env.example .env
# defaults are fine for local; set IMAGING_VAULT_KEY for AES-GCM vault blobs

npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo users (seed)

| Email | Password | Role on fixture project |
| --- | --- | --- |
| `kevin@example.com` | `password123` | OWNER (PHI + imaging) |
| `ana@example.com` | `password123` | COLLABORATOR (no PHI table, **no imaging**) |
| `luis@example.com` | `password123` | ANALYST (de-ID + notebooks; **no imaging**) |

Fixture: **Synthetic CT observational pilot** (CARE, `PHI_IMAGING`, tabular PHI fields, stub notebook, **seed CT imaging study** + retention date 2028-12-31).

## M3 what works

1. Project nav adds **Imaging**, **Security**, **Audit** (filtered)
2. **Imaging vault:** register study metadata (modality, study date, accession stub, subject key) + optional DICOM/PNG/JPEG/NIfTI/zip upload under `STORAGE_ROOT/projects/<id>/imaging/vault/` (AES-GCM when `IMAGING_VAULT_KEY` set)
3. **Roles:** Collaborator / Viewer / Analyst default **no** imaging; Owner always; Investigator only with `canViewImaging` grant (toggle in Members). Manuscript access ≠ imaging
4. **Working copies:** stripped JSON under `imaging/working/` (no pixels, identifiers redacted). Analysis page reminds: never send imaging to notebooks by default
5. **Retention:** project-level `retentionDestroyAt` + per-study mark-for-delete / purge **stubs** (audited; scheduled job deferred)
6. **Security checklist** page: local hosting, PHI flags, de-ID default, imaging roles, vault key
7. **Audit** page: filter by action / user / date / text search

## Stubbed / deferred

- Full DICOM viewer / PACS / HL7/FHIR
- Scheduled retention purge worker
- Live Zotero sync; embedded Jupyter; R; AI
- Rich CSL in-browser; in-app Word preview

## Smoke helpers

```bash
npx tsx scripts/smoke-deid.ts
npx tsx scripts/smoke-imaging.ts
```

## API sketch (M3 additions)

- `GET|POST /api/projects/:id/imaging`
- `GET|PATCH /api/projects/:id/imaging/:studyId` (`?download=vault|working`)
- `GET|PATCH /api/projects/:id/retention`
- `GET /api/projects/:id/audit?action=&user=&q=&from=&to=`

## Postgres later

1. Set `DATABASE_URL=postgresql://…`
2. In `prisma/schema.prisma`, set `provider = "postgresql"`
3. `npx prisma migrate dev`
