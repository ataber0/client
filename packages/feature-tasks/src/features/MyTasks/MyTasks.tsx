import { cn } from "@campus/ui/cn";
import { TaskList } from "../../components/TaskList/TaskList";
import { useMyTasks } from "../../data-access/my-tasks.data-access";

export interface MyTasksProps {
  className?: string;
}

export const MyTasks = ({ className }: MyTasksProps) => {
  const { data } = useMyTasks();

  return (
    <div className={cn(className)}>{data && <TaskList tasks={data} />}</div>
  );
};
