// hooks/usePageId.ts
"use client";

import { useParams, useSearchParams } from "next/navigation";

export const usePageId = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  return (params?.pageId as string) || searchParams.get("pageId") || null;
};
