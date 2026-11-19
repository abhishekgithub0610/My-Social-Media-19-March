import { baseClient } from "@/shared/api/baseClient";
import { RegisterRequest } from "../types/account";

export const registerUser = async (data: RegisterRequest) => {
  console.log("--> Register Request Sent:", data);

  try {
    const response = await baseClient.post("/auth/register", data);
    
    console.log("<-- Register Response Received:", response.data);
    return response.data;
  } catch (error) {
    console.error("X-- Register Error:", error);
    throw error;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await baseClient.post("/auth/login", data);
  return response.data;
};

export const refreshTokenApi = async () => {
  const response = await baseClient.post(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
    },
  );

  return response.data.data;
};
