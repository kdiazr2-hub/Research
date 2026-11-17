# Investigación — Research Hub (M0 spike)

Local-first clinical / biomedical **research project hub**. This M0 vertical slice covers auth, projects, memberships/roles, PHI/consent flags, audit log, and ES/EN UI switching.

## Stack choices (M0)

| Layer | Choice | Notes |
| --- | --- | --- |
| App | **Next.js 15** (App Router) + TypeScript | Per product plan |
| DB | **SQLite** via Prisma 5 | Fast local spike; no Docker required. Path to Postgres: change `provider` + `DATABASE_URL` in `prisma/schema.prisma` |
| Auth | **NextAuth.js** email + **password** (bcrypt) | Simplest secure local path (no SMTP). Magic-link can replace later |
| i18n | Cookie + dictionary skeleton **ES/EN** | Switcher in header; persists to user profile when signed in |
| Roles | Owner / Investigator / Collaborator / Analyst / Viewer | Enforced on project APIs |

**Out of scope in M0:** BibTeX/RIS, notebooks, Quarto export, imaging vault UI (beyond flags), AI.

## Prerequisites

- Node.js 20+ and npm

## Run locally

```bash
cp .env.example .env
# defaults are fine for local spike

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

Fixture project: **Synthetic CT observational pilot** (`PHI_IMAGING`, consent documented, analysis de-ID default on).

## What works

1. Register / login (email + password); login writes an audit event
2. Create / list / update / delete projects (delete = owner)
3. Invite existing users; change roles (owner-only); last-owner protected
4. PHI type (`NONE` / `PHI` / `PHI_IMAGING`), consent flags, legal basis, analysis-deID-default
5. **EQUATOR work type** on create: `CARE` / `PRISMA` / `OTHER` (+ version) with short checklist stub
6. Audit log on project page (login, project create/update, invite, role change, PHI flag change, access denied)
7. ES ↔ EN language switch

## Stubbed / deferred

- Full EQUATOR manuscript templates / interactive checklist (M1+)
- Encrypted object storage / imaging vault UI
- Email magic links / SSO
- Postgres + RLS
- BibTeX, notes, manuscript, Quarto, Python notebooks
- Full next-intl route locales (skeleton dictionaries only)

## API sketch

- `POST /api/auth/register`
- `POST /api/auth/[...nextauth]`
- `GET|POST /api/projects`
- `GET|PATCH|DELETE /api/projects/:id`
- `GET|POST|PATCH /api/projects/:id/members`
- `GET /api/projects/:id/audit`
- `POST /api/locale`

## Postgres later

1. Set `DATABASE_URL=postgresql://…`
2. In `prisma/schema.prisma`, set `provider = "postgresql"`
3. Optionally restore Prisma enums
4. `npx prisma migrate dev`
