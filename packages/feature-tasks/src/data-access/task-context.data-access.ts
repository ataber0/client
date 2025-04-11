import { useHttpQuery } from "@campus/runtime/query";
import { ContextItem } from "../types/context.models";

export const useTaskContext = (taskId: string) => {
  return useHttpQuery<ContextItem[]>({
    queryKeyPrefix: ["context"],
    url: `/api/context/tasks/${taskId}/`,
  });
};
