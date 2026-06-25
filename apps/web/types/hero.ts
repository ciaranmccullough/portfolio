/** A run of the hero title. Runs flagged `highlight` render in the brand accent
 *  colour (the violet words in the design); the rest render normally. */
export interface TitleSegment {
  text: string;
  highlight: boolean;
}

/** Hero content as the UI consumes it — the clean frontend entity. */
export interface Hero {
  /** The title split into display runs, so highlighted words can be styled. */
  title: TitleSegment[];
  description: string;
  resumeUrl: string;
}
