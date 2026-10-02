import { baseClient } from "@/shared/api/baseClient";
import { PageType } from "@/shared/types/PageType";
import { ApiResponse } from "@/shared/types/api";

export type MyPagesPageResult = {
  items: PageType[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type GetMyPagesParams = {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
};

export type PagePerformancePeriod = "7d" | "30d" | "90d";

export type PagePerformanceMetric = {
  total: number;
  change: number;
};

export type PagePerformance = {
  pageId: string;
  pageName: string;
  period: PagePerformancePeriod;
  posts: PagePerformanceMetric;
  likes: PagePerformanceMetric;
  comments: PagePerformanceMetric;
  followers: PagePerformanceMetric;
  followerTrend: { label: string; total: number }[];
  topPosts: {
    id: string;
    content: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
  }[];
};

export const createPageApi = async (formData: FormData) => {
  const response = await baseClient.post("/pages", formData);
  return response.data.data;
};

export const getPages = async (): Promise<PageType[]> => {
  const res = await baseClient.get<ApiResponse<PageType[]>>("/pages");

  if (!res.data.isSuccess || !res.data.result) {
    return [];
  }

  return res.data.result;
};

export const getMyPages = async (
  params: GetMyPagesParams,
): Promise<MyPagesPageResult> => {
  const res = await baseClient.get<ApiResponse<MyPagesPageResult>>(
    "/pages/mine",
    {
      params,
    },
  );

  if (!res.data.isSuccess || !res.data.result) {
    throw new Error(res.data.message || "Unable to load your pages.");
  }

  return res.data.result;
};

export const getPagePerformance = async (
  id: string,
  period: PagePerformancePeriod,
): Promise<PagePerformance> => {
  const res = await baseClient.get<ApiResponse<PagePerformance>>(
    `/pages/${id}/performance`,
    { params: { period } },
  );

  if (!res.data.isSuccess || !res.data.result) {
    throw new Error(res.data.message || "Unable to load page performance.");
  }

  return res.data.result;
};

export const getPageById = async (id: string): Promise<PageType> => {
  const res = await baseClient.get<ApiResponse<PageType>>(`/pages/${id}`);
  return res.data.result;
};

export const updatePageApi = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const response = await baseClient.put(`/pages/${id}`, formData);
  return response.data.data;
};

export const setPageFeaturedApi = async ({
  id,
  isFeatured,
}: {
  id: string;
  isFeatured: boolean;
}): Promise<void> => {
  await baseClient.put(`/pages/${id}/featured`, { isFeatured });
};

export const getFollowingPages = async (): Promise<PageType[]> => {
  const res = await baseClient.get<ApiResponse<PageType[]>>("/pages/following");

  return res.data.result || [];
};

export const followPage = async (
  pageId: string,
  pageType: number = 1,
): Promise<void> => {
  await baseClient.post(`/pages/${pageId}/follow`, { pageType });
};

export const unfollowPage = async (pageId: string): Promise<void> => {
  await baseClient.delete(`/pages/${pageId}/follow`);
};

export const getSuggestedPages = async (): Promise<PageType[]> => {
  const res =
    await baseClient.get<ApiResponse<PageType[]>>("/pages/suggestions");

  return res.data.result || [];
};
