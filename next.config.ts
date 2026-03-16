import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/log-in",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;