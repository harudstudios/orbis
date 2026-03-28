import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@convex": path.resolve(__dirname, "convex"),
    },
  },
  webpack: (config) => {
    config.resolve.alias["@convex"] = path.resolve(__dirname, "convex");
    return config;
  },
};

export default nextConfig;
