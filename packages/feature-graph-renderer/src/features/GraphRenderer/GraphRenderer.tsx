import { useMyTasks } from "@campus/feature-tasks/data-access";
import { useEffect, useMemo, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Edge as EdgeComponent } from "../../components/Edge";
import { Node as NodeComponent } from "../../components/Node";
import { useViewportControls } from "../../hooks/viewport-controls.hook";
import { Edge, Node } from "../../types/graph.models";
import { positionNodes } from "../../utils/positioning.utils";

interface GraphRendererProps {
  className?: string;
}

export const GraphRenderer = ({ className }: GraphRendererProps) => {
  const { data: tasks } = useMyTasks();

  const [nodes, setNodes] = useState<Node[]>([]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { viewport, setViewport, handleStartPan, handlePan, handleEndPan } =
    useViewportControls();

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

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const stage = e.currentTarget as HTMLDivElement;
    const rect = stage.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, viewport.scale * scaleFactor));
    const scaleDiff = newScale - viewport.scale;

    setViewport((prev) => ({
      scale: newScale,
      offset: {
        x: prev.offset.x - ((mouseX - prev.offset.x) * scaleDiff) / prev.scale,
        y: prev.offset.y - ((mouseY - prev.offset.y) * scaleDiff) / prev.scale,
      },
    }));
  };

  return (
    <Stage
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      style={{ backgroundColor: "#1a1a1a" }}
      onMouseDown={(e) =>
        handleStartPan({ x: e.evt.clientX, y: e.evt.clientY })
      }
      onMouseMove={(e) => handlePan({ x: e.evt.clientX, y: e.evt.clientY })}
      onMouseUp={handleEndPan}
      onMouseLeave={handleEndPan}
      onWheel={(e) => handleWheel(e.evt)}
      scaleX={viewport.scale}
      scaleY={viewport.scale}
      x={viewport.offset.x}
      y={viewport.offset.y}
    >
      <Layer>
        {edges.map((edge, i) => (
          <EdgeComponent key={i} edge={edge} />
        ))}

        {nodes.map((node) => (
          <NodeComponent key={node.id} node={node} />
        ))}
      </Layer>
    </Stage>
  );
};
