import { useRouter } from "@campus/runtime/router";
import { Button } from "@campus/ui/Button";
import { ChevronLeft, Trash } from "@campus/ui/Icon";
import { Link } from "@campus/ui/Link";
import { Text } from "@campus/ui/Text";
import { ReactNode } from "react";
import { TaskCheckbox } from "../../components/TaskCheckbox/TaskCheckbox";
import { TaskList } from "../../components/TaskList/TaskList";
import { useRemoveTask } from "../../data-access/remove-task.data-access";
import { useTaskDetails } from "../../data-access/task-details.data-access";
import { Task } from "../../types/task.models";

export interface TaskDetailsProps {
  taskId: string;
}

export const TaskDetails = ({ taskId }: TaskDetailsProps) => {
  const { data } = useTaskDetails(taskId);

  const router = useRouter();

  const { mutateAsync: removeTask } = useRemoveTask(taskId);

  const handleRemoveTask = async () => {
    await removeTask();
    router.push("/");
  };

  return data ? (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex flex-row items-center gap-2">
        <Link href="/" className="flex flex-row items-center gap-2">
          <ChevronLeft size={16} />

          <Text className="text-sm">All Tasks</Text>
        </Link>

        <Button
          className="ml-auto"
          variant="text"
          color="danger"
          onClick={handleRemoveTask}
        >
          <Trash className="shrink-0" size={16} />
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <TaskCheckbox task={data} />

        <Text>{data.name}</Text>
      </div>

      <Text className="pl-6 text-sm">{data.description}</Text>

      {data.dependencies.length > 0 && (
        <SubTaskList tasks={data.dependencies} header="Blocked By" />
      )}

      {data.dependents.length > 0 && (
        <SubTaskList tasks={data.dependents} header="Is Blocking" />
      )}
    </div>
  ) : null;
};

const SubTaskList = ({
  tasks,
  header,
}: {
  tasks: Task[];
  header: ReactNode;
}) => {
  return (
    <div>
      <Text className="pl-2 text-sm text-gray-400">{header}</Text>

      <TaskList
        tasks={tasks}
        header={({ task }) => <Text className="text-sm">{task.name}</Text>}
      />
    </div>
  );
};
