import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/queryKeys";
import { getMyActivity } from "../services/activityApi";

export const useMyActivity = (startDate: string, endDate: string) =>
  useQuery({
    queryKey: queryKeys.myActivity(startDate, endDate),
    queryFn: () => getMyActivity(startDate, endDate),
    staleTime: 60_000,
    retry: false,
  });