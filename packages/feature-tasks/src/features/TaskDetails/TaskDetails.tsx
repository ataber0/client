import { useRouter } from "@campus/runtime/router";
import { Button } from "@campus/ui/Button";
import { ChevronLeft, Edit, Link2Off, Trash } from "@campus/ui/Icon";
import { Link } from "@campus/ui/Link";
import { Modal } from "@campus/ui/Modal";
import { Text } from "@campus/ui/Text";
import { useState } from "react";
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
  const { data } = useTaskDetails(taskId);

  const router = useRouter();

  const { mutateAsync: removeTask } = useRemoveTask();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveTask = async () => {
    await removeTask({ taskId });
    router.push("/");
  };

  const { mutateAsync: removeDependency } = useRemoveDependency();

  return data ? (
    <>
      <div className="flex flex-col gap-6 p-2">
        <div className="flex flex-row items-center gap-2">
          <Link href="/" className="flex flex-row items-center gap-2">
            <ChevronLeft size={16} />

            <Text className="text-sm">Active Tasks</Text>
          </Link>

          <Button
            className="ml-auto"
            variant="text"
            onClick={() => setIsModalOpen(true)}
          >
            <Edit size={16} />
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

        {!data.parent && (
          <>
            <hr className="border-gray-600" />

            <RelationshipTaskList
              tasks={data.subtasks}
              header="Sub Tasks"
              initialPayload={{
                parentId: data.id,
              }}
              onRemoveRelationship={(subtask) =>
                removeTask({ taskId: subtask.id })
              }
            />
          </>
        )}

        <hr className="border-gray-600" />

        <RelationshipTaskList
          tasks={data.dependencies}
          header="Prerequisites"
          initialPayload={{
            parentId: data.parent?.id,
            downstreamId: data.id,
          }}
          onRemoveRelationship={(dependency) =>
            removeDependency({
              upstreamId: data.id,
              downstreamId: dependency.id,
            })
          }
        />

        <hr className="border-gray-600" />

        <RelationshipTaskList
          tasks={data.dependents}
          header="Next Tasks"
          initialPayload={{
            parentId: data.parent?.id,
            upstreamId: data.id,
          }}
          onRemoveRelationship={(dependency) =>
            removeDependency({
              upstreamId: dependency.id,
              downstreamId: data.id,
            })
          }
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
  initialPayload,
  onRemoveRelationship,
}: {
  tasks: TaskBase[];
  header: string;
  initialPayload: Partial<CreateTaskPayload>;
  onRemoveRelationship: (dependency: TaskBase) => void;
}) => {
  const uncompletedTasks = tasks.filter((task) => task.status !== "Done");

  const completedCount = tasks.length - uncompletedTasks.length;

  const [showCompleted, setShowCompleted] = useState(false);

  const displayTasks = showCompleted ? tasks : uncompletedTasks;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Text className="pl-2 text-sm text-gray-400">{header}</Text>

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

      {displayTasks.map((childTask) => (
        <Link
          href={`/tasks/${childTask.id}`}
          className="flex gap-3 items-center"
        >
          <TaskCheckbox task={childTask} />

          <Text className="text-xs">{childTask.name}</Text>

          <Button
            className="ml-auto shrink-0"
            variant="text"
            color="danger"
            onClick={(e) => {
              e.preventDefault();
              onRemoveRelationship(childTask);
            }}
          >
            <Link2Off size={16} />
          </Button>
        </Link>
      ))}
    </div>
  );
};
