export const getErrorMessage = (error: any) => {
  return error?.message || "Something went wrong";
};
