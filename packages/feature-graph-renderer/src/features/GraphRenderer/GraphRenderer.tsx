import { useMyTasks } from "@campus/feature-tasks/data-access";
import { useEffect, useMemo, useState } from "react";
import { Circle, Layer, Line, Stage } from "react-konva";
import { useViewportControls } from "../../hooks/viewport-controls.hook";

// Types
interface Point {
  x: number;
  y: number;
}

interface Gradient {
  from: string;
  to: string;
}

interface Node {
  id: string;
  position: Point;
  label: string;
  gradient: Gradient;
}

interface Edge {
  from: string;
  to: string;
  gradient: Gradient;
}

interface GraphRendererProps {
  className?: string;
}

// Constants for layout
const NODE_SPACING = 150; // Space between nodes
const NODE_RADIUS = 35;

// Custom hook for gradient animation
const useGradientAnimation = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setOffset((prev) => (prev + 0.005) % 1);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return offset;
};

export const GraphRenderer = ({ className }: GraphRendererProps) => {
  const { data: tasks } = useMyTasks();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const gradientOffset = useGradientAnimation();
  const { viewport, setViewport, handleStartPan, handlePan, handleEndPan } =
    useViewportControls();

  const nodes = useMemo<Node[]>(() => {
    if (!tasks) return [];

    // Create a simple grid layout
    const cols = Math.ceil(Math.sqrt(tasks.length));
    return tasks.map((task, index) => ({
      id: task.id,
      position: {
        x: (index % cols) * NODE_SPACING - (cols * NODE_SPACING) / 2,
        y:
          Math.floor(index / cols) * NODE_SPACING -
          (Math.ceil(tasks.length / cols) * NODE_SPACING) / 2,
      },
      label: task.name,
      gradient:
        task.status === "Done"
          ? { from: "#666666", to: "#888888" } // Gray gradient for completed tasks
          : { from: "#FF6B9C", to: "#FF8E9E" }, // Pink gradient for active tasks
    }));
  }, [tasks]);

  const edges = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];
    for (const task of tasks ?? []) {
      for (const dependency of task.dependencies ?? []) {
        edges.push({
          from: task.id,
          to: dependency.id,
          gradient:
            task.status === "Done" || dependency.status === "Done"
              ? { from: "#666666", to: "#888888" } // Gray gradient for edges involving completed tasks
              : { from: "#FF6B9C", to: "#FF8E9E" }, // Pink gradient for active edges
        });
      }
    }
    return edges;
  }, [tasks]);

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
        {edges.map((edge, i) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const startX =
            fromNode.position.x +
            (toNode.position.x - fromNode.position.x) * gradientOffset;
          const startY =
            fromNode.position.y +
            (toNode.position.y - fromNode.position.y) * gradientOffset;
          const endX =
            fromNode.position.x +
            (toNode.position.x - fromNode.position.x) *
              ((gradientOffset + 0.9) % 1);
          const endY =
            fromNode.position.y +
            (toNode.position.y - fromNode.position.y) *
              ((gradientOffset + 0.9) % 1);

          return (
            <Line
              key={`edge-${i}`}
              points={[
                fromNode.position.x,
                fromNode.position.y,
                toNode.position.x,
                toNode.position.y,
              ]}
              strokeLinearGradientStartPoint={{ x: startX, y: startY }}
              strokeLinearGradientEndPoint={{ x: endX, y: endY }}
              strokeLinearGradientColorStops={[
                0,
                edge.gradient.from,
                0.2,
                edge.gradient.from,
                0.8,
                edge.gradient.to,
                1,
                edge.gradient.to,
              ]}
              strokeWidth={4}
              opacity={0.9}
              lineCap="round"
              lineJoin="round"
              shadowColor={edge.gradient.to}
              shadowBlur={12}
              shadowOpacity={0.3}
              globalCompositeOperation="lighter"
            />
          );
        })}

        {nodes.map((node) => (
          <Circle
            key={node.id}
            x={node.position.x}
            y={node.position.y}
            radius={35}
            fillLinearGradientStartPoint={{ x: -35, y: -35 }}
            fillLinearGradientEndPoint={{ x: 35, y: 35 }}
            fillLinearGradientColorStops={[
              0,
              node.gradient.from,
              1,
              node.gradient.to,
            ]}
            opacity={1}
            shadowColor={node.gradient.to}
            shadowBlur={15}
            shadowOpacity={0.4}
            shadowOffset={{ x: 0, y: 0 }}
          />
        ))}
      </Layer>
    </Stage>
  );
};
