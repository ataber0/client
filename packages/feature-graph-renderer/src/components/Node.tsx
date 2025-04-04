import { useCreateDependency } from "@campus/feature-tasks/data-access";
import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { useRouter } from "@campus/runtime/router";
import { cn } from "@campus/ui/cn";
import { Text } from "@campus/ui/Text";
import { Handle, Node, NodeProps, Position, useViewport } from "@xyflow/react";

type TaskNode = Node<{ task: Task; level: number }, "task">;

export const TaskNode = ({ data }: NodeProps<TaskNode>) => {
  const { params } = useRouter();

  const { zoom } = useViewport();

  const { mutate: createDependency } = useCreateDependency();

  const subTaskLevel = data.task.parent ? 1 : 0;

  const scale = 1 / (subTaskLevel * 5 || 1);

  const handleSize = 25 * scale;

  return (
    <div
      className={cn(
        "transition-opacity duration-300",
        zoom > 2 &&
          !data.task.parent &&
          data.task.subtasks.length > 0 &&
          "opacity-20",
        zoom <= 2 && data.task.parent && "opacity-0"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={true}
        style={{ width: handleSize, height: handleSize }}
        onConnect={(params) => {
          createDependency({
            upstreamId: params.target,
            downstreamId: params.source,
          });
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={true}
        style={{ width: handleSize, height: handleSize }}
        onConnect={(params) => {
          createDependency({
            upstreamId: params.target,
            downstreamId: params.source,
          });
        }}
      />
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-gray-700",
          params.taskId === data.task.id && "border-white"
        )}
        style={{
          backgroundColor: getStatusColor(data.task),
          width: 200 * scale,
          height: 200 * scale,
          padding: 20 * scale,
          borderWidth: 14 * scale,
          borderRadius: 14 * scale,
        }}
      >
        <Text
          className={cn(
            `text-xl text-wrap text-center transition-opacity duration-300`,
            zoom < 0.3 && "opacity-0"
          )}
          style={{
            fontSize: `${scale}rem`,
            lineHeight: `${scale * 1.2}rem`,
          }}
        >
          {data.task.name}
        </Text>
      </div>
    </div>
  );
};
