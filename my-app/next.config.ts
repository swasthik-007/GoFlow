import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React's Strict Mode for development
  experimental: {
    esmExternals: true, // Ensure that Next.js can handle ECMAScript Modules properly
    // turbo:false,
  },
  images: {
    domains: ["lh3.googleusercontent.com"], // Configure image domains if necessary
  },
  webpack(config) {
    // Custom webpack configuration can go here
    return config;
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
