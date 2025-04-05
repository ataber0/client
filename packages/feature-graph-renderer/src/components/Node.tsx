import { useCreateDependency } from "@campus/feature-tasks/data-access";
import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { useRouter } from "@campus/runtime/router";
import { cn } from "@campus/ui/cn";
import { Text } from "@campus/ui/Text";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useGraphRenderer } from "../hooks/graph-renderer.hook";
import { nodeSize } from "../utils/positioning.utils";

type TaskNode = Node<{ task: Task; level: number }, "task">;

export const TaskNode = ({ data }: NodeProps<TaskNode>) => {
  const { params } = useRouter();

  const { zoomLevel } = useGraphRenderer();

  const { mutate: createDependency } = useCreateDependency();

  const relativeSubTaskLevel = zoomLevel - data.level;

  const scale = 1 / (Math.pow(5, data.level) || 1);

  const handleSize = nodeSize * 0.1 * scale;

  const shouldHide =
    (relativeSubTaskLevel < 1 && data.task.parent) || relativeSubTaskLevel > 2;

  return !shouldHide ? (
    <div
      className={cn(
        "transition-opacity duration-300",
        relativeSubTaskLevel > 1 && "opacity-20"
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
          borderWidth: 50 * scale,
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
          borderWidth: 50 * scale,
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
          width: nodeSize * scale,
          height: nodeSize * scale,
          padding: nodeSize * 0.1 * scale,
          borderWidth: nodeSize * 0.07 * scale,
          borderRadius: nodeSize * 0.07 * scale,
        }}
      >
        <Text
          className={cn(
            `text-xl text-wrap text-center transition-opacity duration-300`,
            relativeSubTaskLevel < 1 && "opacity-0"
          )}
          style={{
            transform: `scale(${nodeSize * 0.005 * scale})`,
            width: `calc(100% / ${nodeSize * 0.004 * scale})`,
            fontSize: "1rem",
            lineHeight: "1.2rem",
          }}
        >
          {data.task.name}
        </Text>
      </div>
    </div>
  ) : null;
};
