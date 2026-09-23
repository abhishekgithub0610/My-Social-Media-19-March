import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../services/accountApi";
import { useRouter } from "next/navigation";
import { baseClient } from "@/shared/api/baseClient";
import { useAuthStore } from "../store/authStore";
import { ApiResponse } from "@/shared/types/api";
import { UserResult } from "../types/account";
import { getMyInterests } from "@/features/interests/services/interestApi";
import { useState } from "react";
import { isAxiosError } from "axios";

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

    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        console.error(
          "Registration failed:",
          error.response?.data ?? error.message,
        );
        return;
      }

      console.error("Registration failed:", error);
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
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const [redirectError, setRedirectError] = useState<Error | null>(null);
  const [isCheckingInterests, setIsCheckingInterests] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginApi,

    onSuccess: async (data) => {
      setRedirectError(null);

      const user = data?.result;

      if (!user?.accessToken) {
        setRedirectError(
          new Error("Login response is missing account information."),
        );
        return;
      }

      // Store the token first. baseClient needs it for the protected
      // GET /interests/me request.
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

      setIsCheckingInterests(true);

      try {
        // Prevent a previous account's cached status being used.
        queryClient.removeQueries({
          queryKey: ["interests", "me"],
        });

        const response = await getMyInterests();
        const status = response.result;

        if (!status) {
          throw new Error("Interest status is missing from the response.");
        }

        queryClient.setQueryData(["interests", "me"], response);

        router.replace(status.isCompleted ? "/feed" : "/interests");
      } catch (error) {
        console.error("Could not check interest status:", error);

        // Don't assume onboarding is complete when this request fails.
        setRedirectError(
          new Error(
            "Login succeeded, but we couldn't load your interests. Please try again.",
          ),
        );
      } finally {
        setIsCheckingInterests(false);
      }
    },

    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return {
    ...loginMutation,
    error: redirectError ?? loginMutation.error,
    isPending: loginMutation.isPending || isCheckingInterests,
  };
};

// export const useLogin = () => {
//   const router = useRouter();
//   const setUser = useAuthStore((state) => state.setUser);

//   return useMutation({
//     mutationFn: loginApi,

//     onSuccess: (data) => {
//       if (!data?.result) {
//         console.error("Login response missing result");
//         return;
//       }
//       const user = data.result;

//       if (!user) {
//         console.error("User not found in response");
//         return;
//       }

//       setUser(
//         {
//           id: user.id,
//           email: user.email,
//           role: user.role,
//           name: user.name,
//           avatar: user.avatar,
//         },
//         user.accessToken,
//       );

//       const state = useAuthStore.getState();

//       setTimeout(() => {
//         router.push("/feed");
//       }, 0);
//     },

//     onError: (error: any) => {
//       console.error("Login failed:", error?.response?.data || error);
//     },
//   });
// };
