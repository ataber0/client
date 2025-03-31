import { HttpRequestBody, useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";

export interface ChatPayload extends HttpRequestBody {
  message: string;
}

export type ChatResponse = HttpRequestBody & TaskCommand;

export interface TaskCommand {
  id: string;
  actions: TaskAction[];
  llmMessage: string;
  userInput: string;
}

export interface TaskAction {
  actionType: "add_task";
  actionData: unknown;
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
