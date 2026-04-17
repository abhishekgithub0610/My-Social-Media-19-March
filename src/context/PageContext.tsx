// PageContext.tsx
import { createContext, useContext } from "react";
import { PageType } from "@/shared/types/PageType";

export const PageContext = createContext<PageType | null>(null);

export const usePage = () => useContext(PageContext);
