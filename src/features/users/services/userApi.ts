"use client";

import { baseClient } from "@/shared/api/baseClient";
import { ApiResponse } from "@/shared/types/api";
import { UserProfileType } from "../types/user";

export type UpdateUserProfilePayload = {
  fullName: string;
  userNameSlug: string;
  phoneNumber?: string;
  countryCode?: string;
  email?: string;
  dateOfBirth?: string;
  bio?: string;
};

export const getUserById = async (id: string): Promise<UserProfileType> => {
  const res = await baseClient.get<ApiResponse<UserProfileType>>(
    `/users/${id}`,
  );

  return res.data.result;
};

export const updateUserProfile = async (payload: FormData): Promise<string> => {
  const res = await baseClient.put<ApiResponse<string>>(
    "/users/update-profile",
    payload,
  );

  return res.data.result;
};
