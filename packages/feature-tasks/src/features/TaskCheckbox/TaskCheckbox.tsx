import { Checkbox } from "@campus/ui/Checkbox";
import { useUpdateTask } from "../../data-access/update-task.data-access";
import { TaskBase } from "../../types/task.models";

interface TaskCheckboxProps {
  task: TaskBase;
  className?: string;
}

export const TaskCheckbox = ({ task, className }: TaskCheckboxProps) => {
  const { mutate: updateTask } = useUpdateTask(task.id);

  return (
    <Checkbox
      className={className}
      checked={task.status === "Done"}
      onChange={() =>
        updateTask({ status: task.status === "Done" ? "Todo" : "Done" })
      }
      onClick={(e) => e.stopPropagation()}
    />
  );
};
