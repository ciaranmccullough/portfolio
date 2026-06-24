import type { ComponentPropsWithRef } from "react";

/**
 * Props for the {@link Input} atom. Extends native `<input>` attributes,
 * including `ref` (React 19) for uncontrolled usage.
 */
export type InputProps = ComponentPropsWithRef<"input">;
