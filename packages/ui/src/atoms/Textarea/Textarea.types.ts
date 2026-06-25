import type { ComponentPropsWithRef } from "react";

/**
 * Props for the {@link Textarea} atom. Extends native `<textarea>` attributes,
 * including `ref` (React 19) for uncontrolled usage.
 */
export type TextareaProps = ComponentPropsWithRef<"textarea">;
