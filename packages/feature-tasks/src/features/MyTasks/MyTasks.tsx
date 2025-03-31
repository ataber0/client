import { cn } from "@campus/ui/cn";
import { useMemo } from "react";
import { TaskList } from "../../components/TaskList/TaskList";
import { useMyTasks } from "../../data-access/my-tasks.data-access";

export interface MyTasksProps {
  className?: string;
}

export const MyTasks = ({ className }: MyTasksProps) => {
  const { data: tasks } = useMyTasks();

  const activeTasks = useMemo(() => {
    return (
      tasks?.filter(
        (task) =>
          task.status === "Todo" &&
          task.dependencies.filter((dependency) => dependency.status !== "Done")
            .length === 0
      ) ?? []
    );
  }, [tasks]);

  if (!activeTasks) return null;

  return (
    <div className={cn(className)}>
      {activeTasks && <TaskList tasks={activeTasks} />}
    </div>
  );
};
