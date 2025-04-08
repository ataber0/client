import { useRouter } from "@campus/runtime/router";
import { Button } from "@campus/ui/Button";
import { ChevronLeft, Edit, Link2Off, Trash } from "@campus/ui/Icon";
import { Link } from "@campus/ui/Link";
import { Modal } from "@campus/ui/Modal";
import { Text } from "@campus/ui/Text";
import { ReactNode, useState } from "react";
import { TaskList } from "../../components/TaskList/TaskList";
import { useRemoveDependency } from "../../data-access/remove-dependency.data-access";
import { useRemoveTask } from "../../data-access/remove-task.data-access";
import { useTaskDetails } from "../../data-access/task-details.data-access";
import { CreateTaskPayload, TaskBase } from "../../types/task.models";
import { CreateTaskModalButton } from "../CreateTask/CreateTask";
import { EditTask } from "../EditTask/EditTask";
import { TaskCheckbox } from "../TaskCheckbox/TaskCheckbox";

export interface TaskDetailsProps {
  taskId: string;
}

export const TaskDetails = ({ taskId }: TaskDetailsProps) => {
  const { push } = useRouter();

  const { data } = useTaskDetails(taskId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync: removeTask } = useRemoveTask();

  const { mutateAsync: removeDependency } = useRemoveDependency();

  const handleRemoveTask = async () => {
    await removeTask({ taskId });
    push(data?.parent ? `/tasks/${data.parent.id}` : "/");
  };

  return data ? (
    <>
      <div className="flex flex-col gap-6 p-2">
        <div className="flex flex-row items-center gap-2">
          <Link
            href={data.parent ? `/tasks/${data.parent.id}` : "/"}
            className="flex flex-row items-center gap-2"
          >
            <ChevronLeft size={16} className="shrink-0" />

            <Text className="text-sm">
              {data.parent ? data.parent.name : "Active Tasks"}
            </Text>
          </Link>

          <Button
            className="ml-auto"
            variant="text"
            onClick={() => setIsModalOpen(true)}
          >
            <Edit size={16} className="shrink-0" />
          </Button>

          <Button variant="text" color="danger" onClick={handleRemoveTask}>
            <Trash className="shrink-0" size={16} />
          </Button>
        </div>

        <div className="flex gap-3 items-center">
          <TaskCheckbox task={data} />

          <Text>{data.name}</Text>
        </div>

        {data.description && (
          <Text className="pl-8 text-sm">{data.description}</Text>
        )}

        <hr className="border-gray-600" />

        <RelationshipTaskList
          tasks={data.subtasks}
          header="Sub Tasks"
          initialPayload={{
            parentId: data.id,
          }}
          actions={({ task }) => (
            <Button
              variant="text"
              color="danger"
              onClick={() => removeTask({ taskId: task.id })}
            >
              <Trash size={14} />
            </Button>
          )}
        />
        <hr className="border-gray-600" />

        <RelationshipTaskList
          tasks={data.dependencies}
          header="Prerequisites"
          initialPayload={{
            parentId: data.parent?.id,
            downstreamId: data.id,
          }}
          actions={({ task }) => (
            <Button
              variant="text"
              color="danger"
              onClick={() =>
                removeDependency({
                  upstreamId: data.id,
                  downstreamId: task.id,
                })
              }
            >
              <Link2Off size={14} />
            </Button>
          )}
        />

        <hr className="border-gray-600" />

        <RelationshipTaskList
          tasks={data.dependents}
          header="Next Tasks"
          initialPayload={{
            parentId: data.parent?.id,
            upstreamId: data.id,
          }}
          actions={({ task }) => (
            <Button
              variant="text"
              color="danger"
              onClick={() =>
                removeDependency({
                  upstreamId: task.id,
                  downstreamId: data.id,
                })
              }
            >
              <Link2Off size={14} />
            </Button>
          )}
        />

        <hr />
      </div>

      <Modal
        title="Edit Task"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <EditTask taskId={taskId} onComplete={() => setIsModalOpen(false)} />
      </Modal>
    </>
  ) : null;
};

const RelationshipTaskList = ({
  tasks,
  header,
  actions,
  initialPayload,
}: {
  tasks: TaskBase[];
  header: string;
  actions: ({ task, index }: { task: TaskBase; index: number }) => ReactNode;
  initialPayload: Partial<CreateTaskPayload>;
}) => {
  const uncompletedTasks = tasks.filter((task) => task.status !== "Done");

  const completedCount = tasks.length - uncompletedTasks.length;

  const [showCompleted, setShowCompleted] = useState(false);

  const displayTasks = showCompleted ? tasks : uncompletedTasks;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Text className="text-sm text-gray-400">{header}</Text>

        <CreateTaskModalButton key={header} initialPayload={initialPayload} />

        {completedCount > 0 && (
          <Button
            variant="text"
            onClick={() => setShowCompleted(!showCompleted)}
            className="ml-auto text-xs text-gray-400"
          >
            {showCompleted ? "Hide" : "Show"} {completedCount} completed
          </Button>
        )}
      </div>

      <TaskList tasks={displayTasks} actions={actions} className="gap-2" />
    </div>
  );
};
