import { Task } from "@campus/feature-tasks/types";
import elkjs from "elkjs/lib/elk.bundled.js";
import { Node } from "../types/graph.models";

// Constants for layout
const NODE_SIZE = 70; // Size of each node (diameter)
const MIN_SPACING = 100; // Minimum spacing between nodes
const BASE_SPACING = 200; // Base spacing for the layout

// Initialize ELK
const elk = new elkjs();

/**
 * Converts tasks into a graph format that ELK can understand
 */
function createElkGraph(tasks: Task[]) {
  const nodes = tasks
    .sort((a, b) => {
      return (b.dependencies?.length || 0) - (a.dependencies?.length || 0);
    })
    .map((task) => ({
      id: task.id,
      // Store original task data for later use
      task: task,
      // Add size constraints to help ELK with layout
      width: NODE_SIZE,
      height: NODE_SIZE,
    }));

  const edges = tasks.flatMap((task) =>
    task.dependencies.map((dependency) => ({
      id: `${task.id}-${dependency.id}`,
      sources: [task.id],
      targets: [dependency.id],
    }))
  );

  // Calculate dynamic spacing based on number of nodes
  const nodeCount = nodes.length;
  const spacingMultiplier = Math.min(1.5, Math.max(1, Math.log10(nodeCount)));
  const nodeSpacing = MIN_SPACING * spacingMultiplier;
  const baseSpacing = BASE_SPACING * spacingMultiplier;

  return {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.spacing.nodeNode": nodeSpacing.toString(),
      "elk.layered.spacing.baseValue": baseSpacing.toString(),
      // Additional options for stability
      "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
      "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
      "elk.layered.mergeEdges": "true",
      "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
      "elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
      "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
      // Prevent edge routing through nodes
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.spacing.edgeNode": (nodeSpacing * 1.5).toString(),
      "elk.spacing.edgeEdge": (nodeSpacing * 0.5).toString(),
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
      x: node.position.x - maxX / 2,
      y: node.position.y - maxY / 2,
    },
  }));
}
