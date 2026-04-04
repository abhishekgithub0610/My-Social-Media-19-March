"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { DEFAULT_PAGE_TITLE } from "@/shared/constants/appConstants";
import { NotificationProvider } from "@/context/useNotificationContext";
// import { ChatProvider } from "@/context/useChatContext";

import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";

const LayoutProvider = dynamic(
  () => import("@/context/useLayoutContext").then((mod) => mod.LayoutProvider),
  { ssr: false },
);

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
            {children}
            <ToastContainer theme="colored" />
          </NotificationProvider>
          {/* </ChatProvider> */}
        </LayoutProvider>
      </QueryProvider>
    </AuthProvider>
  );
};

export default AppProvidersWrapper;

// "use client";
// import { SessionProvider } from "next-auth/react";
// import dynamic from "next/dynamic";
// import { useEffect } from "react";
// import { ToastContainer } from "react-toastify";
// import { DEFAULT_PAGE_TITLE } from "@/context/constants";
// import { NotificationProvider } from "@/context/useNotificationContext";
// import type { ChildrenType } from "@/types/component";
// import { ChatProvider } from "@/context/useChatContext";
// import AuthProvider from "@/providers/AuthProvider"; // ✅ add AuthProvider here
// import Navbar from "@/shared/components/layout/Navbar"; // ✅ add Navbar
// import Footer from "@/shared/components/layout/footer";

// const LayoutProvider = dynamic(
//   () => import("@/context/useLayoutContext").then((mod) => mod.LayoutProvider),
//   { ssr: false },
// );

// const AppProvidersWrapper = ({ children }: ChildrenType) => {
//   useEffect(() => {
//     const handleChangeTitle = () => {
//       if (document.visibilityState === "hidden")
//         document.title = "Please come back 🥺";
//       else document.title = DEFAULT_PAGE_TITLE;
//     };
//     document.addEventListener("visibilitychange", handleChangeTitle);
//     return () =>
//       document.removeEventListener("visibilitychange", handleChangeTitle);
//   }, []);
//   return (
//     <SessionProvider>
//       <LayoutProvider>
//         <ChatProvider>
//           <NotificationProvider>
//             <AuthProvider>
//               <Navbar /> {/* ✅ Navbar is always visible */}
//               {children}
//               <Footer /> {/* ✅ Footer is always visible */}
//               <ToastContainer theme="colored" />
//             </AuthProvider>
//           </NotificationProvider>
//         </ChatProvider>
//       </LayoutProvider>
//     </SessionProvider>
//   );
// };

// export default AppProvidersWrapper;
