import { useCreateDependency } from "@campus/feature-tasks/data-access";
import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { useRouter } from "@campus/runtime/router";
import { cn } from "@campus/ui/cn";
import { Fade } from "@campus/ui/Fade";
import { Workflow } from "@campus/ui/Icon";
import { Text } from "@campus/ui/Text";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { MouseEventHandler } from "react";
import { useGraphRenderer } from "../hooks/graph-renderer.hook";
import { nodeSize } from "../utils/positioning.utils";
import { getBaseScale } from "../utils/scale.utils";

type TaskNode = Node<{ task: Task; level: number }, "task">;

const displayNodeSize = 200;

export const TaskNode = ({ id, parentId, data }: NodeProps<TaskNode>) => {
  const { params, push } = useRouter();

  const { zoomLevel, getNode } = useGraphRenderer();

  const { mutate: createDependency } = useCreateDependency();

  const relativeSubTaskLevel = zoomLevel - data.level;

  const scale = nodeSize / displayNodeSize / getBaseScale(data.level);

  const handleSize = 15;

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
    <Fade
      style={{
        transformOrigin: "top left",
        transform: `scale(${scale})`,
        width: displayNodeSize,
        height: displayNodeSize,
      }}
      onClick={handleClick}
    >
      <Handle
        id={`${data.task.id}-top`}
        type="target"
        position={Position.Left}
        isConnectable={true}
        onConnect={(params) => {
          createDependency({
            upstreamId: params.target,
            downstreamId: params.source,
          });
        }}
        style={{
          width: handleSize,
          height: handleSize,
          minWidth: handleSize,
          minHeight: handleSize,
        }}
      />
      <Handle
        id={`${data.task.id}-bottom`}
        type="source"
        position={Position.Right}
        isConnectable={true}
        onConnect={(params) => {
          createDependency({
            upstreamId: params.target,
            downstreamId: params.source,
          });
        }}
        style={{
          width: handleSize,
          height: handleSize,
          minWidth: handleSize,
          minHeight: handleSize,
        }}
      />
      <div
        className={cn(
          "flex flex-col gap-2 rounded-xl border-gray-700 w-full h-full border-8 p-2",
          params.taskId === data.task.id && "border-white"
        )}
        style={{
          backgroundColor: getStatusColor(data.task),
        }}
      >
        <Text
          className={cn(
            `text-wrap transition-opacity duration-500 origin-top-left`,
            relativeSubTaskLevel < 1 && "opacity-0"
          )}
        >
          {data.task.name}
        </Text>

        {data.task.subtasks.length > 0 && (
          <div
            className={cn(
              `flex flex-row items-center gap-1 transition-opacity duration-500 origin-top-left`,
              relativeSubTaskLevel < 1 && "opacity-0"
            )}
          >
            <Workflow size={16} />

            <Text className={cn(`text-wrap`)}>
              {
                data.task.subtasks.filter((task) => task.status === "Done")
                  .length
              }
              {"/"}
              {data.task.subtasks.length}
            </Text>
          </div>
        )}
      </div>
    </Fade>
  );
};
