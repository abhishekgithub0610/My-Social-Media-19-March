import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/queryKeys";
import { getMyInsights } from "../services/insightsApi";
import type { InsightsPeriod } from "../types/insights";

export const useMyInsights = (period: InsightsPeriod) =>
  useQuery({
    queryKey: queryKeys.insights(period),
    queryFn: () => getMyInsights(period),
    staleTime: 60_000,
    retry: false,
  });