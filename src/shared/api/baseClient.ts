import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshTokenApi } from "@/features/account/services/accountApi";
import {
  useAuthStore,
  getAccessToken,
} from "@/features/account/store/authStore";

export const baseClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ✅ Attach access token
baseClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();
  // // const { accessToken } = useAuthStore.getState(); // ✅ FIX
  console.log("Attaching token to request:", accessToken);
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

// 🔥 ================= RESPONSE INTERCEPTOR =================

let isRefreshing = false;

// ❌ replace `any[]`
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });

  failedQueue = [];
};
type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};
baseClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(baseClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshTokenApi();
        //const newAccessToken = res.accessToken;
        const newAccessToken = res.result.accessToken;
        const { setUser, user } = useAuthStore.getState();
        if (user) {
          console.log("New access token obtained:", newAccessToken);
          setUser(user, newAccessToken); // ✅ FIXED
        }

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return baseClient(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError, null);

        // // window.location.href = "/sign-in";
        const { clearUser } = useAuthStore.getState();
        clearUser();

        // ❌ DO NOT navigate here

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// import axios from "axios";

// export const baseClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true, // ✅ REQUIRED for cookies
// });

// // 🔥 attach access token automatically
// baseClient.interceptors.request.use((config) => {
//   const user = JSON.parse(
//     typeof window !== "undefined"
//       ? localStorage.getItem("auth-storage") || "null"
//       : "null",
//   );

//   if (user?.state?.user?.accessToken) {
//     config.headers.Authorization = `Bearer ${user.state.user.accessToken}`;
//   }

//   return config;
// });

// import axios from "axios";
// import { env } from "@/config/env";

// export const baseClient = axios.create({
//   baseURL: env.API_BASE_URL,
//   withCredentials: true, // important for cookies/JWT later
// });

// baseClient.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     // global error handling
//     return Promise.reject(error.response?.data || error);
//   },
// );
