export type UserActivitySummary = {
  totalActivities: number;
  activeDays: number;
  postsCreated: number;
  commentsCreated: number;
  postsLiked: number;
  commentsLiked: number;
  pagesFollowed: number;
  invalidEvents: number;
  activityBreakdown: string | null;
};
