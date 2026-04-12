import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageApi, updatePageApi } from "../services/pagesApi";

import { queryKeys } from "@/config/queryKeys";

// ✅ CREATE
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

// ✅ UPDATE
export const useUpdatePage = () => {
  const queryClient = useQueryClient(); // ✅ ADD HERE

  return useMutation({
    mutationFn: updatePageApi,

    // ✅ THIS IS THE RIGHT PLACE
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pages });

      // ✅ ALSO invalidate single page (VERY IMPORTANT)
      queryClient.invalidateQueries({
        queryKey: queryKeys.page(variables.id),
      });
      //use later if you want to update the cache directly instead of invalidating
      // queryClient.setQueryData(
      //   queryKeys.page(variables.id),
      //   updatedPage
      // );
    },
  });
};

// export const useCreatePage = () => {
//   return useMutation({
//     mutationFn: createPageApi,
//   });
// };

// // ✅ NEW: UPDATE HOOK
// export const useUpdatePage = () => {
//   return useMutation({
//     mutationFn: updatePageApi,
//   });
// };
