import { AxiosError } from "axios";

export const getErrorMessage = (err: AxiosError<{ message?: string }>) =>
  err.response?.data?.message || "Something went wrong ❌";

// export const getErrorMessage = (error: any) => {
//   return error?.message || "Something went wrong";
// };
