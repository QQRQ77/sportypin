import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aqmxliazkvtwjmsrkcpa.supabase.co",
        port: "",
        pathname: '/storage/v1/object/public/sportpin/**',
      },
    ],
  },
};

export default nextConfig;
