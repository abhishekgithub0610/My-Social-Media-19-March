import { baseClient } from "@/shared/api/baseClient";
import { BuddyType } from "@/shared/types/BuddyType";
import { ApiResponse } from "@/shared/types/api";

// export const createPageApi = async (formData: FormData) => {
//   const response = await baseClient.post("/pages", formData);
//   return response.data.data;
//   //return response.data;
// };

export const getBuddies = async (): Promise<BuddyType[]> => {
  const res = await baseClient.get<ApiResponse<BuddyType[]>>("/buddies");

  if (!res.data.isSuccess || !res.data.result) {
    return [];
  }

  return res.data.result;
};

// export const getPageById = (id: string) => {
//   return baseClient.get<PageType>(`/pages/${id}`);
// };

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
