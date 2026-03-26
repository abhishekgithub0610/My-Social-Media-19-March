export type Page = {
  id: number;
  name: string;
  followers: number;
  avatarUrl?: string;
  category?: string;
};

export type CreatePageFormValues = {
  pageImage: File;
  pageName: string;
  displayName: string;

  email?: string | null;
  url?: string | null;
  phoneNo?: number | null;

  aboutPage: string;
  category: string;
  type: string[]; // ✅ ADD THIS
};
