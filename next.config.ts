import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"], // ✅ SIMPLE + RELIABLE
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig; // ✅ IMPORTANT

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "7120",
//         pathname: "/**",
//       },
//     ],
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "7120",
//         pathname: "/**",
//       },
//     ],
//   },
//   typescript: {
//     ignoreBuildErrors: true, // 👈 ADD THIS
//   },
// };

// module.exports = nextConfig;

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
