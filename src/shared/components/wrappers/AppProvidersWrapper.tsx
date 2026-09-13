"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { DEFAULT_PAGE_TITLE } from "@/shared/constants/appConstants";
import { NotificationProvider } from "@/context/useNotificationContext";
import { usePathname } from "next/navigation";
// import { ChatProvider } from "@/context/useChatContext";

import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import { useLayoutContext } from "@/context/useLayoutContext";
import ImageViewerProvider from "../ui/image-viewer/ImageViewerProvider";

const LayoutProvider = dynamic(
  () => import("@/context/useLayoutContext").then((mod) => mod.LayoutProvider),
  { ssr: false },
);
const InnerWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { closeAllOffcanvas } = useLayoutContext(); // ✅ use context

  useEffect(() => {
    closeAllOffcanvas(); // ✅ CLOSE on route change
  }, [pathname]);

  return <>{children}</>;
};

const AppProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
  const handleChangeTitle = () => {
    if (document.visibilityState === "hidden")
      document.title = "Please come back 🥺";
    else document.title = DEFAULT_PAGE_TITLE;
  };

  useEffect(() => {
    const splashElement = document.querySelector("#__next_splash");
    const splashScreen = document.querySelector("#splash-screen");

    if (!splashElement || !splashScreen) return;

    const observer = new MutationObserver(() => {
      if (splashElement.hasChildNodes()) {
        splashScreen.classList.add("remove");
      }
    });

    observer.observe(splashElement, { childList: true, subtree: true });

    document.addEventListener("visibilitychange", handleChangeTitle);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleChangeTitle);
    };
  }, []);

  return (
    <AuthProvider>
      <QueryProvider>
        <LayoutProvider>
          {/* <ChatProvider> */}
          <NotificationProvider>
            <InnerWrapper>{children}</InnerWrapper>
            <ToastContainer theme="colored" />
          </NotificationProvider>
          {/* </ChatProvider> */}
        </LayoutProvider>
      </QueryProvider>
    </AuthProvider>
  );
};

export default AppProvidersWrapper;
