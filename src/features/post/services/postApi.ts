import { PagedResult, PostFeedDto } from "@/features/post/types/post";
import { baseClient } from "@/shared/api/baseClient";
import { ApiResponseResult } from "@/types/api";
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

export const savePostPreference = async (postId: string): Promise<void> => {
  await baseClient.post(`/posts/${postId}/save`);
};

export const removeSavedPostPreference = async (
  postId: string,
): Promise<void> => {
  await baseClient.delete(`/posts/${postId}/save`);
};

export const hidePostPreference = async (postId: string): Promise<void> => {
  await baseClient.post(`/posts/${postId}/hide`);
};

export const getSavedPosts = async (
  page: number = 1,
  pageSize: number = 10,
): Promise<ApiResponseResult<PagedResult<PostFeedDto>>> => {
  const response = await baseClient.get<
    ApiResponseResult<PagedResult<PostFeedDto>>
  >("/posts/saved", { params: { page, pageSize } });

  return response.data;
};

export const toggleCommentLike = async (commentId: string) => {
  const response = await baseClient.post(
    `/posts/toggle-like?commentId=${commentId}`,
  );

  return response.data;
};

// CHANGED: Always send FormData, including text-only edits.
export const updatePost = async (
  postId: string,
  content: string,
  files?: File[],
) => {
  const formData = new FormData();

  formData.append("content", content);

  files?.forEach((file) => {
    formData.append("files", file);
  });

  // CHANGED: Browser/Axios supplies Content-Type and multipart boundary.
  const response = await baseClient.put(`/posts/${postId}`, formData);

  return response.data;
};

// export const updatePost = async (
//   postId: string,
//   content: string,
//   files?: File[],
// ) => {
//   if (files && files.length > 0) {
//     const formData = new FormData();
//     formData.append("content", content);
//     files.forEach((file) => {
//       formData.append("files", file);
//     });

//     const response = await baseClient.put(`/posts/${postId}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data;
//   }

//   const response = await baseClient.put(`/posts/${postId}`, {
//     content,
//   });

//   return response.data;
// };

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
