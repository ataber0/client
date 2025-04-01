import {
  BaseEdge,
  Edge,
  EdgeProps,
  getSmoothStepPath,
  useViewport,
} from "@xyflow/react";

type TaskEdge = Edge<{ color: string }, "taskEdge">;

export const TaskEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<TaskEdge>) => {
  const { zoom } = useViewport();

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
    <>
      <BaseEdge
        path={edgePath}
        style={{
          opacity: 0.5,
          stroke: data?.color,
          strokeWidth: 10 / zoom,
        }}
      />
    </>
  );
};
