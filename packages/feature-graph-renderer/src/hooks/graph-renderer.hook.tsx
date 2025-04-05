import { Task } from "@campus/feature-tasks/types";
import { useRouter } from "@campus/runtime/router";
import { useReactFlow } from "@xyflow/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { positionNodes } from "../utils/positioning.utils";
import {
  convertToReactFlow,
  ReactFlowEdge,
  ReactFlowGraph,
  ReactFlowNode,
} from "../utils/transform.utils";
import { useZoomLevels } from "./zoom-levels.hook";

const GraphRendererContext = createContext<
  | (ReturnType<typeof useZoomLevels> & {
      tasks: Task[];
      activeTask: Task | undefined;
      reactFlow: ReactFlowGraph;
      ref: React.RefObject<HTMLDivElement | null>;
      handleMouseWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
      getNode: (id: string) => ReactFlowNode | undefined;
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
  const { getNode } = useReactFlow<ReactFlowNode, ReactFlowEdge>();

  const ref = useRef<HTMLDivElement>(null);

  const zoomLevels = useZoomLevels();

  const { push, params } = useRouter();

  const [reactFlow, setReactFlow] = useState<ReactFlowGraph>({
    nodes: [],
    edges: [],
  });

  const activeTask = useMemo(() => {
    return tasks.find((task) => task.id === params.taskId);
  }, [tasks, params.taskId]);

  const handleMouseWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (zoomLevels.isZooming.current) return;

      if (Math.abs(e.deltaY) < 10) return;

      zoomLevels.isZooming.current = true;

      setTimeout(() => {
        zoomLevels.isZooming.current = false;
      }, 800);

      if (e.deltaY < 0) {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          element.dispatchEvent(clickEvent);
        }

        return;
      }

      push(activeTask?.parent ? `/tasks/${activeTask.parent.id}` : "/");
    },
    [zoomLevels.isZooming, zoomLevels.viewport]
  );

  useEffect(() => {
    const updatePositions = async () => {
      const positionedNodes = await positionNodes(tasks);
      const reactFlow = convertToReactFlow(positionedNodes);
      setReactFlow(reactFlow);
    };

    updatePositions();
  }, [tasks]);

  useEffect(() => {
    const originalNode = reactFlow.nodes.find(
      (node) => node.data.task.id === params.taskId
    );
    if (originalNode) {
      let node: ReactFlowNode | undefined = originalNode;
      let x = node.width / 2;
      let y = node.height / 2;
      while (node) {
        x += node.position.x;
        y += node.position.y;
        node = reactFlow.nodes.find((n) => n.id === node?.parentId);
      }
      zoomLevels.setViewport({ x, y, zoomLevel: originalNode.data.level + 1 });
    } else {
      zoomLevels.setViewport((existing) => ({
        ...existing,
        zoomLevel: 0,
      }));
    }
  }, [params.taskId]);

  return (
    <GraphRendererContext.Provider
      value={{
        ...zoomLevels,
        tasks,
        activeTask,
        reactFlow,
        ref,
        handleMouseWheel,
        getNode,
      }}
    >
      {children}
    </GraphRendererContext.Provider>
  );
};
