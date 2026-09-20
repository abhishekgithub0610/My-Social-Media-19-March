import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/shared/components/layout/Footer";
import logo from "@/assets/images/tenor-old.gif";
import { DEFAULT_PAGE_TITLE } from "@/shared/constants/appConstants";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/scss/style.scss";
import AppProvidersWrapper from "@/shared/components/wrappers/AppProvidersWrapper";
import GLightboxProvider from "@/providers/GLightboxProvider";
import ImageViewerProvider from "@/shared/components/ui/image-viewer/ImageViewerProvider";

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
      <head>
        <style>{splashScreenStyles}</style>
      </head>

      <body className={inter.className}>
        {/* Splash Screen */}
        <div id="splash-screen">
          <Image
            alt="Logo"
            width={555}
            height={123}
            src={logo}
            style={{ height: "20%", width: "auto" }}
            priority
          />
        </div>

        {/* Loader */}
        <NextTopLoader color="#1c84ee" showSpinner={true} />

        {/* App */}
        <div id="__next_splash">
          <AppProvidersWrapper>
            <GLightboxProvider />
            <ImageViewerProvider>
              {children}
              <Footer />
            </ImageViewerProvider>
          </AppProvidersWrapper>
        </div>
      </body>
    </html>
  );
}
