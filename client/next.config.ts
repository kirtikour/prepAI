import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignore build errors to bypass WASM compiler crashes on this platform
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
