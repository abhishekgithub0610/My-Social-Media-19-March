"use client";

import { useAuthInit } from "@/features/account/hooks/useAuthInit";
import { useAuthStore } from "@/features/account/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //useAuthInit(); // ✅ now valid (client side)

  const isHydrated = useAuthStore((s) => s.isHydrated);

  // ✅ BLOCK app until Zustand is ready
  if (!isHydrated) {
    return null; // OR loader
  }
  return <>{children}</>;
}
