import { useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";

export const useRemoveContext = () => {
  const { delete: deleteRequest } = useHttpClient();

  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/api/context/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("context");
        },
      });
    },
  });
};
