import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["storage.googleapis.com", "cdn.dummyjson.com"],
  },
};

export default nextConfig;
