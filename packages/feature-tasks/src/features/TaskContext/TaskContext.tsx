import { cn } from "@campus/ui/cn";
import { Text } from "@campus/ui/Text";
import {
  ContextModalButton,
  ContextModalButtonProps,
} from "../../components/ContextModalButton/ContextModalButton";
import { useTaskContext } from "../../data-access/task-context.data-access";
import { AddContext } from "../AddContext/AddContext";

export type TaskContextModalButtonProps = Omit<
  ContextModalButtonProps,
  "context"
> & {
  taskId: string;
};

export const TaskContext = ({
  taskId,
  className,
  ...props
}: TaskContextModalButtonProps) => {
  const { data } = useTaskContext(taskId);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn("flex items-center")}>
        <Text className="text-sm">Context</Text>

        {data && data?.length > 0 && (
          <ContextModalButton
            className="ml-auto text-xs"
            variant="text"
            context={data ?? []}
            title="Task Context"
            {...props}
          >
            Manage {data?.length ?? ""} Item(s)
          </ContextModalButton>
        )}
      </div>

      <AddContext taskId={taskId} />
    </div>
  );
};
