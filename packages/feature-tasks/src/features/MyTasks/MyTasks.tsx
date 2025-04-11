import { cn } from "@campus/ui/cn";
import { Text } from "@campus/ui/Text";
import { TaskList } from "../../components/TaskList/TaskList";
import { useMyTasks } from "../../data-access/my-tasks.data-access";
import { AddContext } from "../AddContext/AddContext";
import { CreateTaskModalButton } from "../CreateTask/CreateTask";
import { GlobalContext } from "../GlobalContext/GlobalContext";

export interface MyTasksProps {
  className?: string;
}

export const MyTasks = ({ className }: MyTasksProps) => {
  const { activeTasks } = useMyTasks();

  if (!activeTasks) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <Text as="h2">Active Tasks</Text>

        <CreateTaskModalButton />
      </div>

      {activeTasks && <TaskList tasks={activeTasks} />}

      <div className="flex items-center justify-between">
        <Text as="h2" className="text-sm">
          Context
        </Text>

        <GlobalContext variant="text" className="text-xs" />
      </div>

      <AddContext />
    </div>
  );
};
