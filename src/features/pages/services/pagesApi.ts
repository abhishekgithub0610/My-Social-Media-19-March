import { baseClient } from "@/shared/api/baseClient";

export const createPageApi = async (formData: FormData) => {
  const response = await baseClient.post("/pages", formData);

  return response.data;
};
