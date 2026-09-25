import { isAxiosError } from "axios";

export const getErrorMessage = (err: unknown): string => {
  if (isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message || err.message;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Something went wrong ❌";
};
