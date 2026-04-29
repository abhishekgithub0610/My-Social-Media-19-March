export type Buddy = {
  id: number;
  name: string;
  followers: number;
  avatarUrl?: string;
  category?: string;
};

export type CreatePageFormValues = {
  buddyImage?: File | null; // ✅ FIX
  buddyName: string;
  displayName: string;

  email?: string | null;
  url?: string | null;
  phoneNo?: number | null;

  aboutPage: string;
  category: string;
  type: string[]; // ✅ ADD THIS
};
