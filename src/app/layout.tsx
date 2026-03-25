import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/shared/components/layout/Footer";

import logo from "@/assets/images/logo.svg";
import { DEFAULT_PAGE_TITLE } from "@/shared/constants/appConstants";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/scss/style.scss";
import AppProvidersWrapper from "@/shared/components/wrappers/AppProvidersWrapper";
// const AppProvidersWrapper = dynamic(
//   () => import("@/shared/components/wrappers/AppProvidersWrapper"),
//   { ssr: false },
// );

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Social App",
    default: DEFAULT_PAGE_TITLE,
  },
  description: "Your Social Media App",
};

const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: all 0.7s ease;
}

#splash-screen.remove {
  opacity: 0;
  visibility: hidden;
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>{/* <style>{splashScreenStyles}</style> */}</head>

      <body className={inter.className}>
        {/* Splash Screen */}
        <div id="splash-screen">
          <Image
            alt="Logo"
            width={355}
            height={83}
            src={logo}
            style={{ height: "10%", width: "auto" }}
            priority
          />
        </div>

        {/* Loader */}
        <NextTopLoader color="#1c84ee" showSpinner={false} />

        {/* App */}
        <div id="__next_splash">
          <AppProvidersWrapper>
            {children}
            <Footer />
          </AppProvidersWrapper>
        </div>
      </body>
    </html>
  );
}

// // "use client";
// // import QueryProvider from "@/providers/QueryProvider";
// // import "bootstrap/dist/css/bootstrap.min.css"; // ✅ IMPORTANT
// // import "@/assets/scss/style.scss"; // ✅ from template (adjust path if needed)
// // import AuthProvider from "@/providers/AuthProvider";
// // import Navbar from "@/shared/components/layout/Navbar";

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <html lang="en">
// //       <body>
// //         <AuthProvider>
// //           <QueryProvider>
// //             <Navbar /> {/* ✅ render Navbar here */}
// //             {children}
// //             <Footer />
// //           </QueryProvider>
// //         </AuthProvider>
// //       </body>
// //     </html>
// //   );
// // }

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <html lang="en">
// //       <body>
// //         <QueryProvider>
// //           <AuthProvider>
// //             <Navbar />
// //             {children}
// //           </AuthProvider>
// //         </QueryProvider>
// //       </body>
// //     </html>
// //   );
// // }
// import QueryProvider from "@/providers/QueryProvider";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <QueryProvider>{children}</QueryProvider>
//       </body>
//     </html>
//   );
// }
