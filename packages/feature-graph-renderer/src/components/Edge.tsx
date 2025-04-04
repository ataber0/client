import { BaseEdge, Edge, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { useGraphRenderer } from "../hooks/graph-renderer.hook";
type TaskEdge = Edge<{ color: string; level: number }, "taskEdge">;

export const TaskEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<TaskEdge>) => {
  const { zoom, zoomLevel } = useGraphRenderer();

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 40,
  });

  return zoomLevel - 1 === data?.level ? (
    <BaseEdge
      path={edgePath}
      style={{
        opacity: 0.5,
        stroke: data?.color,
        strokeWidth: 10 / zoom,
      }}
    />
  ) : null;
};
