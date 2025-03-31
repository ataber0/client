import { Checkbox } from "@campus/ui/Checkbox";
import { cn } from "@campus/ui/cn";
import { ChevronRight } from "@campus/ui/Icon";
import { Link } from "@campus/ui/Link";
import { Text } from "@campus/ui/Text";
import { ReactNode } from "react";
import { useCompleteTask } from "../../data-access/complete-task.data-access";
import { Task } from "../../types/task.models";

export interface TaskListProps {
  tasks: Task[];
  header?: ({ task, index }: { task: Task; index: number }) => ReactNode;
  className?: string;
}

export const TaskList = ({ tasks, header, className }: TaskListProps) => {
  return (
    <div className={cn(className)}>
      {tasks.map((task, index) => (
        <TaskListItem key={task.id} task={task} index={index} header={header} />
      ))}
    </div>
  );
};

interface TaskListItemProps {
  task: Task;
  index: number;
  header?: ({ task, index }: { task: Task; index: number }) => ReactNode;
}

const TaskListItem = ({ task, index, header }: TaskListItemProps) => {
  const { mutate: completeTask } = useCompleteTask();

  return (
    <Link
      key={task.id}
      href={`/tasks/${task.id}`}
      className="flex flex-row items-center p-4 border-b border-gray-900"
    >
      <Checkbox
        className="mr-3"
        color="#FF4F00"
        value={task.status === "Done"}
        onChange={() => completeTask(task.id)}
        onClick={(e) => e.stopPropagation()}
      />

      {header?.({ task, index }) || (
        <div className="flex-1">
          <Text className="font-semibold">{task.name}</Text>

          {task.dependents.length > 0 && (
            <Text className="text-xs text-gray-500">
              {task.dependents.length} dependent tasks
            </Text>
          )}
        </div>
      )}

      <ChevronRight className="text-primary ml-auto" size={24} />
    </Link>
  );
};
