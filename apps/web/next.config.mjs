import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // $HOME contains stray lockfiles, so Next mis-infers the workspace root.
  // Pin it to this monorepo so Turbopack / file-tracing resolves correctly.
  turbopack: {
    root: path.join(import.meta.dirname, "..", ".."),
  },
};

export default nextConfig;
