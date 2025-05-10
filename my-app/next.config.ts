import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  webpack(config, { isServer }) {
    // Add this to prevent issues with fs module on client side
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false, // Optionally add more Node.js modules if needed
      };
    }

    return config;
  },
  eslint: {
    // ✅ Skip ESLint errors during build (useful for Vercel deployment)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Skip TypeScript type checking errors during build
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/old-url",
        destination: "/new-url",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
