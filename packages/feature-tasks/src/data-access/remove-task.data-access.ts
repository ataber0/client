import { useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";

export const useRemoveTask = () => {
  const { delete: httpDelete } = useHttpClient();

  return useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      await httpDelete(`/api/tasks/${taskId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey?.[0] === "tasks",
      });
    },
  });
};
