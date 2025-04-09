import { Task } from "@campus/feature-tasks/types";
import { graphlib, layout } from "@dagrejs/dagre";
import { getBaseScale } from "./scale.utils";

export interface PositionedNodeInput {
  id: string;
  children: PositionedNodeInput[];
  level: number;
  task: Task;
  width: number;
  height: number;
  parentId?: string;
}

export interface PositionedNode extends PositionedNodeInput {
  x: number;
  y: number;
  children: PositionedNode[];
}

export const baseSpacing = 100000;
export const nodeSize = 100000;

export function buildHierarchy(tasks: Task[]): PositionedNodeInput[] {
  const nodeMap = new Map<string, PositionedNodeInput>();

  tasks.forEach((task) => {
    const node: PositionedNodeInput = {
      id: task.id,
      parentId: task.parent?.id,
      width: nodeSize,
      height: nodeSize,
      task,
      children: [],
      level: 0,
    };
    nodeMap.set(node.id, node);
  });

  const rootNodes: PositionedNodeInput[] = [];

  tasks.forEach((task) => {
    const node = nodeMap.get(task.id);

    if (!node) {
      return;
    }

    if (task.parent?.id) {
      const parent = nodeMap.get(task.parent.id);
      if (parent) {
        parent.children!.push(node);
      }
    } else {
      rootNodes.push(node);
    }
  });

  function setLevels(nodes: PositionedNodeInput[], level: number) {
    const size = nodeSize / getBaseScale(level + 1);

    nodes.forEach((node) => {
      node.level = level;
      node.height = size;
      node.width = size;
      if (node.children.length > 0) {
        setLevels(node.children, level + 1);
      }
    });
  }

  setLevels(rootNodes, 0);

  return rootNodes;
}

export const positionNodes = (tasks: Task[]): PositionedNode[] => {
  const positionedNodesInput = buildHierarchy(tasks);

  // Create a map to store all nodes for easy lookup
  const nodeMap = new Map<string, PositionedNodeInput>();

  // Helper function to collect all nodes into the map
  function collectNodes(nodes: PositionedNodeInput[]) {
    nodes.forEach((node) => {
      nodeMap.set(node.id, node);
      if (node.children.length > 0) {
        collectNodes(node.children);
      }
    });
  }

  // Collect all nodes into the map
  collectNodes(positionedNodesInput);

  // Process each level separately, starting with the root level
  function processLevel(
    nodes: PositionedNodeInput[],
    level: number
  ): PositionedNode[] {
    const graph = new graphlib.Graph();
    graph.setDefaultEdgeLabel(() => ({}));

    // Set graph direction and node spacing based on level
    const levelSpacing = baseSpacing / getBaseScale(level);
    graph.setGraph({
      rankdir: "LR",
      nodesep: levelSpacing,
      ranksep: levelSpacing,
    });

    // Add nodes at this level to the graph
    nodes.forEach((node) => {
      graph.setNode(node.id, {
        width: node.width,
        height: node.height,
      });

      // Add edges for dependencies
      if (node.task.dependencies && node.task.dependencies.length > 0) {
        node.task.dependencies.forEach((dependency) => {
          // Only add the edge if the dependency exists in our node map
          if (nodeMap.has(dependency.id)) {
            graph.setEdge(dependency.id, node.id);
          }
        });
      }
    });

    // Run the layout algorithm for this level
    layout(graph);

    // Convert the graph back to our PositionedNode structure
    return nodes.map((node) => {
      const graphNode = graph.node(node.id);

      // Process children (subtasks) recursively
      const positionedChildren =
        node.children.length > 0 ? processLevel(node.children, level + 1) : [];

      // Create the positioned node
      const positionedNode: PositionedNode = {
        ...node,
        x: graphNode.x,
        y: graphNode.y,
        children: positionedChildren,
      };

      return positionedNode;
    });
  }

  // Start processing from the root level
  return processLevel(positionedNodesInput, 0);
};
