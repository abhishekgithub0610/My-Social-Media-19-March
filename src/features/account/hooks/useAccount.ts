import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/accountApi";
import { useRouter } from "next/navigation";
import { baseClient } from "@/shared/api/baseClient";
import { useAuthStore } from "../store/authStore";
import { ApiResponse } from "@/shared/types/api";
import { UserResult } from "../types/account";

type LoginRequest = {
  email: string;
  password: string;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration success:", data);
    },

    onError: (error: any) => {
      console.error("Registration failed:", error?.response?.data || error);
    },
  });
};

export const loginApi = async (
  data: LoginRequest,
): Promise<ApiResponse<UserResult>> => {
  const response = await baseClient.post<ApiResponse<UserResult>>(
    "/auth/login",
    data,
    { withCredentials: true },
  );

  return response.data;
};
export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      if (!data?.result) {
        console.error("Login response missing result");
        return;
      }
      const user = data.result;

      if (!user) {
        console.error("User not found in response");
        return;
      }

      setUser(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
        },
        user.accessToken,
      );

      const state = useAuthStore.getState();

      setTimeout(() => {
        router.push("/feed");
      }, 0);
    },

    onError: (error: any) => {
      console.error("Login failed:", error?.response?.data || error);
    },
  });
};
