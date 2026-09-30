import { baseClient } from "@/shared/api/baseClient";
import type { ApiResponse } from "@/shared/types/api";
import type { InsightsDashboard, InsightsPeriod } from "../types/insights";

export const getMyInsights = async (
  period: InsightsPeriod,
): Promise<InsightsDashboard> => {
  const response = await baseClient.get<ApiResponse<InsightsDashboard>>(
    "/analytics/me/overview",
    { params: { period } },
  );

  if (!response.data.isSuccess || !response.data.result) {
    throw new Error(response.data.message || "Unable to load insights.");
  }

  return response.data.result;
};
