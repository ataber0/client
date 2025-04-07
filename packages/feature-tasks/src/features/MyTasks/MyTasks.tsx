import { cn } from "@campus/ui/cn";
import { Text } from "@campus/ui/Text";
import { TaskList } from "../../components/TaskList/TaskList";
import { useMyTasks } from "../../data-access/my-tasks.data-access";
import { CreateTaskModalButton } from "../CreateTask/CreateTask";

export interface MyTasksProps {
  className?: string;
}

export const MyTasks = ({ className }: MyTasksProps) => {
  const { activeTasks, projects } = useMyTasks();

  if (!activeTasks) return null;

  return (
    <div className={cn("p-2", className)}>
      <div className="flex items-center justify-between">
        <Text as="h2">Active Tasks</Text>

        <CreateTaskModalButton />
      </div>

      {activeTasks && <TaskList tasks={activeTasks} />}

      <Text as="h2" className="p-2">
        Projects
      </Text>

      {projects && <TaskList tasks={projects} />}
    </div>
  );
};
