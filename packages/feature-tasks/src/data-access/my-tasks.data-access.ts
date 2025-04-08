import { useHttpQuery } from "@campus/runtime/query";
import { useMemo } from "react";
import { Task } from "../types/task.models";
import { isActive } from "../utils/task.utils";

const select = (tasks: Task[]) => {
  return tasks.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

export const useMyTasks = () => {
  const query = useHttpQuery<Task[]>({
    queryKeyPrefix: ["tasks"],
    url: "/api/tasks/me",
    select,
  });

  const incompleteTasks = useMemo(() => {
    return query.data?.filter((task) => task.status !== "Done") ?? [];
  }, [query.data]);

  const activeTasks = useMemo(() => {
    return query.data?.filter(isActive) ?? [];
  }, [query.data]);

  return { ...query, activeTasks, incompleteTasks };
};
