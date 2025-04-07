import { Task } from "../types/task.models";

const isBlocked = (task: Task) => {
  return (
    task.dependencies.filter((dependency) => dependency.status !== "Done")
      .length > 0
  );
};

export const isActive = (task: Task) => {
  return (
    task.status === "Todo" &&
    !isBlocked(task) &&
    task.subtasks.filter((subtask) => subtask.status !== "Done").length === 0
  );
};

export const getStatus = (task: Task) => {
  if (task.status === "Done") return "Done";
  if (isActive(task)) return "Active";
  return "Blocked";
};

export const getStatusColor = (task: Task) => {
  if (task.status === "Done") return "green";
  if (isBlocked(task)) return "gray";
  return "darkorange";
};

export const isProject = (task: Task) => {
  return task.parent === null && task.subtasks.length > 0;
};
