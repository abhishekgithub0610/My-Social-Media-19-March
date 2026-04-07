export interface Post {
  id: string;
  content: string;
  authorId: string;
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
  media?: MediaDto[]; // ✅ FIX
  // mediaUrl?: string;
  // mediaType?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  user: FeedUserDto;
}

export interface PagedResult<T> {
  items: T[];
  hasMore: boolean;
}

export interface ApiResponseResult<T> {
  success: boolean;
  result: T;
}
