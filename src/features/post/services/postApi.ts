import {
  ApiResponseResult,
  PagedResult,
  PostFeedDto,
} from "@/features/post/types/post";
import { baseClient } from "@/shared/api/baseClient";

export const getFeed = async (
  page: number = 1,
  pageSize: number = 10,
): Promise<ApiResponseResult<PagedResult<PostFeedDto>>> => {
  const response = await baseClient.get(
    `/posts/feed?page=${page}&pageSize=${pageSize}`,
  );

  return response.data;
};

// export const getFeed = async (
//   page: number = 1,
//   pageSize: number = 10,
// ): Promise<ApiResponseResult<PagedResult<PostFeedDto>>> => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/posts/feed?page=${page}&pageSize=${pageSize}`,
//     {
//       credentials: "include",
//     },
//   );

//   if (!res.ok) throw new Error("Failed to fetch feed");

//   return await res.json();
// };

export const getUserFeed = async (
  userId: string,
  page: number = 1,
  pageSize: number = 5,
): Promise<ApiResponseResult<PagedResult<PostFeedDto>>> => {
  const response = await baseClient.get(
    `/posts/user-feed?userId=${userId}&page=${page}&pageSize=${pageSize}`,
  );

  return response.data;
};

export const toggleCommentLike = async (commentId: string) => {
  const response = await baseClient.post(
    `/posts/toggle-like?commentId=${commentId}`,
  );

  return response.data;
};
