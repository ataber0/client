import { useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";
import { CreateTaskPayload } from "../types/task.models";

export const useCreateTask = () => {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => post(`/api/tasks/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("tasks");
        },
      });
    },
  });
};
