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

  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={true} />
      <Handle type="source" position={Position.Bottom} isConnectable={true} />
      <div
        className={cn(
          "flex items-center justify-center p-6 rounded-xl border-4 border-gray-500",
          params.taskId === data.task.id && "border-white border-8"
        )}
        style={{
          backgroundColor: getStatusColor(data.task),
          width: "200px",
          height: "200px",
        }}
      >
        <Text
          className={cn(
            "text-2xl text-wrap text-center transition-opacity duration-300",
            zoom < 0.2 && "opacity-0"
          )}
        >
          {data.task.name}
        </Text>
      </div>
    </>
  );
};
