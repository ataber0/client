import { useHttpQuery } from "@campus/runtime/query";
import { Task } from "../types/task.models";

const select = (tasks: Task[]) => {
  return tasks.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const useMyTasks = () => {
  return useHttpQuery<Task[]>({
    queryKeyPrefix: ["tasks"],
    url: "/api/tasks/me",
    select,
  });
};
