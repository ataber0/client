import { useMyTasks } from "@campus/feature-tasks/data-access";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TaskEdge } from "../../components/Edge";
import { TaskNode } from "../../components/Node";
import {
  GraphRendererProvider,
  useGraphRenderer,
} from "../../hooks/graph-renderer.hook";
import { nodeSize } from "../../utils/positioning.utils";
import { getBaseScale } from "../../utils/scale.utils";

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
  const { data: tasks } = useMyTasks();

  return tasks ? (
    <ReactFlowProvider>
      <GraphRendererProvider tasks={tasks}>
        <Graph className={className} />
      </GraphRendererProvider>
    </ReactFlowProvider>
  ) : null;
};

const Graph = ({ className }: GraphRendererProps) => {
  const { handleMouseWheel, reactFlow, ref, zoomLevel, zoom, baseZoomLevel } =
    useGraphRenderer();

  return (
    <div
      className={className}
      onWheel={handleMouseWheel}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ReactFlow
        ref={ref}
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        nodesDraggable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        maxZoom={Infinity}
        minZoom={baseZoomLevel}
        nodes={reactFlow.nodes}
        edges={reactFlow.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnDoubleClick={false}
        connectionLineStyle={{
          strokeWidth: nodeSize / 5 / getBaseScale(zoomLevel),
          // This transform hacks around issues with React Flow and scaling Node components
          // affecting the edge rendering
          transform: `translate(${2 / zoom}px, ${6 / zoom}px)`,
        }}
      >
        <TaskRendererBackground />
      </ReactFlow>
    </div>
  );
};

const TaskRendererBackground = () => {
  const { zoom } = useGraphRenderer();

  return (
    <Background
      gap={30000}
      size={1.2 / zoom}
      offset={1}
      lineWidth={1}
      color="darkorange"
    />
  );
};
