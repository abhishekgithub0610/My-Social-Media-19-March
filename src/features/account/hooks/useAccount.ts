import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/accountApi";
import { useRouter } from "next/navigation";
import { baseClient } from "@/shared/api/baseClient";
import { useAuthStore } from "../store/authStore";
import { ApiResponse } from "@/shared/types/api";
import { UserResult } from "../types/account";

// ✅ Type added (fix for your error)
type LoginRequest = {
  email: string;
  password: string;
};

// ✅ REGISTER
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
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
// export const loginApi = async (
//   data: LoginRequest,
// ): Promise<ApiResponse<LoginResponse>> => {
//   const response = await baseClient.post("/auth/login", data, {
//     withCredentials: true,
//   });

//   return response.data;
// };
// export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
//   const response = await baseClient.post("/auth/login", data, {
//     withCredentials: true, // ✅ IMPORTANT (for cookies)
//   });

//   //return response.data.data; // based on your ApiResponseResult
//   return response.data.data ?? response.data; //return response.data.data; // based on your ApiResponseResult
// };

// ✅ LOGIN
export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      if (!data.result) return; // safety

      const user = data.result;

      if (!user) {
        console.error("User not found in response");
        return;
      }
      console.log("login token :", user.accessToken); // 👈 ADD THIS

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
      // setUser(
      //   {
      //     id: data.result.result.id,
      //     email: data.result.result.email,
      //     role: data.result.result.role,
      //     name: data.result.result.name,
      //     avatar: data.result.result.avatar,
      //   },
      //   data.result.result.accessToken, // token separate
      // );

      // // onSuccess: (data) => {
      // //   setUser(
      // //     {
      // //       id: data.id,
      // //       email: data.email,
      // //       role: data.role,
      // //       name: data.name, // optional
      // //       avatar: data.avatar, // optional
      // //     },
      // //     data.accessToken, // ✅ token separate
      // //   );
      // //   console.log("LOGIN RESPONSE:", data); // 👈 ADD THIS
      // ✅ CHECK Zustand state immediately
      const state = useAuthStore.getState();

      console.log("Zustand AFTER setUser:", {
        user: state.user,
        accessToken: state.accessToken,
      });
      setTimeout(() => {
        router.push("/feed");
      }, 0);
    },
    // // onSuccess: (data) => {
    // //   // ✅ store in Zustand (NOT localStorage)
    // //   setUser({
    // //     id: data.id,
    // //     email: data.email,
    // //     role: data.role,
    // //     accessToken: data.accessToken,
    // //   });

    // //   router.push("/feed");
    // // },

    onError: (error) => {
      console.error("Login failed", error);
    },
  });
};
// export const useLogin = () => {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: (data: LoginRequest) => loginUser(data),

//     onSuccess: (data) => {
//       // ⚠️ TEMP: localStorage (we'll improve later)
//       localStorage.setItem("token", data.token);

//       router.push("/feed");
//     },

//     onError: (error) => {
//       console.error("Login failed", error);
//     },
//   });
// };
