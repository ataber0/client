import { useHttpQuery } from "@campus/runtime/query";
import { Task } from "../types/task.models";

export const useTaskDetails = (taskId: string | undefined) => {
  return useHttpQuery<Task>({
    queryKeyPrefix: ["tasks", taskId],
    url: `/api/tasks/${taskId}`,
    enabled: !!taskId,
  });
};
