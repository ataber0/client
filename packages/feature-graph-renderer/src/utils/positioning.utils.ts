import { Task } from "@campus/feature-tasks/types";
import elkjs from "elkjs/lib/elk.bundled.js";
import { Node } from "../types/graph.models";

// Constants for layout
const NODE_SIZE = 200; // Size of each node (diameter)
const BASE_SPACING = 400; // Base spacing for the layout
const OFFSET_X = -8; // Offset for the layout
const OFFSET_Y = -8; // Offset for the layout

// Initialize ELK
const elk = new elkjs();

/**
 * Converts tasks into a graph format that ELK can understand
 */
function createElkGraph(tasks: Task[]) {
  const nodes = tasks.map((task) => ({
    id: task.id,
    // Store original task data for later use
    task: task,
    // Add size constraints to help ELK with layout
    size: NODE_SIZE,
  }));

  const edges = tasks.flatMap((task) =>
    task.dependencies.map((dependency) => ({
      id: `${task.id}-${dependency.id}`,
      sources: [task.id],
      targets: [dependency.id],
    }))
  );

  // Calculate dynamic spacing based on number of nodes
  const baseSpacing = BASE_SPACING * 1;

  return {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "UP",
      "elk.spacing.nodeNode": baseSpacing.toString(),
      "elk.layered.spacing.baseValue": baseSpacing.toString(),
      "elk.layered.spacing.edgeNode": (baseSpacing * 2).toString(),
      "elk.layered.spacing.edgeEdge": (baseSpacing * 5).toString(),
    },
    children: nodes,
    edges,
  };
}

/**
 * Converts a tree of tasks into positioned nodes using the Sugiyama Algorithm
 */
export async function positionNodes(tasks: Task[]): Promise<Node[]> {
  // Create ELK graph
  const elkGraph = createElkGraph(tasks);

  // Compute layout
  const elkLayout = await elk.layout(elkGraph);

  // Convert ELK layout back to our node format
  const nodes: Node[] = elkLayout.children!.map((elkNode) => ({
    id: elkNode.id,
    label: (elkNode as any).task.name,
    task: (elkNode as any).task,
    size: elkNode.size,
    position: {
      x: elkNode.x!,
      y: elkNode.y!,
    },
  }));

  // Center the entire graph
  const maxX = Math.max(...nodes.map((n) => n.position.x));
  const maxY = Math.max(...nodes.map((n) => n.position.y));

  return nodes.map((node) => ({
    ...node,
    position: {
      x: node.position.x - maxX / 2 + OFFSET_X,
      y: node.position.y - maxY / 2 + OFFSET_Y,
    },
  }));
}
