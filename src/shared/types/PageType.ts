export type PageType = {
  id: string;
  pageName: string;
  displayName: string;
  category?: string;
  aboutPage: string;
  pageImageUrl?: string;
  pageType?: string | number | null;
  types?: string[];
  isFollowing: boolean;
  email: string;
  url: string;
  phoneNo: number;
  isOwner: boolean;
  isFeatured?: boolean;
};
