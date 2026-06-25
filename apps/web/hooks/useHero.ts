"use client";

import { use } from "react";

import type { Hero } from "@/types/hero";

/**
 * Consume the server-fetched Hero in a client component. The fetch itself runs
 * on the server (`getHero`, cached as SSG/ISR); this hook just unwraps the
 * streamed promise with React 19's `use()`. So the UI gets a clean `Hero`
 * entity with no client-side request and no loading flash — the data is already
 * in the prerendered HTML.
 *
 * Call inside a `<Suspense>` boundary (the component suspends until the promise
 * settles, which for a static route happens at build time).
 */
export function useHero(heroPromise: Promise<Hero>): Hero {
  return use(heroPromise);
}
