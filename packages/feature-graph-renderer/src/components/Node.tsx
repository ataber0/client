import { useCreateDependency } from "@campus/feature-tasks/data-access";
import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { useRouter } from "@campus/runtime/router";
import { cn } from "@campus/ui/cn";
import { Text } from "@campus/ui/Text";
import { Handle, Node, NodeProps, Position, useViewport } from "@xyflow/react";

type TaskNode = Node<{ task: Task }, "task">;

export const TaskNode = ({ data }: NodeProps<TaskNode>) => {
  const { params } = useRouter();

  const { zoom } = useViewport();

  const { mutate: createDependency } = useCreateDependency();

  const handleSize = 25;

  return (
    <>
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
          "flex items-center justify-center p-6 rounded-xl border-[14px] border-gray-700",
          params.taskId === data.task.id && "border-white"
        )}
        style={{
          backgroundColor: getStatusColor(data.task),
          width: "200px",
          height: "200px",
        }}
      >
        <Text
          className={cn(
            "text-xl text-wrap text-center transition-opacity duration-300",
            zoom < 0.3 && "opacity-0"
          )}
        >
          {data.task.name}
        </Text>
      </div>
    </>
  );
};
