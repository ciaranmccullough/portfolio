# `@portfolio/ui` — component authoring guide

Conventions for building components in this package. **Follow these whenever you
create or change a component.** This is a design system organized with **Atomic
Design**, styled with **Tailwind CSS v4**, written in TypeScript, compiled to
**ESM** with `tsc`, and consumed by bundlers (Next.js / Turbopack, Storybook /
Vite).

## 1. Classify it first: Atom, Molecule, or Organism

The tier decides the folder. Pick the **lowest** tier that fits.

| Tier         | Folder           | What it is                                                                                | Examples                               |
| ------------ | ---------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- |
| **Atom**     | `src/atoms/`     | One indivisible primitive; renders a single semantic element; composes no other component | `Text`, `Button`, `Input`, `Link`      |
| **Molecule** | `src/molecules/` | A small group of atoms forming one unit                                                   | `FormField` (Label + Input), `RepoRow` |
| **Organism** | `src/organisms/` | A distinct, self-contained section composed of molecules/atoms                            | `Navbar`, `Hero`, `Footer`             |
| **Template** | `src/templates/` | Page-level layout scaffolding                                                             | `PageLayout`                           |

Rule of thumb: if it **composes other components**, it is at least a molecule.
If it is a single primitive element, it is an atom.

## 2. File structure — one folder per component (five files)

Create a PascalCase folder under the tier with **exactly these five files**:

```
src/<tier>/<Component>/
├── <Component>.tsx          # implementation (named export) — NO class maps
├── <Component>.types.ts     # props + exported types (no JSX)
├── <Component>.styles.ts    # Tailwind class definitions (class Records + base strings)
├── <Component>.stories.tsx  # Storybook stories (CSF3)
└── index.ts                 # barrel: re-export the component + its types
```

Surface it through the barrels:

- tier barrel — `src/atoms/index.ts`: `export * from "./<Component>";`
- the root barrel `src/index.ts` already re-exports each tier.
- **Do not** export `*.styles` from the barrels — styles are an internal detail.

### The five files — `Button` atom as the reference

`Button.types.ts` (types only, no JSX):

```ts
import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "dark" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
```

`Button.styles.ts` (all Tailwind class definitions live here — base strings and
the per-variant **class Records**):

```ts
import type { ButtonSize, ButtonVariant } from "./Button.types";

export const buttonBase = "cursor-pointer font-body font-semibold";

export const buttonVariant: Record<ButtonVariant, string> = {
  primary: "bg-brand-violet text-white",
  dark: "bg-ink text-fg-inverse",
  ghost: "border border-line-strong bg-transparent text-ink",
};

export const buttonSize: Record<ButtonSize, string> = {
  sm: "rounded-md px-3 py-2 text-xs",
  md: "rounded-lg px-4.5 py-3 text-md",
  lg: "rounded-xl px-6 py-3.5 text-lg",
};
```

`Button.tsx` (implementation — imports its styles; **contains no class maps**):

```tsx
import { cn } from "../../cn";
import { buttonBase, buttonSize, buttonVariant } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonBase,
        buttonVariant[variant],
        buttonSize[size],
        className,
      )}
      {...props}
    />
  );
}
```

`index.ts` re-exports the component + types (not the styles); `Button.stories.tsx`
is CSF3 with `title: "<Tier>/<Component>"`.

## 3. Styling — Tailwind v4 from the shared theme

- **Utility classes only.** No inline `style={{...}}`. No imported token JS —
  `@portfolio/tokens` is **CSS-only** (it ships `theme.css`, the `@theme`).
- **Design tokens come from the theme.** Colours, type scale, spacing, radii and
  shadows are defined once in `packages/tokens/theme.css` `@theme`; use the
  generated utilities (`bg-brand-violet`, `text-fg-muted`, `rounded-lg`,
  `font-mono`, `shadow-brutal`, …). If a token value is genuinely missing, add it
  to `theme.css` rather than hardcoding it.
- **Don't hardcode token-level values** as arbitrary brackets — `bg-[#6a47ff]`
  when `bg-brand-violet` exists, or `text-[13px]` when `text-sm` exists, is wrong.
  Arbitrary `[..]` values are fine for genuine one-offs that have no token (a
  specific `max-w-[18ch]`, a `clamp`). Selector variants like `[&>svg]:size-full`
  are fine.
- **Class definitions live in `*.styles.ts`.** The `.tsx` imports `buttonBase`,
  `buttonVariant`, etc., and composes them with the **`cn`** helper
  (`packages/ui/src/cn.ts`), which also merges an incoming `className` so the
  component stays overridable. The `.tsx` must contain **no class Records**.

## 4. Use semantic HTML — do **not** default to `div`/`span`

Render the **most meaningful native element**. Reach for `<div>`/`<span>` only
when nothing semantic fits (generic grouping or a styling hook).

| Need                     | Use                                                                            | Not                   |
| ------------------------ | ------------------------------------------------------------------------------ | --------------------- |
| paragraph / body text    | `<p>`                                                                          | `<div>`               |
| heading                  | `<h1>`–`<h6>`                                                                  | `<div class="title">` |
| list                     | `<ul>` / `<ol>` + `<li>`                                                       | stacked `<div>`s      |
| link / navigation target | `<a href>`                                                                     | `<span onClick>`      |
| action / toggle          | `<button>`                                                                     | `<div onClick>`       |
| page regions             | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` | `<div>`               |
| emphasis                 | `<em>` / `<strong>`                                                            | `<span>`              |

## 5. Forms: uncontrolled with refs (default)

Favor **uncontrolled** form atoms. Expose the native element via `ref` and use
`defaultValue` / `defaultChecked`; let the DOM own the value. We target React 19,
so accept `ref` as a normal prop — no `forwardRef` needed. Only use a controlled
pattern (`value` + `onChange`) when you must react to every keystroke.

## 6. Accessibility (enforced)

- **Semantics first.** Prefer a native element over ARIA. Add `role` / `aria-*`
  only when no element conveys it.
- **Pass props through.** Spread `{...props}` onto the root element so consumers
  can supply `aria-*`, `id`, `onKeyDown`, etc.
- **Keyboard.** Every interactive element must be focusable and operable by
  keyboard. Use real `<button>` / `<a>`, not click handlers on `<div>`.
- **Labels.** Inputs need a programmatic label — `<label htmlFor>` or
  `aria-label`. Icon-only buttons need an `aria-label`.
- **Focus visible.** Never remove focus outlines without a visible replacement.
- **Images / icons.** Meaningful images need `alt`; decorative ones use `alt=""`
  / `aria-hidden`. `eslint-plugin-jsx-a11y` enforces much of this.

## 7. Build & run

```bash
pnpm --filter @portfolio/ui storybook         # dev — Storybook at :6006
pnpm --filter @portfolio/ui build-storybook   # static Storybook (compiles Tailwind)
pnpm build && pnpm typecheck && pnpm check     # from the repo root (check = eslint + prettier)
```

- React / react-dom are **peer dependencies** (`^18 || ^19`) — never bundle React.
- Components emit **ESM** (`moduleResolution: "bundler"`); use **extensionless**
  relative imports (`./Button.styles`, not `./Button.styles.js`).
