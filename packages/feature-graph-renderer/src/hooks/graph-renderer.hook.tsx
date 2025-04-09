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
} from "../utils/react-flow.utils";
import { useViewport } from "./viewport.hook";

const GraphRendererContext = createContext<
  | (ReturnType<typeof useViewport> & {
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

  const viewport = useViewport();

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
      if (viewport.isZooming.current) return;

      if (Math.abs(e.deltaY) < 10) return;

      viewport.isZooming.current = true;

      setTimeout(() => {
        viewport.isZooming.current = false;
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
    [viewport.isZooming, viewport.viewport]
  );

  // Update the React Flow graph when the tasks or active task changes
  useEffect(() => {
    const updatePositions = async () => {
      const positionedNodes = await positionNodes(tasks);
      const reactFlow = convertToReactFlow(positionedNodes, activeTask);
      setReactFlow(reactFlow);
    };

    updatePositions();
  }, [tasks, activeTask]);

  // Set Viewport to the active task
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
      viewport.setViewport({ x, y, zoomLevel: originalNode.data.level + 1 });
    } else {
      viewport.setViewport((existing) => ({
        ...existing,
        zoomLevel: 0,
      }));
    }
  }, [params.taskId, reactFlow.nodes]);

  return (
    <GraphRendererContext.Provider
      value={{
        ...viewport,
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
