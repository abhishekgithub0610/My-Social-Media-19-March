"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/account/store/authStore";

export const useAuthRedirect = () => {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace("/sign-in"); // ✅ SAFE
    }
  }, [user, isHydrated, router]);
};
