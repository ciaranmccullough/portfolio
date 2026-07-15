import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // External cover images for the WorkGrid projects, served through next/image.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "easa-web.easports.ea.com" },
      { protocol: "https", hostname: "ecdn.codemasters.com" },
      { protocol: "https", hostname: "images.ctfassets.net" },
    ],
  },
  // $HOME contains stray lockfiles, so Next mis-infers the workspace root.
  // Pin it to this monorepo so Turbopack / file-tracing resolves correctly.
  turbopack: {
    root: path.join(import.meta.dirname, "..", ".."),
  },
  // First-party proxy for Mixpanel ingestion (see lib/analytics/mixpanel.ts).
  // Requests to mixpanel.com are made `withCredentials`, so any cookie on
  // that domain (e.g. `mp_user`) rides along as a third-party cookie —
  // Chrome flags it and it fails Lighthouse's Best Practices audits. Routing
  // ingestion through our own origin keeps everything first-party (and past
  // ad-blockers). Geo enrichment still works: the proxy forwards
  // `x-forwarded-for`, which Mixpanel resolves instead of the connecting IP.
  async rewrites() {
    return [
      {
        source: "/mp/:path*",
        destination: "https://api-eu.mixpanel.com/:path*",
      },
    ];
  },
};

export default nextConfig;
