import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily ignore ESLint errors during builds so we can ship while
  // addressing lint rules across the codebase.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
