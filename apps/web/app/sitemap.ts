import type { MetadataRoute } from "next";

import { SITE_URL } from "@/site-config";

/** Generates /sitemap.xml. Single-page site, so one canonical entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
