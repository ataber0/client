import { useMyTasks } from "@campus/feature-tasks/data-access";
import { useRouter } from "@campus/runtime/router";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useViewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";
import { TaskEdge } from "../../components/Edge";
import { TaskNode } from "../../components/Node";
import { useZoomLevels } from "../../hooks/zoom-levels.hook";
import { positionNodes } from "../../utils/positioning.utils";
import {
  convertToReactFlow,
  ReactFlowEdge,
  ReactFlowNode,
} from "../../utils/transform.utils";
interface GraphRendererProps {
  className?: string;
}

const nodeTypes = {
  task: TaskNode,
};

const edgeTypes = {
  taskEdge: TaskEdge,
};

export const GraphRenderer = ({ className }: GraphRendererProps) => {
  return (
    <ReactFlowProvider>
      <Graph className={className} />
    </ReactFlowProvider>
  );
};

const Graph = ({ className }: GraphRendererProps) => {
  const { handleMouseWheel } = useZoomLevels();

  const router = useRouter();

  const { data: tasks } = useMyTasks();

  const [reactFlow, setReactFlow] = useState<{
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
  }>({ nodes: [], edges: [] });

  // Update node positions when tasks change
  useEffect(() => {
    if (!tasks) return;

    const updatePositions = async () => {
      const positionedNodes = await positionNodes(tasks);
      const reactFlow = convertToReactFlow(positionedNodes);
      setReactFlow(reactFlow);
    };

    updatePositions();
  }, [tasks]);

  return (
    <div
      className={className}
      onWheel={handleMouseWheel}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ReactFlow
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        nodesDraggable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        maxZoom={10}
        minZoom={0.2}
        nodes={reactFlow.nodes}
        edges={reactFlow.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(e, node) => {
          router.push(`/tasks/${node.data.task.id}`);
        }}
      >
        <TaskRendererBackground />
      </ReactFlow>
    </div>
  );
};

const TaskRendererBackground = () => {
  const { zoom } = useViewport();

  return (
    <Background
      gap={50 / Math.max(0.5, Math.min(2, Math.round(zoom / 1.2) * 1.2))}
      size={1.2 / zoom}
      offset={1}
      lineWidth={1}
      color="darkorange"
    />
  );
};
