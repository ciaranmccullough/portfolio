# `@portfolio/ui` — component authoring guide

Conventions for building components in this package. **Follow these whenever you
create or change a component.** This is a design system organized with **Atomic
Design**; components are written in TypeScript, compiled to **ESM** with `tsc`,
and consumed by bundlers (Next.js / Turbopack, Storybook / Vite).

## 1. Classify it first: Atom, Molecule, or Organism

The tier decides the folder. Pick the **lowest** tier that fits.

| Tier         | Folder           | What it is                                                                                | Examples                                 |
| ------------ | ---------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Atom**     | `src/atoms/`     | One indivisible primitive; renders a single semantic element; composes no other component | `Text`, `Button`, `Input`, `Link`        |
| **Molecule** | `src/molecules/` | A small group of atoms forming one unit                                                   | `FormField` (Label + Input), `SearchBar` |
| **Organism** | `src/organisms/` | A distinct, self-contained section composed of molecules/atoms                            | `Header`, `Footer`, `Card`               |
| **Template** | `src/templates/` | Page-level layout scaffolding                                                             | `PageLayout`                             |

Rule of thumb: if it **composes other components**, it is at least a molecule.
If it is a single primitive element, it is an atom.

## 2. File structure — one folder per component

Create a PascalCase folder under the tier with **exactly these four files**:

```
src/<tier>/<Component>/
├── <Component>.tsx          # implementation (named export)
├── <Component>.types.ts     # props + any exported types (no JSX)
├── <Component>.stories.tsx  # Storybook stories (CSF3)
└── index.ts                 # barrel: re-export the component + its types
```

Then surface it through the barrels:

- tier barrel — `src/atoms/index.ts`: `export * from "./<Component>";`
- the root barrel `src/index.ts` already re-exports each tier.

### The four files — `Text` atom as the reference

`Text.types.ts` (types only, no JSX):

```ts
import type { ComponentPropsWithoutRef } from "react";

/** All native <p> attributes pass through. */
export type TextProps = ComponentPropsWithoutRef<"p">;
```

`Text.tsx` (implementation; imports its own types):

```tsx
import type { TextProps } from "./Text.types";

/** Text — unstyled typographic atom; renders a native <p>. */
export function Text(props: TextProps) {
  return <p {...props} />;
}
```

`index.ts` (barrel — component + types):

```ts
export * from "./Text";
export * from "./Text.types";
```

`Text.stories.tsx` (CSF3; title is `<Tier>/<Component>`):

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  tags: ["autodocs"],
} satisfies Meta<typeof Text>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  args: { children: "The quick brown fox jumps over the lazy dog." },
};
```

## 3. Use semantic HTML — do **not** default to `div`/`span`

Render the **most meaningful native element**. Reach for `<div>`/`<span>` only
when nothing semantic fits (generic grouping or an inline styling hook).

| Need                     | Use                                                                            | Not                   |
| ------------------------ | ------------------------------------------------------------------------------ | --------------------- |
| paragraph / body text    | `<p>`                                                                          | `<div>`               |
| heading                  | `<h1>`–`<h6>`                                                                  | `<div class="title">` |
| list                     | `<ul>` / `<ol>` + `<li>`                                                       | stacked `<div>`s      |
| link / navigation target | `<a href>`                                                                     | `<span onClick>`      |
| action / toggle          | `<button>`                                                                     | `<div onClick>`       |
| page regions             | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` | `<div>`               |
| emphasis                 | `<em>` / `<strong>`                                                            | `<span>`              |

Semantic elements bring built-in roles, keyboard behavior, and screen-reader
meaning for free — that is the whole point of an atom.

## 4. Forms: uncontrolled with refs (default)

Favor **uncontrolled** form atoms. Expose the native element via `ref` and use
`defaultValue` / `defaultChecked`; let the DOM own the value. We target React 19,
so accept `ref` as a normal prop — no `forwardRef` needed.

```tsx
// Input.types.ts
import type { ComponentPropsWithRef } from "react";
export type InputProps = ComponentPropsWithRef<"input">;

// Input.tsx
import type { InputProps } from "./Input.types";

/** Uncontrolled text-input atom. Read its value via a ref. */
export function Input(props: InputProps) {
  return <input {...props} />; // ref + native attributes pass straight through
}
```

Consume it uncontrolled:

```tsx
const ref = useRef<HTMLInputElement>(null);
<Input ref={ref} defaultValue="hello" name="email" />;
// on submit: ref.current?.value
```

Only use a **controlled** pattern (`value` + `onChange`) when you must react to
every keystroke (live validation, input masking). Default to uncontrolled.
_(React 18 equivalent: wrap with `forwardRef`. We are on React 19, where `ref`
is a plain prop.)_

## 5. Accessibility (enforced)

Non-negotiable for every component:

- **Semantics first.** Prefer a native element over ARIA. _No ARIA is better
  than bad ARIA._ Add `role` / `aria-*` only when no element conveys it.
- **Pass props through.** Spread `{...props}` onto the root element so consumers
  can supply `aria-*`, `id`, `onKeyDown`, etc. Never swallow them.
- **Keyboard.** Every interactive element must be focusable and operable by
  keyboard. Use real `<button>` / `<a>` rather than click handlers on `<div>`.
- **Labels.** Inputs need a programmatic label — `<label htmlFor>` (usually at
  the molecule level) or `aria-label` / `aria-labelledby`. Icon-only buttons
  need an `aria-label`.
- **Focus visible.** Never remove focus outlines without an equally visible
  replacement.
- **Images / icons.** Meaningful images need `alt`; decorative ones use `alt=""`
  or `aria-hidden`.
- **Contrast.** Meet WCAG AA (4.5:1 body text, 3:1 large text / UI).
- **Verify.** Check keyboard-only navigation and the Storybook a11y addon before
  calling a component done.

## 6. Build & run

```bash
pnpm --filter @portfolio/ui storybook         # dev — Storybook at :6006
pnpm --filter @portfolio/ui build             # tsc -> dist (ESM + .d.ts)
pnpm --filter @portfolio/ui build-storybook   # static Storybook
pnpm build && pnpm typecheck && pnpm lint     # from the repo root
```

Conventions that keep the build green:

- React / react-dom are **peer dependencies** (`^18 || ^19`) — never bundle React
  into the package.
- Components emit **ESM** (`"type": "module"`, `moduleResolution: "bundler"`). Use
  **extensionless** relative imports (`./Text.types`, not `./Text.types.js`).
- Keep atoms **unstyled / structural**. This package ships behavior and
  semantics, not a theme; visual styling belongs to consumers or higher tiers.
