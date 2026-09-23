export interface InterestDto {
  id: string;
  name: string;
  slug: string;
}

export interface MyInterestsDto {
  isCompleted: boolean;
  interestIds: string[];
}

export interface SuggestedPageDto {
  id: string;
  displayName: string;
  slug: string;
  category: string;
  pageImageUrl: string;
  isFollowing: boolean;
}

export interface SuggestedPostDto {
  id: string;
  pageId: string;
  pageName: string;
  content: string | null;
  createdAt: string;
  category: string;
}
