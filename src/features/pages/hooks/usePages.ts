import { useMutation } from "@tanstack/react-query";
import { createPageApi } from "../services/pagesApi";

export const useCreatePage = () => {
  return useMutation({
    mutationFn: createPageApi,
  });
};
