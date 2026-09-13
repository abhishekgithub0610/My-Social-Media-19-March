import { baseClient } from "@/shared/api/baseClient";
import { BuddyType } from "@/shared/types/BuddyType";
import { ApiResponse } from "@/shared/types/api";

export const getBuddies = async (): Promise<BuddyType[]> => {
  const res = await baseClient.get<ApiResponse<BuddyType[]>>("/buddies");

  if (!res.data.isSuccess || !res.data.result) {
    return [];
  }

  return res.data.result;
};

export const getBuddyById = async (id: string): Promise<BuddyType> => {
  const res = await baseClient.get<ApiResponse<BuddyType>>(`/buddies/${id}`);
  return res.data.result;
};

export const updateBuddyApi = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const response = await baseClient.put(`/buddies/${id}`, formData);
  return response.data.data;
};

export const getFollowingBuddies = async (): Promise<BuddyType[]> => {
  const res =
    await baseClient.get<ApiResponse<BuddyType[]>>("/buddies/following");
  return res.data.result || [];
};

export const getSuggestedBuddies = async (): Promise<BuddyType[]> => {
  const res = await baseClient.get<ApiResponse<BuddyType[]>>(
    "/buddies/suggestions",
  );

  return res.data.result || [];
};
