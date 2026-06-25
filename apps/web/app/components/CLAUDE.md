# `apps/web/app/components` — app component guide

App-specific React components live here, **one folder per component**, each split
into three files. These are the app's own components — client wrappers, forms and
wiring that compose the `@portfolio/ui` design system with app concerns (Motion
animation, Contentful data, i18n copy). They are distinct from `@portfolio/ui`,
which stays presentational and reusable.

## Structure — one folder per component (three files)

```
app/components/<Component>/
├── <Component>.tsx          # implementation (named export)
├── <Component>.types.ts     # props + exported types (no JSX, no runtime values)
└── <Component>.styles.ts    # Tailwind class strings as named consts (no JSX)
```

- **`<Component>.tsx`** — the component. Imports its types and styles; owns the
  logic (hooks, handlers, local constants). **No inline `className` string
  literals** — every class string comes from `<Component>.styles.ts`.
- **`<Component>.types.ts`** — props interface + any exported types. Types only.
- **`<Component>.styles.ts`** — Tailwind v4 utility class strings as named
  `const`s, from the shared theme (same tokens as `@portfolio/ui`). No JSX.

## Conventions

- Mark interactive / browser-only components with `"use client"` (most app
  components are, e.g. they use Motion or React state).
- Compose `@portfolio/ui` primitives; pass user-facing copy in as props from the
  localized dictionary — components hold **no hardcoded UI strings**.
- Imports: `@/lib/*` for service helpers, `@/hooks/*` for hooks,
  `../components/<Component>/<Component>` for use from a route,
  `./<Component>.styles` / `./<Component>.types` within the folder.

## Reference: `SiteNav`

- `SiteNav.types.ts` — `export type SiteNavProps = NavbarProps;`
- `SiteNav.styles.ts` — `export const siteNavClass = "sticky top-0 z-50";`
- `SiteNav.tsx` — `"use client"`; wraps `<Navbar>` in a `motion.div` and drives
  the hide-on-scroll animation from the `useHideOnScroll` hook.

## Not components

Data modules are **not** components: the i18n `dictionaries` (locale-specific)
stay under `app/[lang]/`; non-locale data — e.g. the hero tabs in
`app/data/heroTabs.tsx` — lives under `app/data/`. Routes (`page.tsx`,
`layout.tsx`) stay under `app/[lang]/` too.
