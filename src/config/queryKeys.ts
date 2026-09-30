export const queryKeys = {
  pages: ["pages"],
  page: (id: string) => ["pages", id],
  userStats: (id: string) => ["users", id, "stats"],
  insights: (period: string) => ["analytics", "me", "overview", period],
  myActivity: (startDate: string, endDate: string) => [
    "analytics",
    "me",
    "activity",
    startDate,
    endDate,
  ],
};
