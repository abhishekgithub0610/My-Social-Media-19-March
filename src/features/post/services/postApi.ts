import {
  ApiResponseResult,
  PagedResult,
  PostFeedDto,
} from "@/features/post/types/post";
import { baseClient } from "@/shared/api/baseClient";

export enum ReportReason {
  Spam = 1,
  Harassment = 2,
  HateSpeech = 3,
  Violence = 4,
  SexualContent = 5,
  Misinformation = 6,
  Other = 7,
}

export const getFeed = async (
  page: number = 1,
  pageSize: number = 10,
  pageId?: string,
): Promise<ApiResponseResult<PagedResult<PostFeedDto>>> => {
  let url = `/posts/feed?page=${page}&pageSize=${pageSize}`;

  if (pageId) {
    url += `&pageId=${pageId}`;
  }

  const response = await baseClient.get(url);

  return response.data;
};

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

export const deletePost = async (postId: string) => {
  const response = await baseClient.delete(`/posts/${postId}`);
  return response.data;
};

export const togglePostLike = async (postId: string) => {
  const response = await baseClient.post(
    `/posts/toggle-post-like?postId=${postId}`,
  );

  return response.data;
};

export const createComment = async (
  postId: string,
  content: string,
  parentCommentId?: string,
) => {
  const response = await baseClient.post(`/posts/comment`, {
    postId,
    content,
    parentCommentId,
  });

  return response.data;
};

export const getPostComments = async (postId: string) => {
  const response = await baseClient.get(`/posts/${postId}/comments`);

  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await baseClient.delete(`/posts/comments/${commentId}`);

  return response.data;
};

export const reportPost = async (
  postId: string,
  reason: ReportReason,
  description?: string,
) => {
  const response = await baseClient.post("/report/post", {
    postId,
    reason,
    description,
  });

  return response.data;
};

export const reportComment = async (
  commentId: string,
  reason: ReportReason,
  description?: string,
) => {
  const response = await baseClient.post("/report/comment", {
    commentId,
    reason,
    description,
  });

  return response.data;
};
