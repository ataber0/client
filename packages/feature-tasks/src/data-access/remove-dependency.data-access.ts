import { useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";
import { RemoveDependencyPayload } from "../types/task.models";

export const useRemoveDependency = () => {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: (payload: RemoveDependencyPayload) =>
      post(`/api/tasks/remove-dependency/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("tasks");
        },
      });
    },
  });
};
