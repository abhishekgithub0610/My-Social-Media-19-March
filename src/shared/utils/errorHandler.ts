import { AxiosError } from "axios";

export const getErrorMessage = (err: AxiosError<{ message?: string }>) =>
  err.response?.data?.message || "Something went wrong ❌";
