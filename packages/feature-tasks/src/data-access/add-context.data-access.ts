import { HttpRequestBody, useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";

export const useAddContext = () => {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: async ({ file, taskId }: { file: File; taskId?: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (taskId) {
        formData.append("taskId", taskId);
      }
      return post("/api/context/", formData as unknown as HttpRequestBody, {
        useRawBody: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("context");
        },
      });
    },
  });
};
