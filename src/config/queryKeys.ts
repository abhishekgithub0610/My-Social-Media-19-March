export const queryKeys = {
  pages: ["pages"],
  page: (id: string) => ["pages", id],
  userStats: (id: string) => ["users", id, "stats"],
};
