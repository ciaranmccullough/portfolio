/** A value tab in the About section: a short title and a supporting line. */
export interface AboutTab {
  title: string;
  description: string;
}

/** About content as the UI consumes it — the clean frontend entity. */
export interface About {
  title: string;
  description: string;
  imageUrl: string;
  tabs: AboutTab[];
}
