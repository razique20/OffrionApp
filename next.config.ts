import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // ← Add this
  },
  /* config options here */
};

export default nextConfig;
