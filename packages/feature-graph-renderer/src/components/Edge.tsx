import { BaseEdge, Position, getSmoothStepPath } from "@xyflow/react";

export interface EdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  data: {
    color: string;
  };
}

export const Edge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 40,
  });

  return (
    <BaseEdge path={edgePath} style={{ stroke: data.color, strokeWidth: 2 }} />
  );
};
