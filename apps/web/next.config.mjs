import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // External cover images for the WorkGrid projects, served through next/image.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "easa-web.easports.ea.com" },
      { protocol: "https", hostname: "ecdn.codemasters.com" },
    ],
  },
  // $HOME contains stray lockfiles, so Next mis-infers the workspace root.
  // Pin it to this monorepo so Turbopack / file-tracing resolves correctly.
  turbopack: {
    root: path.join(import.meta.dirname, "..", ".."),
  },
};

export default nextConfig;
