"use client";

import { useAuthInit } from "@/features/account/hooks/useAuthInit";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthInit(); // ✅ now valid (client side)

  return <>{children}</>;
}
