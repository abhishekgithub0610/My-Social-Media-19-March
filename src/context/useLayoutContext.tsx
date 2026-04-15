import { createContext, use, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { ChildrenType } from "@/types/component";
import { toggleDocumentAttribute } from "@/utils/layout";
import type {
  DialogControlType,
  LayoutOffcanvasStatesType,
  LayoutState,
  LayoutType,
  ThemeType,
} from "@/context";

const LayoutContext = createContext<LayoutType | undefined>(undefined);

function useLayoutContext() {
  const context = use(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayoutContext must be used within an LayoutProvider");
  }
  return context;
}

const storageThemeKey = "SOCIAL_NEXTJS_THEME_KEY";

const themeAttributeKey = "data-bs-theme";

const LayoutProvider = ({ children }: ChildrenType) => {
  const getSavedTheme = (): LayoutState["theme"] => {
    const foundTheme = localStorage.getItem(storageThemeKey);

    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    if (foundTheme) {
      if (foundTheme === "auto") {
        toggleDocumentAttribute(themeAttributeKey, preferredTheme);
        return preferredTheme;
      }
      toggleDocumentAttribute(themeAttributeKey, foundTheme);
      return foundTheme as ThemeType;
    }
    if (!foundTheme) localStorage.setItem(storageThemeKey, preferredTheme);
    return preferredTheme;
  };

  const INIT_STATE: LayoutState = {
    theme: getSavedTheme(),
  };

  const [settings, setSettings] = useState<LayoutState>(INIT_STATE);

  const [offcanvasStates, setOffcanvasStates] =
    useState<LayoutOffcanvasStatesType>({
      showMobileMenu: false,
      showMessagingOffcanvas: false,
      showStartOffcanvas: false,
    });

  const updateSettings = (_newSettings: Partial<LayoutState>) =>
    setSettings({ ...settings, ..._newSettings });

  const updateTheme = (newTheme: LayoutState["theme"]) => {
    const foundTheme = localStorage.getItem(themeAttributeKey);
    if (foundTheme !== newTheme) {
      toggleDocumentAttribute(themeAttributeKey, newTheme);
      localStorage.setItem(storageThemeKey, newTheme);
      updateSettings({ ...settings, theme: newTheme });
    }
  };

  const toggleMessagingOffcanvas: DialogControlType["toggle"] = () => {
    setOffcanvasStates((prev) => ({
      ...prev,
      showMessagingOffcanvas: !prev.showMessagingOffcanvas,
    }));
    // setOffcanvasStates({
    //   ...offcanvasStates,
    //   showMessagingOffcanvas: !offcanvasStates.showMessagingOffcanvas,
    // });
  };

  const toggleMobileMenu: DialogControlType["toggle"] = () => {
    setOffcanvasStates((prev) => ({
      ...prev,
      showMobileMenu: !prev.showMobileMenu,
    }));
    // setOffcanvasStates({
    //   ...offcanvasStates,
    //   showMobileMenu: !offcanvasStates.showMobileMenu,
    // });
  };
  const toggleStartOffcanvas: DialogControlType["toggle"] = () => {
    setOffcanvasStates((prev) => ({
      ...prev,
      showStartOffcanvas: !prev.showStartOffcanvas,
    }));
    // setOffcanvasStates({
    //   ...offcanvasStates,
    //   showStartOffcanvas: !offcanvasStates.showStartOffcanvas,
    // });
  };
  // ✅ Helper to close all (NEW - useful for navigation handling in components)
  // const closeAllOffcanvas = () => {
  //   setOffcanvasStates({
  //     showMobileMenu: false,
  //     showMessagingOffcanvas: false,
  //     showStartOffcanvas: false,
  //   });
  // };
  const closeAllOffcanvas = () => {
    setOffcanvasStates((prev) => {
      if (
        !prev.showMobileMenu &&
        !prev.showMessagingOffcanvas &&
        !prev.showStartOffcanvas
      ) {
        return prev;
      }

      return {
        showMobileMenu: false,
        showMessagingOffcanvas: false,
        showStartOffcanvas: false,
      };
    });
  };
  const messagingOffcanvas: LayoutType["messagingOffcanvas"] = {
    open: offcanvasStates.showMessagingOffcanvas,
    toggle: toggleMessagingOffcanvas,
  };

  const mobileMenu: LayoutType["mobileMenu"] = {
    open: offcanvasStates.showMobileMenu,
    toggle: toggleMobileMenu,
  };
  // const startOffcanvas: LayoutType["messagingOffcanvas"] = {
  //   open: offcanvasStates.showStartOffcanvas,
  //   toggle: toggleStartOffcanvas,
  // };

  const startOffcanvas: LayoutType["startOffcanvas"] = {
    open: offcanvasStates.showStartOffcanvas,
    toggle: toggleStartOffcanvas,
  };
  // useEffect(() => {
  //   setOffcanvasStates((prev) => {
  //     if (
  //       !prev.showMobileMenu &&
  //       !prev.showMessagingOffcanvas &&
  //       !prev.showStartOffcanvas
  //     ) {
  //       return prev; // ✅ no change → no re-render
  //     }

  //     return {
  //       showMobileMenu: false,
  //       showMessagingOffcanvas: false,
  //       showStartOffcanvas: false,
  //     };
  //   });
  // }, [pathname]);
  return (
    <LayoutContext.Provider
      value={{
        ...settings,
        updateTheme,
        messagingOffcanvas,
        mobileMenu,
        startOffcanvas,
        closeAllOffcanvas, // ✅ NEW: exposed helper
      }}
      //   value={useMemo(
      //     () => ({
      //       ...settings,
      //       updateTheme,
      //       messagingOffcanvas,
      //       mobileMenu,
      //       startOffcanvas,
      //     }),
      //     [settings, offcanvasStates],
      //   )
      // }
    >
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutProvider, useLayoutContext };
