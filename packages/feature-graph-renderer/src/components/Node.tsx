import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { Text } from "@campus/ui/Text";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type TaskNode = Node<{ task: Task }, "task">;

export const TaskNode = ({ data }: NodeProps<TaskNode>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={true} />
      <Handle type="source" position={Position.Bottom} isConnectable={true} />
      <div
        className="flex items-center justify-center p-6 bg-surface rounded-xl"
        style={{
          backgroundColor: getStatusColor(data.task),
          width: "200px",
          height: "200px",
        }}
      >
        <Text className="text-lg text-wrap text-center">{data.task.name}</Text>
      </div>
    </>
  );
};
