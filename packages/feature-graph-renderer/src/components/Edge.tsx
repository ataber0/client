import { cn } from "@campus/ui/cn";
import { BaseEdge, Edge, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { useGraphRenderer } from "../hooks/graph-renderer.hook";

type TaskEdge = Edge<
  { color: string; level: number; parentId?: string },
  "taskEdge"
>;

export const TaskEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<TaskEdge>) => {
  const { zoom, zoomLevel, activeTask } = useGraphRenderer();

  const strokeWidth = 10 / zoom;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 40,
  });

  const shouldHide = data?.parentId !== activeTask?.parent?.id;

  return (
    <BaseEdge
      path={edgePath}
      className={cn(
        "opacity-60 transition-opacity duration-600",
        shouldHide && "opacity-0"
      )}
      style={{
        stroke: data?.color,
        strokeWidth,
        transform: `translate(${2 / zoom}px, ${6 / zoom}px)`,
      }}
    />
  );
};
