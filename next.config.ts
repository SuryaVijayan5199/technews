import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Skip ESLint and TypeScript during build to speed up deployment times
  // These should be checked locally or in a separate CI step
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable source maps in production to save build time and memory
  productionBrowserSourceMaps: false,

  // React Compiler (stable in Next.js 16)
  reactCompiler: false,

  // Experimental features
  experimental: {
    // Turbopack filesystem caching for faster dev restarts
    turbopackFileSystemCacheForDev: true,
    // Server Actions
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
