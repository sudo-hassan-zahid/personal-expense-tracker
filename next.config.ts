import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress responses (gzip/brotli)
  compress: true,

  // Optimize images for Vercel
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Vercel-optimized standalone output
  output: "standalone",

  // Enable experimental features
  experimental: {
    // Use cache directive support
    useCache: true,
    // Rewrite broad named imports to narrower package paths where supported.
    optimizePackageImports: ["date-fns", "lucide-react"],
  },
};

export default nextConfig;
