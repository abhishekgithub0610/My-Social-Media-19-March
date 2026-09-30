import { baseClient } from "@/shared/api/baseClient";
import type { ApiResponse } from "@/shared/types/api";
import type { UserActivitySummary } from "../types/activity";

export const getMyActivity = async (
  startDate: string,
  endDate: string,
): Promise<UserActivitySummary> => {
  const response = await baseClient.get<ApiResponse<UserActivitySummary>>(
    "/analytics/me/activity",
    { params: { startDate, endDate } },
  );

  if (!response.data.isSuccess || !response.data.result) {
    throw new Error(response.data.message || "Unable to load your activity.");
  }

  return response.data.result;
};
