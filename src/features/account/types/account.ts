export interface RegisterRequest {
  email: string;
  userNameSlug: string;
  password: string;
  name: string;
  role?: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type UserResult = {
  id: string;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
  accessToken: string;
  refreshToken?: string | null;
};

export type LoginResponse = {
  errors: string[];
  hasErrors: boolean;
  isSuccess: boolean;
  message: string | null;
  result: UserResult;
};

// // export type LoginResponse = {
// //   id: string;
// //   email: string;
// //   role: string;

// //   // ✅ optional (safe)
// //   name?: string;
// //   avatar?: string;

// //   accessToken: string;
// // };
// // export type LoginResponse = {
// //   id: string;
// //   email: string;
// //   role: string;
// //   accessToken: string;
// // };
