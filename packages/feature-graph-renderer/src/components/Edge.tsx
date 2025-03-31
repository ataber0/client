import { Line } from "react-konva";
import { Edge as EdgeType } from "../types/graph.models";

export interface EdgeProps {
  edge: EdgeType;
}

export const Edge = ({ edge }: EdgeProps) => {
  const gradientOffset = 0.5;

  const startX =
    edge.from.position.x +
    (edge.to.position.x - edge.from.position.x) * gradientOffset;
  const startY =
    edge.from.position.y +
    (edge.to.position.y - edge.from.position.y) * gradientOffset;
  const endX =
    edge.from.position.x +
    (edge.to.position.x - edge.from.position.x) * ((gradientOffset + 0.9) % 1);
  const endY =
    edge.from.position.y +
    (edge.to.position.y - edge.from.position.y) * ((gradientOffset + 0.9) % 1);

  const gradient =
    edge.from.status === "Done" || edge.to.status === "Done"
      ? { from: "#666666", to: "#888888" } // Gray gradient for edges involving completed tasks
      : { from: "#FF6B9C", to: "#FF8E9E" }; // Pink gradient for active edges

  return (
    <Line
      points={[
        edge.from.position.x,
        edge.from.position.y,
        edge.to.position.x,
        edge.to.position.y,
      ]}
      strokeLinearGradientStartPoint={{ x: startX, y: startY }}
      strokeLinearGradientEndPoint={{ x: endX, y: endY }}
      strokeLinearGradientColorStops={[
        0,
        gradient.from,
        0.2,
        gradient.from,
        0.8,
        gradient.to,
        1,
        gradient.to,
      ]}
      strokeWidth={4}
      opacity={0.9}
      lineCap="round"
      lineJoin="round"
      shadowColor={gradient.to}
      shadowBlur={12}
      shadowOpacity={0.3}
      globalCompositeOperation="lighter"
    />
  );
};
