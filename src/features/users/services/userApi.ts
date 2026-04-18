"use client";

import { baseClient } from "@/shared/api/baseClient";
import { ApiResponse } from "@/shared/types/api";

export type UserProfileType = {
  id: string;
  fullName: string;
  email: string;
  profilePictureUrl?: string;
  isOwner: boolean;
};

export const getUserById = async (id: string): Promise<UserProfileType> => {
  const res = await baseClient.get<ApiResponse<UserProfileType>>(
    `/users/${id}`,
  );

  return res.data.result;
};
