import { useHttpQuery } from "@campus/runtime/query";
import { Task } from "../types/task.models";

export const useMyTasks = () => {
  return useHttpQuery<Task[]>({
    queryKeyPrefix: ["tasks"],
    url: "/api/tasks/me",
  });
};
