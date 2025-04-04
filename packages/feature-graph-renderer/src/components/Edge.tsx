import { cn } from "@campus/ui/cn";
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

  return (
    <BaseEdge
      path={edgePath}
      className={cn(
        "opacity-10 transition-opacity duration-600",
        zoomLevel === 0 && data?.level === 0 && "opacity-60",
        zoomLevel - 1 === data?.level && "opacity-60"
      )}
      style={{
        stroke: data?.color,
        strokeWidth: 10 / zoom,
      }}
    />
  );
};
