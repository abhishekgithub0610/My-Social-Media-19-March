import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/queryKeys";
import { getUserStats } from "@/features/users/services/userApi";

export const useUserStats = (userId?: string) =>
  useQuery({
    queryKey: queryKeys.userStats(userId ?? ""),
    queryFn: () => getUserStats(userId!),
    enabled: Boolean(userId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });