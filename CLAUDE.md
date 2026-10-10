# Darshan Yatra

Travel and pilgrimage platform. TypeScript everywhere: React + Vite in `frontend/`, Express + Prisma (MariaDB) in `backend/`.

## Rules

Read the rule file that covers what you are touching before editing.

- @.claude/rules/architecture.md — Clean Architecture layers and the dependency rule
- @.claude/rules/backend.md — API, validation, errors, Prisma
- @.claude/rules/frontend.md — React structure, state, styling
- @.claude/rules/design.md — visual and copy standards
- @.claude/rules/typescript.md — language rules for both apps
- @.claude/rules/git.md — commits and branches

## Commands

| Where | Command | Purpose |
|---|---|---|
| `backend/` | `npm run dev` | API with reload |
| `backend/` | `npm run typecheck` | `tsc --noEmit` |
| `backend/` | `npm test` | unit tests |
| `backend/` | `npm run db:generate` / `db:migrate` / `db:seed` | Prisma client, migrations, seed data |
| `frontend/` | `npm run dev` | Vite dev server |
| `frontend/` | `npm run build` | typecheck and production build |
| `frontend/` | `npm run lint` | oxlint |

## Non-negotiables

- No AI attribution anywhere: no co-author trailers, no "generated with" lines, in commits, PRs, code comments, or docs.
- Never read or print `backend/.env`. Variable names live in `backend/.env.example`.
- A change is done when typecheck, lint, and tests pass. Say so plainly when they do not.
