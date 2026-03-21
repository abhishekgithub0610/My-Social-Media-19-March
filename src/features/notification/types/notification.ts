export type Notification = {
  id: string;
  title: string;
  description?: string;
  isRead: boolean;
  time: string;

  avatar?: string;

  // ✅ optional template features
  isFriendRequest?: boolean;

  textAvatar?: {
    text: string;
    variant: string; // e.g. "primary", "danger"
  };
};
