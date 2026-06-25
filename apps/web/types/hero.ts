/** Raw "project" (Hero) entry fields, as Contentful's Delivery API returns them. */
export interface RawHeroFields {
  title: string;
  description: string;
  resume: string;
}

/** Hero content as the UI consumes it — the clean frontend entity. */
export interface Hero {
  title: string;
  description: string;
  resumeUrl: string;
}
