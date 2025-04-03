import { useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";
import { CreateDependencyPayload } from "../types/task.models";

export const useCreateDependency = () => {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: (payload: CreateDependencyPayload) =>
      post(`/api/tasks/dependencies/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("tasks");
        },
      });
    },
  });
};
