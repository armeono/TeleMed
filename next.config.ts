import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["uverbfnoyutuywypfscl.supabase.co"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
