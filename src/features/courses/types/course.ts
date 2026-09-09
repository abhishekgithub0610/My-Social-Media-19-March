export type Course = {
  id: number;
  name: string;
  followers: number;
  avatarUrl?: string;
  category?: string;
};

export type CreateCourseFormValues = {
  courseImage?: File | null; // ✅ FIX
  courseName: string;
  displayName: string;

  email?: string | null;
  url?: string | null;
  phoneNo?: number | null;

  aboutPage: string;
  category: string;
  type: string[]; // ✅ ADD THIS
};
