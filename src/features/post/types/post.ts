import { CommentType } from "@/types/data";

export interface Post {
  id: string;
  content: string;
  authorId: string;
}
export interface FeedPageDto {
  name: string;
  avatar: string;
  id: string;
}
export interface FeedUserDto {
  name: string;
  avatar: string;
  id: string;
}

export interface MediaDto {
  url: string;
  type: string;
}

export interface PostFeedDto {
  id: string;
  content: string;
  media?: MediaDto[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  user: FeedUserDto;
  pageDetails: FeedPageDto;
  isLikedByCurrentUser?: boolean;
  isLiked?: boolean;
  comments?: CommentType[];
}

export interface PagedResult<T> {
  items: T[];
  hasMore: boolean;
}
