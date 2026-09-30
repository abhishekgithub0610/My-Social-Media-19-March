export type InsightsPeriod = "7d" | "30d" | "90d";

export type InsightsPageMetric = {
  id: string;
  name: string;
  followers: number;
  engagementRate: number;
  reach: number;
};

export type InsightsDashboard = {
  period: InsightsPeriod;
  followers: {
    total: number;
    changePercent: number;
    trend: number[];
  };
  engagement: {
    rate: number;
    changePoints: number;
    trend: number[];
  };
  reach: {
    total: number;
    changePercent: number;
    trend: number[];
  };
  pageCount: number;
  audienceActivity: {
    mostActiveTime: string;
    topDay: string;
    byDay: { day: string; value: number }[];
  };
  pages: InsightsPageMetric[];
};