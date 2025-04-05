import { Task } from "@campus/feature-tasks/types";
import { useRouter } from "@campus/runtime/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { nodeSize, positionNodes } from "../utils/positioning.utils";
import {
  convertToReactFlow,
  ElkNodeData,
  ReactFlowGraph,
} from "../utils/transform.utils";
import { useZoomLevels } from "./zoom-levels.hook";

const GraphRendererContext = createContext<
  | (ReturnType<typeof useZoomLevels> & {
      tasks: Task[];
      activeTask: Task | undefined;
      reactFlow: ReactFlowGraph;
    })
  | undefined
>(undefined);

export const useGraphRenderer = () => {
  const context = useContext(GraphRendererContext);

  if (!context) {
    throw new Error(
      "useGraphRenderer must be used within a GraphRendererProvider"
    );
  }

  return context;
};

export const GraphRendererProvider = ({
  tasks,
  children,
}: {
  tasks: Task[];
  children: React.ReactNode;
}) => {
  const zoomLevels = useZoomLevels();

  const { params } = useRouter();

  const [positionedNodes, setPositionedNodes] = useState<ElkNodeData[]>([]);

  const [reactFlow, setReactFlow] = useState<ReactFlowGraph>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const updatePositions = async () => {
      const positionedNodes = await positionNodes(tasks);
      setPositionedNodes(positionedNodes);
      const reactFlow = convertToReactFlow(positionedNodes);
      setReactFlow(reactFlow);
    };

    updatePositions();
  }, [tasks]);

  const activeTask = useMemo(() => {
    return tasks.find((task) => task.id === params.taskId);
  }, [tasks, params.taskId]);

  useEffect(() => {
    let node = reactFlow.nodes.find(
      (node) => node.data.task.id === params.taskId
    );
    if (node) {
      let x = nodeSize / (Math.pow(5, node.data.level || 0) || 1) / 2;
      let y = nodeSize / (Math.pow(5, node.data.level || 0) || 1) / 2;
      while (node) {
        x += node.position.x;
        y += node.position.y;
        node = reactFlow.nodes.find((n) => n.id === node?.parentId);
      }
      zoomLevels.zoomToPosition(x, y);
    }
  }, [params.taskId]);

  return (
    <GraphRendererContext.Provider
      value={{ ...zoomLevels, tasks, activeTask, reactFlow }}
    >
      {children}
    </GraphRendererContext.Provider>
  );
};
