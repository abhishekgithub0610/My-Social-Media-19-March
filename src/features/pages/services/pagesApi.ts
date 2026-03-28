import { baseClient } from "@/shared/api/baseClient";

export const createPageApi = async (formData: FormData) => {
  const response = await baseClient.post("/pages", formData);
  return response.data;
};

export const getPages = async () => {
  const res = await baseClient.get("/pages");
  return res.data;
};
