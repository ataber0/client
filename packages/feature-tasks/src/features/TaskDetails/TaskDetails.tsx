import { ChevronLeft } from "@campus/ui/Icon";
import { Link } from "@campus/ui/Link";
import { Text } from "@campus/ui/Text";
import { TaskList } from "../../components/TaskList/TaskList";
import { useTaskDetails } from "../../data-access/task-details.data-access";

export interface TaskDetailsProps {
  taskId: string;
}

export const TaskDetails = ({ taskId }: TaskDetailsProps) => {
  const { data } = useTaskDetails(taskId);

  return data ? (
    <div className="p-2">
      <div className="flex flex-row items-center gap-2">
        <Link href="/">
          <ChevronLeft />
        </Link>

        <Text>{data.name}</Text>
      </div>

      <Text className="p-4">{data.description}</Text>

      {data.dependencies.length > 0 && (
        <>
          <Text className="p-4">Blocked By</Text>

          <TaskList
            tasks={data.dependencies}
            header={({ task }) => <Text className="text-sm">{task.name}</Text>}
          />
        </>
      )}

      {data.dependents.length > 0 && (
        <>
          <Text className="p-4">Is Blocking</Text>

          <TaskList
            tasks={data.dependents}
            header={({ task }) => <Text className="text-sm">{task.name}</Text>}
          />
        </>
      )}
    </div>
  ) : null;
};
