export type BuddyType = {
  id: string;
  buddyName: string;
  displayName: string;
  category?: string;
  aboutBuddy: string;
  buddyImageUrl?: string;
  types: string[];
  isFollowing: boolean;
  email: string;
  url: string;
  phoneNo: number;
  isOwner: boolean;
};
