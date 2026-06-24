/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Linting is handled at the workspace level; don't block production builds on it.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
