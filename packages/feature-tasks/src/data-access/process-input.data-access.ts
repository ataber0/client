import { HttpRequestBody, useHttpClient } from "@campus/runtime/http-client";
import { queryClient, useMutation } from "@campus/runtime/query";

export interface TaskActionsPayload extends HttpRequestBody {
  userInput: string;
}

export interface TaskActionsResponse extends HttpRequestBody {
  success: boolean;
  message: string;
  summary: string;
  actions: TaskAction[];
}

export type TaskAction =
  | AddTaskAction
  | AddUpstreamDependencyAction
  | AddDownstreamDependencyAction;

export interface AddTaskAction {
  type: "add_task";
  data: {
    id: string;
    name: string;
    description: string;
  };
}

export interface AddUpstreamDependencyAction {
  type: "add_upstream_dependency";
  data: {
    source_id: string;
    target_id: string;
  };
}

export interface AddDownstreamDependencyAction {
  type: "add_downstream_dependency";
  data: {
    source_id: string;
    target_id: string;
  };
}

export type ConfirmSuggestedTasksPayload = TaskActionsResponse;

export const useTaskActions = () => {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: (payload: TaskActionsPayload) =>
      post<TaskActionsResponse>("/api/tasks/propose-actions/", {
        ...payload,
      }),
  });
};

export const useConfirmTaskActions = () => {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: (payload: ConfirmSuggestedTasksPayload) =>
      post<TaskActionsResponse>("/api/tasks/confirm-actions/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey?.includes("tasks");
        },
      });
    },
  });
};
