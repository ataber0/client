import { useCreateDependency } from "@campus/feature-tasks/data-access";
import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { useRouter } from "@campus/runtime/router";
import { cn } from "@campus/ui/cn";
import { Text } from "@campus/ui/Text";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { MouseEventHandler } from "react";
import { useGraphRenderer } from "../hooks/graph-renderer.hook";
import { nodeSize } from "../utils/positioning.utils";

type TaskNode = Node<{ task: Task; level: number }, "task">;

export const TaskNode = ({ id, parentId, data }: NodeProps<TaskNode>) => {
  const { params, push } = useRouter();

  const { zoomLevel, getNode } = useGraphRenderer();

  const { mutate: createDependency } = useCreateDependency();

  const relativeSubTaskLevel = zoomLevel - data.level;

  const scale = 1 / (Math.pow(5, data.level) || 1);

  const handleSize = nodeSize * 0.1 * scale;

  const shouldHide =
    (relativeSubTaskLevel < 1 && data.task.parent) || relativeSubTaskLevel > 2;

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    let selectedNode: { id: string; parentId?: string; data: { task: Task } } =
      {
        id,
        parentId,
        data,
      };
    while (selectedNode.parentId) {
      const parent = getNode(selectedNode.parentId);
      if (parent && parent.data.level >= zoomLevel - 1) {
        selectedNode = parent;
      } else {
        break;
      }
    }

    if (params.taskId === selectedNode.id) {
      if (selectedNode.data.task.subtasks?.length > 0) {
        push(`/tasks/${selectedNode.data.task.subtasks[0].id}`);
      }
    } else {
      push(`/tasks/${selectedNode.id}`);
    }
  };

  return (
    <div
      className={cn(
        "transition-opacity duration-500",
        relativeSubTaskLevel > 1 && "opacity-20",
        shouldHide && "opacity-0"
      )}
      onClick={handleClick}
    >
      <Handle
        id={`${data.task.id}-top`}
        type="target"
        position={Position.Left}
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
        id={`${data.task.id}-bottom`}
        type="source"
        position={Position.Right}
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
          gap: nodeSize * 0.12 * scale,
        }}
      >
        <Text
          className={cn(
            `text-wrap text-center transition-opacity duration-500`,
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

        {data.task.subtasks.length > 0 && (
          <Text
            className={cn(
              `text-[0.6rem] text-wrap text-center transition-opacity duration-500`,
              relativeSubTaskLevel < 1 && "opacity-0"
            )}
            style={{
              transform: `scale(${nodeSize * 0.005 * scale})`,
              width: `calc(100% / ${nodeSize * 0.004 * scale})`,
            }}
          >
            {data.task.subtasks.filter((task) => task.status === "Done").length}
            {"/"}
            {data.task.subtasks.length} Sub Tasks Complete
          </Text>
        )}
      </div>
    </div>
  );
};
