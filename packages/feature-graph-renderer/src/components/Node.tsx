import { useCreateDependency } from "@campus/feature-tasks/data-access";
import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { useRouter } from "@campus/runtime/router";
import { cn } from "@campus/ui/cn";
import { Text } from "@campus/ui/Text";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useGraphRenderer } from "../hooks/graph-renderer.hook";

type TaskNode = Node<{ task: Task; level: number }, "task">;

export const TaskNode = ({ data }: NodeProps<TaskNode>) => {
  const { params } = useRouter();

  const { zoomLevel } = useGraphRenderer();

  const { mutate: createDependency } = useCreateDependency();

  const relativeSubTaskLevel = zoomLevel - data.level;

  const scale = 1 / (Math.pow(5, data.level) || 1);

  console.log(data.level, scale);

  const handleSize = 25 * scale;

  return (
    <div
      className={cn(
        "transition-opacity duration-300",
        relativeSubTaskLevel > 1 && "opacity-20",
        ((relativeSubTaskLevel < 1 && data.task.parent) ||
          relativeSubTaskLevel > 2) &&
          "opacity-0"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={true}
        style={{
          width: handleSize,
          height: handleSize,
          minWidth: handleSize,
          minHeight: handleSize,
          outlineWidth: "1px",
        }}
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
        style={{
          width: handleSize,
          height: handleSize,
          minWidth: handleSize,
          minHeight: handleSize,
          outlineWidth: "1px",
        }}
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
            relativeSubTaskLevel < 1 && "opacity-0"
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
