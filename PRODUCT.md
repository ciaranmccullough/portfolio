# Product

## Register

brand

## Users

Recruiters, hiring managers, and engineering peers evaluating Ciaran McCullough (frontend engineer, London, 5+ years). They arrive cold — from a CV link, LinkedIn, or a shared URL — skim in under two minutes, and are deciding one thing: is this person's craft real? Case-study readers (the /story pages) are the engaged subset who clicked through and will actually read.

## Product Purpose

A personal portfolio that is itself the proof of work: the site demonstrates the "speed, precision and craft" the hero copy claims. It showcases shipped projects (EA Sports App, Racenet, etc.) as case-study stories backed by Contentful, so content updates never need a deploy. Success = a visitor leaves convinced of senior-level frontend craft and gets in touch.

## Brand Personality

Precise, crafted, confident. Neo-brutalist-lite: warm paper ground, a committed violet accent, hard offset shadows, mono uppercase labels used as a deliberate system. Engineering as the aesthetic — nothing decorative that couldn't be defended in a design review.

## Anti-references

The attached design documents ("Component Library" and the story-page exports) are the canonical visual reference; drifting from that language is the primary failure mode. Beyond that: generic template portfolios (interchangeable Dribbble/Notion-theme portfolios with no identifiable authorship), and anything that undermines the "engineer who designs" positioning — stock-photo corporate blandness or style-over-substance agency showreels.

## Design Principles

1. **The site is the résumé.** Every interaction is evidence of craft; a visual bug is a professional claim falsified.
2. **Design-doc fidelity.** The Figma-exported Component Library is the source of truth for tokens, components, and layout; new surfaces extend it rather than inventing parallel systems.
3. **Content lives in the CMS.** Copy and case-study substance come from Contentful; components stay generic and typed against real data.
4. **Motion is scroll-driven and earned.** Animations scrub with the reader's own scroll, never autoplay; every effect has a reduced-motion and no-JS fallback that stands on its own.
5. **Committed, not loud.** One violet, one paper, hard shadows used sparingly — confidence through restraint applied consistently, not through spectacle.

## Accessibility & Inclusion

WCAG 2.1 AA: ≥4.5:1 body text contrast (the token set ships -deep accent variants for text on tints for exactly this), full keyboard operability, visible focus, semantic HTML enforced in the component library, `prefers-reduced-motion` honored on every animation, and meaningful alt text on case-study imagery.
