import type { WorkProject } from "@portfolio/ui";
import Image from "next/image";

/*
 * "Things I've shipped" — the projects rendered in the WorkGrid. Non-locale data
 * (real apps, external links and cover images), so it lives here rather than in
 * the i18n dictionaries. Covers are `next/image` with `fill`, so the WorkGrid's
 * media slot (position:relative, fixed height) crops them to a uniform band.
 */

const coverSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export const projects: WorkProject[] = [
  {
    title: "EA Sports App",
    description:
      "Bringing Fans Closer to Sports. The EA SPORTS™ App offers news, highlights, stats & scores for the world's greatest football leagues. Follow live, predict outcomes and generate rewards.",
    href: "https://easa-web.easports.ea.com/",
    tags: ["Android", "Jetpack Compose", "Kotlin"],
    media: (
      <Image
        src="https://easa-web.easports.ea.com/assets/en-afn6FJ4O.avif"
        alt="EA Sports App"
        fill
        sizes={coverSizes}
        className="object-cover"
      />
    ),
  },
  {
    title: "EA Racenet",
    description:
      "Racenet is EA's Racing companion platform to find and compete in leagues, connect with others, improve on-track performance and enhance your gameplay experience.",
    href: "https://racenet.com/",
    tags: ["React", "React Native", "TypeScript", "JavaScript"],
    media: (
      <Image
        src="https://ecdn.codemasters.com/ecdn/Racenet/PROD/Landing_Page/appscreens_f1.png"
        alt="EA Racenet"
        fill
        sizes={coverSizes}
        className="object-cover"
      />
    ),
  },
];
