import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../services/accountApi";
import { useRouter } from "next/navigation";
import { LoginResponse } from "../types/account";
import { baseClient } from "@/shared/api/baseClient";
import { useAuthStore } from "../store/authStore";

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

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await baseClient.post("/auth/login", data, {
    withCredentials: true, // ✅ IMPORTANT (for cookies)
  });

  //return response.data.data; // based on your ApiResponseResult
  return response.data.data ?? response.data; //return response.data.data; // based on your ApiResponseResult
};

// ✅ LOGIN
export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      // ✅ store in Zustand (NOT localStorage)
      setUser({
        id: data.id,
        email: data.email,
        role: data.role,
        accessToken: data.accessToken,
      });

      router.push("/feed");
    },

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
