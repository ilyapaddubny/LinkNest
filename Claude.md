# Engineering Practices Guide

A concise, opinionated handbook every developer on the project should follow to write modern, clear, maintainable, and scalable code.

## 1. Core Principles

- **Readability > Cleverness** – Favour explicit, self‑documenting code even if it adds a few lines.
- **Single Source of Truth** – No duplication of logic, schemas, or env variables.
- **Fail Fast, Recover Gracefully** – Throw early, handle at boundaries, never silently swallow errors.
- **Small PRs, Frequent Merges** – < 300 LOC; review cycles < 24 h.
- **Automate What Hurts** – Repetitive chores belong in scripts or CI jobs.

## 2. Repository Conventions

| Area | Practice |
|------|----------|
| Branching | Trunk‑based (main) + short‑lived feature branches (feat/xyz) |
| Commits | Conventional Commits (feat:, fix:, chore:). One logical change per commit. |
| Pull Requests | Draft early, link to issue, screen‑record demo (Loom). Include Why, What, How to Test. |
| Monorepo | Use pnpm workspaces; shared libs live in packages/. |

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

| Level | Tooling | Goal |
|-------|---------|------|
| Unit | Vitest/Jest | Logic correctness, branches |
| Component | React Testing Library | UI contract |
| Integration | Supertest + Testcontainers | DB, APIs, queues |
| E2E | Playwright | Critical user journeys |

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

---

Last updated: 2025‑06‑30 – keep this guide evergreen; PRs welcome.