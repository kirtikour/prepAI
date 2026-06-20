import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false,
  typescript: {
    // Ignore build errors to bypass WASM compiler crashes on this platform
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
