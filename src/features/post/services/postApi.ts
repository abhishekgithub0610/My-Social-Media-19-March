import {
  ApiResponseResult,
  PagedResult,
  PostFeedDto,
} from "@/features/post/types/post";

export const getFeed = async (
  page: number = 1,
  pageSize: number = 10,
): Promise<ApiResponseResult<PagedResult<PostFeedDto>>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/feed?page=${page}&pageSize=${pageSize}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch feed");

  return await res.json();
};
