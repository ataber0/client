import { cn } from "@campus/ui/cn";
import { Link } from "@campus/ui/Link";
import { Text } from "@campus/ui/Text";
import { ReactNode } from "react";
import { TaskCheckbox } from "../../features/TaskCheckbox/TaskCheckbox";
import { TaskBase } from "../../types/task.models";

export interface TaskListProps {
  tasks: TaskBase[];
  header?: ({ task, index }: { task: TaskBase; index: number }) => ReactNode;
  actions?: ({ task, index }: { task: TaskBase; index: number }) => ReactNode;
  className?: string;
}

export const TaskList = ({
  tasks,
  header,
  actions,
  className,
}: TaskListProps) => {
  return (
    <div className={cn(className)}>
      {tasks.map((task, index) => (
        <TaskListItem
          key={task.id}
          task={task}
          index={index}
          header={header}
          actions={actions}
        />
      ))}
    </div>
  );
};

interface TaskListItemProps {
  task: TaskBase;
  index: number;
  header?: ({ task, index }: { task: TaskBase; index: number }) => ReactNode;
  actions?: ({ task, index }: { task: TaskBase; index: number }) => ReactNode;
}

const TaskListItem = ({ task, index, header, actions }: TaskListItemProps) => {
  return (
    <Link
      key={task.id}
      href={`/tasks/${task.id}`}
      className="flex flex-row items-center py-2 min-h-[2.5rem]"
    >
      <TaskCheckbox task={task} className="mr-3" />

      {header?.({ task, index }) || (
        <div className="flex-1">
          <Text className="font-semibold text-xs">{task.name}</Text>
        </div>
      )}

      {actions && (
        <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
          {actions({ task, index })}
        </div>
      )}
    </Link>
  );
};
