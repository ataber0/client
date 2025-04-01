import { useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";
import { UpdateTaskPayload } from "../types/task.models";

export const useUpdateTask = (taskId: string) => {
  const { put } = useHttpClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) =>
      put(`/api/tasks/${taskId}/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("tasks");
        },
      });
    },
  });
};
