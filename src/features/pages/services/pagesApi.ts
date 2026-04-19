import { useAuthStore } from "@/features/account/store/authStore";
import { baseClient } from "@/shared/api/baseClient";
import { PageType } from "@/shared/types/PageType";
import { ApiResponse } from "@/shared/types/api";

export const createPageApi = async (formData: FormData) => {
  const response = await baseClient.post("/pages", formData);
  return response.data.data;
  //return response.data;
};

export const getPages = async (): Promise<PageType[]> => {
  const state = useAuthStore.getState();

  const res = await baseClient.get<ApiResponse<PageType[]>>("/pages");

  if (!res.data.isSuccess || !res.data.result) {
    return [];
  }

  return res.data.result;
};

// export const getPageById = (id: string) => {
//   return baseClient.get<PageType>(`/pages/${id}`);
// };

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
