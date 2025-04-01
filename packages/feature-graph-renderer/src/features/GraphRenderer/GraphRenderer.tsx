import { useMyTasks } from "@campus/feature-tasks/data-access";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { useRouter } from "@campus/runtime/router";
import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo, useState } from "react";
import { TaskEdge } from "../../components/Edge";
import { TaskNode } from "../../components/Node";
import { Edge, Node } from "../../types/graph.models";
import { positionNodes } from "../../utils/positioning.utils";

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
  const router = useRouter();

  const { data: tasks } = useMyTasks();

  const [nodes, setNodes] = useState<Node[]>([]);

  // Update node positions when tasks change
  useEffect(() => {
    if (!tasks) return;

    const updatePositions = async () => {
      const positionedNodes = await positionNodes(tasks);
      setNodes(positionedNodes);
    };

    updatePositions();
  }, [tasks]);

  const edges = useMemo<Edge[]>(() => {
    if (!tasks) return [];
    const edges: Edge[] = [];
    for (const task of tasks) {
      for (const dependency of task.dependencies ?? []) {
        const fromNode = nodes.find((n) => n.id === task.id);
        const toNode = nodes.find((n) => n.id === dependency.id);
        if (fromNode && toNode) {
          edges.push({ from: fromNode, to: toNode });
        }
      }
    }
    return edges;
  }, [tasks, nodes]);

  return (
    <div className={className} style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        minZoom={0.1}
        nodes={nodes.map((node) => ({
          id: node.id,
          type: "task",
          data: { task: node.task },
          position: { x: node.position.x, y: node.position.y },
          task: node.task,
        }))}
        edges={edges.map((edge) => ({
          id: `${edge.from.id}-${edge.to.id}`,
          source: edge.to.id,
          target: edge.from.id,
          type: "taskEdge",
          data: {
            color: getStatusColor(edge.to.task),
          },
        }))}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(e, node) => {
          router.push(`/tasks/${node.task.id}`);
        }}
      >
        <Background
          gap={200}
          size={10}
          lineWidth={1}
          color="darkorange"
          variant={BackgroundVariant.Cross}
        />
      </ReactFlow>
    </div>
  );
};
