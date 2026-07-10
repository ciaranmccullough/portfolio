"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Whether scroll-driven animations (parallax, reveals, the pinned
 * walkthrough) should be active.
 *
 * `false`:
 * - during SSR and the initial client render (before the `useEffect` below
 *   has run) — so the server-rendered HTML and the first client render
 *   always match (no hydration mismatch), and nothing is ever rendered
 *   hidden/transformed before JS has had a chance to run — a scroll-driven
 *   style is only ever applied once we know we're truly on the client, past
 *   hydration.
 * - whenever the user has `prefers-reduced-motion: reduce` set — components
 *   consuming this fall back to their static, fully-visible layout.
 *
 * `true` only once mounted on the client AND reduced motion has been
 * confirmed *not* to be requested. Consumers should treat `false` as "render
 * the plain, static version" and `true` as "safe to layer scroll-driven
 * motion on top."
 */
export function useScrollAnimationsEnabled(): boolean {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && prefersReducedMotion !== true;
}
