// export type Notification = {
//   id: string;
//   title: string;
//   description?: string;
//   isRead: boolean;
//   time: string;

//   avatar?: string;

//   // ✅ optional template features
//   isFriendRequest?: boolean;

//   textAvatar?: {
//     text: string;
//     variant: string; // e.g. "primary", "danger"
//   };
// };

export enum NotificationType {
  PostLiked = 0,
  PostCommented = 1,
  UserFollowed = 2,
  PageFollowed = 3,
  Mentioned = 4,
  CommentLiked = 5,
  FriendRequest = 6,
}

export interface NotificationActorDto {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface NotificationDto {
  id: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;

  postId?: string | null;
  commentId?: string | null;

  pageId?: string | null;
  pageName?: string | null;

  actor?: NotificationActorDto | null;
}

export interface UnreadNotificationCountDto {
  count: number;
}
