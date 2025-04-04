import { Task } from "@campus/feature-tasks/types";
import ELK from "elkjs/lib/elk.bundled.js";
import { buildHierarchy, ElkNodeData } from "./transform.utils";

export const baseSpacing = 100000;
export const nodeSize = 80000;

const elk = new ELK();

function createElkGraph(tasks: Task[]) {
  const edges = tasks.flatMap((task) =>
    task.dependencies.map((dependency) => ({
      id: `${task.id}-${dependency.id}`,
      parent: task.parent?.id,
      sources: [task.id],
      targets: [dependency.id],
    }))
  );

  return {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "UP",
      "elk.hierarchyHandling": "INCLUDE_CHILDREN",
      "elk.layered.spacing.baseValue": baseSpacing.toString(),
      "elk.layered.mergeEdges": "true",
    },
    children: buildHierarchy(tasks),
    edges,
  };
}

export async function positionNodes(tasks: Task[]): Promise<ElkNodeData[]> {
  const elkGraph = createElkGraph(tasks);

  const elkLayout = await elk.layout(elkGraph);

  return elkLayout.children as unknown as ElkNodeData[];
}
