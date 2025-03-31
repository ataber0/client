import { useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";

export const useCompleteTask = () => {
  const { put } = useHttpClient();

  return useMutation({
    mutationFn: (taskId: string) => put(`/api/tasks/${taskId}/complete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("tasks");
        },
      });
    },
  });
};
