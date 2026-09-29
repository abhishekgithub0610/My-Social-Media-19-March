import { baseClient } from "@/shared/api/baseClient";
import { PageType } from "@/shared/types/PageType";
import { ApiResponse } from "@/shared/types/api";

export const createPageApi = async (formData: FormData) => {
  const response = await baseClient.post("/pages", formData);
  return response.data.data;
};

export const getPages = async (): Promise<PageType[]> => {
  const res = await baseClient.get<ApiResponse<PageType[]>>("/pages");

  if (!res.data.isSuccess || !res.data.result) {
    return [];
  }

  return res.data.result;
};

export const getPageById = async (id: string): Promise<PageType> => {
  const res = await baseClient.get<ApiResponse<PageType>>(`/pages/${id}`);
  return res.data.result;
};

export const updatePageApi = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const response = await baseClient.put(`/pages/${id}`, formData);
  return response.data.data;
};

export const getFollowingPages = async (): Promise<PageType[]> => {
  const res = await baseClient.get<ApiResponse<PageType[]>>("/pages/following");

  return res.data.result || [];
};

export const followPage = async (pageId: string): Promise<void> => {
  await baseClient.post(`/pages/${pageId}/follow`, { pageType: 0 });
};

export const unfollowPage = async (pageId: string): Promise<void> => {
  await baseClient.delete(`/pages/${pageId}/follow`);
};

export const getSuggestedPages = async (): Promise<PageType[]> => {
  const res =
    await baseClient.get<ApiResponse<PageType[]>>("/pages/suggestions");

  return res.data.result || [];
};
