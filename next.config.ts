import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.API_URL || 'https://api.freeagentportal.com/api/v1',
    ENV: process.env.NODE_ENV, 
    ENCRYPTION_KEY: 'asdf234as2342asdf2i;lk342342;$23423',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  // redirect to the /auth route if the user hits the / route
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth",
        permanent: false,
      },
    ];
  } 
};

export default nextConfig;
