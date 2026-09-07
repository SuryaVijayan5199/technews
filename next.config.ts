import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  images: {
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
    formats: ["image/avif", "image/webp"],
    qualities: [50, 75, 90, 100],
  },

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
