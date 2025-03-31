import { Task } from "../types/task.models";

export const isActive = (task: Task) => {
  return (
    task.status === "Todo" &&
    task.dependencies.filter((dependency) => dependency.status !== "Done")
      .length === 0
  );
};

export const getStatus = (task: Task) => {
  if (task.status === "Done") return "Done";
  if (isActive(task)) return "Active";
  return "Blocked";
};
