import { useRouter } from "@campus/runtime/router";
import { Circle } from "react-konva";
import { Node as NodeType } from "../types/graph.models";

export interface NodeProps {
  node: NodeType;
}

export const Node = ({ node }: NodeProps) => {
  const router = useRouter();

  const gradient =
    node.status === "Done"
      ? { from: "#666666", to: "#888888" } // Gray gradient for completed tasks
      : { from: "#FF6B9C", to: "#FF8E9E" }; // Pink gradient for active tasks

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
      onClick={() => {
        router.push("/tasks/" + node.id);
      }}
    />
  );
};
