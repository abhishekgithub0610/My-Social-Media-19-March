import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "7120",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 ADD THIS
  },
};

module.exports = nextConfig;

// // // const nextConfig: NextConfig = {
// // //   /* config options here */
// // // };
// // const nextConfig: NextConfig = {
// //   images: {
// //     domains: ["localhost"],
// //   },
// // };
// // export default nextConfig;

// // /** @type {import('next').NextConfig} */

// // //module.exports = nextConfig;
