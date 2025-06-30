# Engineering Practices Guide

A concise, opinionated handbook every developer on the project should follow to write modern, clear, maintainable, and scalable code.

## 1. Core Principles

- **Readability > Cleverness** – Favour explicit, self‑documenting code even if it adds a few lines.
- **Single Source of Truth** – No duplication of logic, schemas, or env variables.
- **Fail Fast, Recover Gracefully** – Throw early, handle at boundaries, never silently swallow errors.
- **Small PRs, Frequent Merges** – < 300 LOC; review cycles < 24 h.
- **Automate What Hurts** – Repetitive chores belong in scripts or CI jobs.

## 2. Repository Conventions

| Area          | Practice                                                                               |
| ------------- | -------------------------------------------------------------------------------------- |
| Branching     | Trunk‑based (main) + short‑lived feature branches (feat/xyz)                           |
| Commits       | Conventional Commits (feat:, fix:, chore:). One logical change per commit.             |
| Pull Requests | Draft early, link to issue, screen‑record demo (Loom). Include Why, What, How to Test. |
| Monorepo      | Use pnpm workspaces; shared libs live in packages/.                                    |

## 3. Code Style & Structure

### 3.1 JavaScript / TypeScript

- **Language**: TypeScript strict mode (noImplicitAny, exactOptionalPropertyTypes).
- **Style**: Prettier defaults; Airbnb base ESLint rules + project overrides.
- **Naming**: camelCase for vars/functions, PascalCase for types/components, UPPER_SNAKE for env constants.
- **File Layout**: One React component per file. Keep hooks in hooks/, utilities in lib/.
- **Barrel Files** (index.ts) only for public boundaries, not every folder.

### 3.2 Backend (Node / Express / Next API)

- Layered structure: controllers/, services/, repositories/.
- Dependency Injection via lightweight factory pattern; avoid global singletons.
- Return typed Result / Error objects instead of throwing across layers.

## 4. API Design

- Prefer REST with nouns (/users/{id}/bookmarks) & proper status codes.
- Version in URL (/v1/) only when breaking change ships.
- Validation at edge (Zod/Joi) ‑> map to domain DTOs.
- Document with OpenAPI; auto‑publish Swagger UI at /docs route.

## 5. Testing Strategy

| Level       | Tooling                    | Goal                        |
| ----------- | -------------------------- | --------------------------- |
| Unit        | Vitest/Jest                | Logic correctness, branches |
| Component   | React Testing Library      | UI contract                 |
| Integration | Supertest + Testcontainers | DB, APIs, queues            |
| E2E         | Playwright                 | Critical user journeys      |

- Target 80 % coverage, but never write meaningless tests.
- Snapshot tests only for stable, deterministic output.

## 6. Continuous Integration / Delivery

GitHub Actions workflow:

1. Install deps – cache via pnpm.
2. Lint → Type‑check → Test → Build.
3. If on main, deploy to Vercel/Fly.
4. Block merge if any step fails.

Use semantic‑release to auto‑tag versions and generate CHANGELOG.

## 7. Security & Compliance

- OWASP Top 10 audit each quarter.
- Use helmet or equivalent headers middleware.
- Store secrets in env vault (Vercel / 1Password). Never commit .env.
- RBAC at DB layer, not only in code.
- Run npm audit --production weekly via scheduled CI.

## 8. Performance & Scalability

- **Front‑end**: Code‑split routes, lazy‑load images with loading="lazy", memoize expensive selectors.
- **Backend**: Use pagination & indexes; avoid N+1 with data‑loader pattern.
- **Caching**: Cloudflare edge for public GETs; Redis for session & computed data.
- **Budget**: P95 API < 200 ms, LCP < 2.5 s on mid‑tier mobile.

## 9. Accessibility & Internationalization

- Run axe CI check; zero critical violations.
- Every interactive element accessible via keyboard.
- Use aria‑labels; form fields have `<label>`.
- Store copy in i18n JSON; never hard‑code text.

## 10. Documentation

- **README**: Quickstart ≤ 5 commands; architecture diagram.
- **ADR Folder**: One markdown per significant design decision.
- **JSDoc / TSDoc** for public functions & exported types.
- **Storybook** for UI components with usage examples.

## 11. Code Review Checklist (Run before you hit Merge)

- [ ] Does the code compile & tests pass?
- [ ] Is the intent clear—would a newcomer grok it?
- [ ] Any obvious performance foot‑guns?
- [ ] Is error handling adequate and logged?
- [ ] Do we delete dead code / TODOs? (Future‑me will thank you.)

## 12. Learning & Continuous Improvement

- Pair programming on complex changes (> 1 day effort).
- Weekly tech debt triage: label and time‑box fixes.
- Monthly lunch‑and‑learn: 20‑minute demo of new tool, pattern, or post‑mortem.

## 13. Common Setup Issues & Solutions

### NPM Naming Restrictions

**Issue**: When initializing Next.js with `create-next-app`, you may encounter:

```
Could not create a project called "LinkNest" because of npm naming restrictions:
    * name can no longer contain capital letters
```

**Solution**:

- Use lowercase in package.json name field: `"name": "linknest"`
- The folder name can still contain capitals, but the package name must be lowercase
- Alternative: manually create package.json first, then install dependencies

### Package Manager Availability

**Issue**: `pnpm: command not found` when following setup instructions

**Solution**:

- Install pnpm globally: `npm install -g pnpm`
- Or use npm/yarn as alternatives (update commands accordingly)
- Check availability first: `which pnpm` or `pnpm --version`

---

Last updated: 2025‑06‑30 – keep this guide evergreen; PRs welcome.

---

# LinkNest Product Requirements Document (PRD)

## 1. Vision

A friction‑free, cross‑device home for personal and shareable bookmarks that feels as quick as opening a new browser tab.

## 2. Objectives & Success Metrics

- **Daily Active Users (DAU)**: 100 within 3 months of soft‑launch
- **Mean Time to Save a Link (MTTS)**: ≤ 5 s from paste to confirmation
- **Uptime**: ≥ 99.9 % (Vercel + Neon Postgres)
- **NPS**: ≥ 45 by end of Beta

## 3. Target Personas & Key Use‑Cases

| Persona                                      | Use‑Case                                               |
| -------------------------------------------- | ------------------------------------------------------ |
| **Curator Chloe** – DevRel, tweets resources | Capture & tag dev articles, then publish a public page |
| **Learner Leo** – Bootcamp student           | Collect tutorial links, search by topic during study   |
| **Marketer Maya** – Social strategist        | Store competitor landing pages, organise by campaign   |

## 4. Core Features (MVP)

- OAuth sign‑in (GitHub & Google)
- Save link → auto‑fetch title, description, OG image
- Tag, search, and infinite‑scroll list
- Optional public‑share toggle

## 5. Nice‑to‑Have (Post‑MVP)

- Browser extension "one‑click save"
- AI tag suggester
- Bulk import/export (Netscape, CSV)
- Offline‑first PWA

## 6. Out of Scope

- Team collaboration / multi‑user boards
- Native mobile apps (for now)

## 7. Risks & Mitigations

| Risk                              | Mitigation                                        |
| --------------------------------- | ------------------------------------------------- |
| OG metadata fetch blocked by CORS | Proxy fetch via server actions                    |
| Abuse of public pages             | Rate‑limit saves, CAPTCHA on OAuth sign‑up bursts |
| Link rot                          | Nightly cron checks 404s → mark as stale          |

---

# LinkNest Technical Specification

## 1. System Architecture

- **Frontend**: Next.js 14 App Router (React 18, TypeScript, Tailwind)
- **Backend**: Next.js Route Handlers & Server Actions; lib/prisma.ts singleton
- **Database**: Postgres (Neon) proxied via Prisma
- **Auth**: next-auth (Auth.js)
- **Data Fetch**: React Query (tanstack) on client; server components for first paint
- **Storage**: OG images cached in Vercel KV (edge) for 24 h

## 2. Data Model (Prisma v5)

```prisma
model User       { id String @id @default(cuid()) email String @unique ... }
model Bookmark   { id String @id @default(cuid()) url String @unique title String ... }
model Tag        { id String @id @default(cuid()) name String @unique ... }
```

## 3. API / Server Actions

| Action         | Path / Name               | Auth | Summary                                     |
| -------------- | ------------------------- | ---- | ------------------------------------------- |
| createBookmark | /app/bookmarks/actions.ts | ✅   | Validate URL, dedupe, fetch OG              |
| deleteBookmark | ‑                         | ✅   | Soft delete (flag deletedAt)                |
| listBookmarks  | ‑                         | ✅   | Cursor‑based pagination; filters query, tag |

## 4. Security & Compliance

- OWASP Top 10 reviewed; helmet headers via Next.js middleware
- Row‑level privacy: userId FK enforcement
- CSRF handled by next-auth
- S3‑style presigned upload URLs to prevent direct public writes

## 5. DevOps

- **CI**: GitHub Actions → lint, test, prisma migrate dev --skip-generate
- **CD**: Vercel preview per PR; production promotes main branch
- **Observability**: Vercel Analytics + Sentry (client & server)

---

# LinkNest Milestone Plan

| Milestone                         | ETA       | Deliverables                                                                     |
| --------------------------------- | --------- | -------------------------------------------------------------------------------- |
| **M0 – Setup & Auth**             | Day 0‑1   | Repo scaffold, Postgres, GitHub/Google OAuth working locally & on Vercel preview |
| **M1 – Core CRUD**                | Day 2‑4   | Bookmark model, create/list/delete actions, Prisma Studio sanity                 |
| **M2 – OG Fetch & Tagging**       | Day 5‑7   | Metadata fetcher, tag editor, many‑to‑many relation                              |
| **M3 – Search & Infinite Scroll** | Day 8‑10  | Text search, URL param filters, React Query hooks                                |
| **M4 – Public Pages & SEO**       | Day 11‑13 | /u/[user]/[slug], OG image generation                                            |
| **M5 – Polish & Beta Launch**     | Day 14‑15 | Lighthouse/axe pass, CI/CD hardened, invite‑only beta                            |

---

# Development Milestones Roadmap

## Foundation Phase

### 0. Project Kick-off (½ day)

- Write one-paragraph elevator pitch
- Create GitHub repo
- Pick stack versions

### 1. Dev Environment & Tooling (2 days)

- Install Node, pnpm/yarn, Postgres locally (or Docker)
- Init repo with ESLint, Prettier, Husky pre-commit
- Set up VS Code settings & recommended extensions

### 2. Git & Branch Strategy (½ day)

- Decide trunk-based vs GitFlow
- Protect main branch
- Draft PR template

## Core Product Build

### 3. Database Schema & ORM (3 days)

- Model core entities (User, Bookmark, Tag)
- Write first migration; seed script
- Add Prisma

### 4. REST / GraphQL API (4 days)

- Scaffold Next API server
- CRUD routes for main entity
- Input validation (Zod)
- Postman collection

### 5. User Authentication (3 days)

- Add NextAuth.js
- Register, login, logout endpoints
- Secure each CRUD route with middleware

### 6. Front-end UI Skeleton (4 days)

- Create React pages: Home, Dashboard, 404
- Integrate Next App Router
- Global layout with Tailwind

### 7. State Management & Data Fetching (3 days)

- Use React Query
- Show loading & error states
- Optimistic update on Create/Delete

## Quality & Reliability

### 8. Automated Testing (4 days)

- Unit tests for utils (Vitest)
- Component tests (Testing Library)
- One end-to-end test (Playwright)

### 9. Accessibility & Performance (2 days)

- Run Lighthouse; fix a11y issues
- Lazy-load images; code-split
- Keyboard navigation check

## Deployment & Ops

### 10. Continuous Deployment (3 days)

- Provision cloud DB (Neon)
- Deploy to Vercel
- Add GitHub Actions: lint-test-deploy on merge

### 11. Monitoring & Logging (2 days)

- Add Sentry for errors
- Structured logs (pino)
- Health check endpoint

### 12. Analytics & Feature Flags (2 days)

- Integrate PostHog
- Toggle one small feature with ConfigCat

## Launch & Beyond

### 13. Beta Launch & Feedback Loop (4 days)

- Create invite code flow
- Ship to 10 friends
- Collect bug reports with GitHub Issues template

### 14. Post-Launch Iteration (ongoing)

- Prioritise feedback in Kanban
- Weekly retro; plan next sprint
- Consider stretch features: PWA offline, Mobile wrapper, AI tag suggestions
