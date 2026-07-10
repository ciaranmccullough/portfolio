/* Wraps the background image passed into CaseStudyHero's `backgroundImage`
   slot, which is itself rendered inside an `absolute inset-0` layer — this
   needs to fill that layer (so the `next/image fill` inside it still sizes
   correctly) and be positioned so it establishes its own containing block. */
export const heroParallaxLayerClass = "relative size-full";
