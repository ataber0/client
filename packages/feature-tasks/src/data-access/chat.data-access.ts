import { HttpRequestBody, useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";

export interface ChatPayload extends HttpRequestBody {
  message: string;
}

export type ChatResponse = HttpRequestBody & TaskCommand;

export interface TaskCommand {
  actions: TaskAction[];
}

export interface TaskAction {
  type: "add_task";
  data: unknown;
}

export const useChat = () => {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: (payload: ChatPayload) =>
      post<ChatResponse>("/api/tasks/chat/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("tasks");
        },
      });
    },
  });
};
