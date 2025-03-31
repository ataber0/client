import { getStatus } from "@campus/feature-tasks/utils";
import { Line } from "react-konva";
import { Edge as EdgeType } from "../types/graph.models";

export interface EdgeProps {
  edge: EdgeType;
}

export const Edge = ({ edge }: EdgeProps) => {
  const gradientOffset = 0.5;

  const gradientMap = {
    Done: "#4CAF50", // Green for completed tasks
    Active: "#FF4F00", // Primary for active tasks
    Blocked: "#9E9E9E", // Gray for blocked tasks
  };

  const gradient = {
    from: gradientMap[getStatus(edge.from.task)],
    to: gradientMap[getStatus(edge.to.task)],
  };

  return (
    <Line
      points={[
        edge.from.position.x,
        edge.from.position.y,
        edge.to.position.x,
        edge.to.position.y,
      ]}
      strokeLinearGradientStartPoint={{
        x: edge.from.position.x,
        y: edge.from.position.y,
      }}
      strokeLinearGradientEndPoint={{
        x: edge.to.position.x,
        y: edge.to.position.y,
      }}
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
