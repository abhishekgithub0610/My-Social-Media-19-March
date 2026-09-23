"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getMyInterests } from "@/features/interests/services/interestApi";

interface InterestOnboardingGateProps {
  children: ReactNode;

  // Pass true only after your existing auth store has hydrated
  // and login/refresh has established the authenticated user.
  isAuthenticated: boolean;
  isAuthReady: boolean;
}

export default function InterestOnboardingGate({
  children,
  isAuthenticated,
  isAuthReady,
}: InterestOnboardingGateProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["interests", "me"],
    queryFn: getMyInterests,
    enabled: isAuthReady && isAuthenticated,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const status = data?.result;

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated || !status) {
      return;
    }

    if (!status.isCompleted && pathname !== "/interests") {
      router.replace("/interests");
    }
  }, [isAuthReady, isAuthenticated, status, pathname, router]);

  if (!isAuthReady) {
    return <div className="container py-5">Loading...</div>;
  }

  // Your existing auth gate handles unauthenticated users.
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <div className="container py-5">Loading...</div>;
  }

  if (isError || !status) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          We could not load your account preferences. Please refresh.
        </div>
      </div>
    );
  }

  if (!status.isCompleted && pathname !== "/interests") {
    return <div className="container py-5">Loading...</div>;
  }

  return <>{children}</>;
}
