"use client"; // ✅ ADD THIS
import { useEffect } from "react";
import { refreshTokenApi } from "../services/accountApi";
import { useAuthStore } from "../store/authStore";

export const useAuthInit = () => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await refreshTokenApi();
        setUser(
          {
            id: res.user.id,
            email: res.user.email,
            role: res.user.role,
            name: res.user.name,
            avatar: res.user.avatar,
          },
          res.accessToken,
        );
        // // setUser({
        // //   id: res.user.id,
        // //   email: res.user.email,
        // //   role: res.user.role,
        // //   accessToken: res.accessToken,
        // // });
      } catch {
        // not logged in → ignore
      }
    };

    initAuth();
  }, [setUser]);
};
