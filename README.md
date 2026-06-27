# Software Engineer Portfolio

A personal portfolio for **Ciaran McCullough** — a content-driven Next.js site backed by a shared, atomic-design component library. Built as a pnpm monorepo so the design system, design tokens, and the app evolve together.

## Tech stack

- **pnpm workspaces** monorepo
- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** — utilities generated from a shared `@theme`
- **Contentful** (Content Delivery API, ISR-cached) for editable content
- **Motion** for animation
- **Storybook** as the component workshop

## Monorepo layout

| Path              | Package             | What it is                                                                |
| ----------------- | ------------------- | ------------------------------------------------------------------------- |
| `apps/web`        | `@portfolio/web`    | The Next.js portfolio site                                                |
| `packages/ui`     | `@portfolio/ui`     | Shared React component library (Atomic Design) + Storybook; ESM via `tsc` |
| `packages/tokens` | `@portfolio/tokens` | CSS-only design tokens — the Tailwind v4 `@theme` (`theme.css`)           |
| `packages/config` | `@portfolio/config` | Shared TypeScript / ESLint / Prettier presets                             |

## Getting started

### Prerequisites

- **Node ≥ 20.9**
- **pnpm 10.6.5** — `corepack enable` pins the version declared in `package.json`

### Install

```bash
pnpm install
```

### Configure Contentful

```bash
cp apps/web/.env.example apps/web/.env.local
```

Fill in `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN`. Use a **Content Delivery API** token (read-only) — not a Management (`CFPAT-…`) token, which the Delivery API rejects. Without valid credentials the site renders an error screen in place of CMS-backed content rather than faking it.

### Run

```bash
pnpm dev                                # web → http://localhost:3000
pnpm --filter @portfolio/ui storybook   # Storybook → http://localhost:6006
```

## Scripts

Run from the repo root:

| Command                        | Description                                              |
| ------------------------------ | -------------------------------------------------------- |
| `pnpm dev`                     | Start the web dev server (Turbopack)                     |
| `pnpm build`                   | Build every package (`ui` → `tsc`, `web` → `next build`) |
| `pnpm typecheck`               | Type-check all packages                                  |
| `pnpm lint` / `pnpm lint:fix`  | ESLint over `apps` + `packages`                          |
| `pnpm format` / `format:write` | Prettier check / write                                   |
| `pnpm check`                   | `lint` + `format` (the pre-commit gate)                  |

## Content model

Two Contentful content types back the site:

- **`project`** → the Hero (rich-text title, description, résumé URL)
- **`about`** → the About section (title, description, portrait image asset, and a `tabs` JSON array of `{ title, description }`)

Content is fetched server-side and cached with ISR (`revalidate` 1h, tag `contentful`), so edits in Contentful appear without a redeploy.

## Architecture

### Web (`apps/web`)

Server-side data flows in one direction:

```
services/   raw Contentful call → Response DTO
   ↓
mappers/    DTO → domain entity (types/)
   ↓
lib/        compose + ISR cache + null-fallback
   ↓
app/        route / component consumes the clean entity
```

- `app/[lang]/` — locale-prefixed routes (currently only `en`); the proxy in `apps/web/proxy.ts` redirects locale-less paths to the default locale.
- `app/components/` — app-specific wrappers (Motion, forms) that compose `@portfolio/ui` primitives with localized copy.
- Conventions: [`services/CLAUDE.md`](apps/web/services/CLAUDE.md), [`app/components/CLAUDE.md`](apps/web/app/components/CLAUDE.md).

### Design system (`packages/ui`)

Organized with **Atomic Design** — `atoms` / `molecules` / `organisms` / `templates`. Each component is one folder of five files (component, `.types`, `.styles`, `.stories`, barrel `index`), styled with Tailwind utilities from `@portfolio/tokens` and compiled to ESM. Components stay presentational; app concerns (data, motion) live in `apps/web`. Conventions: [`packages/ui/CLAUDE.md`](packages/ui/CLAUDE.md).

### Tokens (`packages/tokens`)

Ships a single `theme.css` — the Tailwind v4 `@theme` defining colours, type scale, spacing, radii, and shadows. Imported once by both the web app and Storybook so they share one source of truth.

## Deployment

A standard Next.js app — deploy to any Node runtime (e.g. Vercel). It relies on ISR and a proxy (middleware), so a fully static export won't cover it.

## License

[MIT](LICENSE).
