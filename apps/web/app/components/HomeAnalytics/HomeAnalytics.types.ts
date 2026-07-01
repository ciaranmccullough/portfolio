import type { Feature } from "@/lib/analytics/mixpanel";

export interface HomeSection {
  /** The DOM `id` of the section element on the page. */
  id: string;
  /** The feature name reported in `feature_viewed`. */
  feature: Feature;
}

export interface HomeAnalyticsProps {
  /** The home-page sections to track, in document order. */
  sections: HomeSection[];
}
