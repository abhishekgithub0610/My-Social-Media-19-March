import { baseClient } from "@/shared/api/baseClient";
import { RegisterRequest } from "../types/account";

export const registerUser = async (data: RegisterRequest) => {
  const response = await baseClient.post("/auth/register", data);
  return response.data;
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
