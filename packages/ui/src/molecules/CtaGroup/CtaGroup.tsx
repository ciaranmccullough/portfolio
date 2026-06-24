import type { CtaGroupProps } from "./CtaGroup.types";

/**
 * CtaGroup — lays out paired primary/secondary actions in a row that wraps.
 * Pass the action controls (Button / Link) as children.
 */
export function CtaGroup({ style, children, ...props }: CtaGroupProps) {
  return (
    <div
      role="group"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
