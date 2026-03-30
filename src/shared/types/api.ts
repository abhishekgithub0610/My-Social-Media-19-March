export type ApiResponse<T> = {
  isSuccess: boolean;
  message: string | null;
  errors: ApiError[]; // ✅ fixed
  hasErrors: boolean;
  result: T;
};

export type ApiError = {
  code: string;
  message: string;
};
