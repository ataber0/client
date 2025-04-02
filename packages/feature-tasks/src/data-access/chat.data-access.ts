import { HttpRequestBody, useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";

export interface ChatPayload extends HttpRequestBody {
  userInput: string;
}

export interface ChatResponse extends HttpRequestBody {
  message: {
    id: string;
    content: string;
  };
  userInput: string;
  taskCommand: TaskCommand;
}

export interface TaskCommand {
  id: string;
  actions: TaskAction[];
}

export interface TaskAction {
  actionType: "add_task";
  actionData: unknown;
}

export const useChat = () => {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: (payload: ChatPayload) =>
      post<ChatResponse>("/api/reasoning/chat/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("tasks");
        },
      });
    },
  });
};
