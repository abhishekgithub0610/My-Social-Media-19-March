import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageApi, updatePageApi } from "../services/pagesApi";

import { queryKeys } from "@/config/queryKeys";
import { toast } from "react-toastify";

export const useCreatePage = () => {
  const queryClient = useQueryClient(); // ✅ ADD HERE

  return useMutation({
    mutationFn: createPageApi,

    // ✅ THIS IS THE RIGHT PLACE
    onSuccess: () => {
      // use later if you want to update the cache directly instead of invalidating
      // queryClient.setQueryData(queryKeys.pages, (old: any[] = []) => [
      //   newPage,
      //   ...old,
      // ]);
      queryClient.invalidateQueries({ queryKey: queryKeys.pages });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePageApi,

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pages });

      queryClient.invalidateQueries({
        queryKey: queryKeys.page(variables.id),
      });

      //use later if you want to update the cache directly instead of invalidating
      // queryClient.setQueryData(
      //   queryKeys.page(variables.id),
      //   updatedPage
      // );

      toast.success("Page updated successfully 🚀");

      onSuccess?.(updatedPage);
    },
  });
};
