import { getStatus } from "@campus/feature-tasks/utils";
import { useRouter } from "@campus/runtime/router";
import { Circle } from "react-konva";
import { Node as NodeType } from "../types/graph.models";
export interface NodeProps {
  node: NodeType;
}

export const Node = ({ node }: NodeProps) => {
  const router = useRouter();
  const isSelected = router.params.taskId === node.id;

  const gradient = {
    Done: { from: "#4CAF50", to: "#66BB6A" }, // Green gradient for completed tasks
    Active: { from: "#FF4F00", to: "darkorange" }, // Primary gradient for active tasks
    Blocked: { from: "#9E9E9E", to: "#BDBDBD" }, // Gray gradient for blocked tasks
  }[getStatus(node.task)];

  return (
    <Circle
      key={node.id}
      x={node.position.x}
      y={node.position.y}
      radius={35}
      fillLinearGradientStartPoint={{ x: -35, y: -35 }}
      fillLinearGradientEndPoint={{ x: 35, y: 35 }}
      fillLinearGradientColorStops={[0, gradient.from, 1, gradient.to]}
      opacity={1}
      shadowColor={gradient.to}
      shadowBlur={15}
      shadowOpacity={0.4}
      shadowOffset={{ x: 0, y: 0 }}
      stroke={isSelected ? "#FFFFFF" : undefined}
      strokeWidth={isSelected ? 10 : 0}
      onClick={() => {
        router.push("/tasks/" + node.id);
      }}
    />
  );
};
