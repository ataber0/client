import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { nodeSize, PositionedNode } from "./positioning.utils";

export interface ReactFlowGraph {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}

export interface ReactFlowNode {
  id: string;
  type: "task";
  position: { x: number; y: number };
  data: { task: Task; level: number; size: number };
  width: number;
  height: number;
  parentId?: string;
}

export interface ReactFlowEdge {
  id: string;
  type: "taskEdge";
  source: string;
  target: string;
  data: { color: string; level: number };
}

export function convertToReactFlow(
  hierarchy: PositionedNode[]
): ReactFlowGraph {
  const nodes: ReactFlowNode[] = [];
  const edges: ReactFlowEdge[] = [];
  const nodeMap = new Map<string, PositionedNode>();

  // Helper function to collect all nodes into the nodeMap
  function collectNodes(nodes: PositionedNode[]) {
    nodes.forEach((node) => {
      nodeMap.set(node.id, node);
      if (node.children.length > 0) {
        collectNodes(node.children);
      }
    });
  }

  // Collect all nodes into the map
  collectNodes(hierarchy);

  function traverse(node: PositionedNode, parentId?: string) {
    nodes.push({
      id: node.id,
      type: "task",
      position: { x: node.x, y: node.y },
      width: nodeSize / (Math.pow(5, node.level || 0) || 1),
      height: nodeSize / (Math.pow(5, node.level || 0) || 1),
      parentId,
      data: { task: node.task, level: node.level, size: node.width },
    });

    // Add dependency edges
    if (node.task.dependencies.length > 0) {
      node.task.dependencies.forEach((dependency) => {
        // Only add the edge if the dependency exists in our node map
        if (nodeMap.has(dependency.id)) {
          edges.push({
            id: `d${node.id}-${dependency.id}`,
            type: "taskEdge",
            source: dependency.id,
            target: node.id,
            data: {
              color: getStatusColor(nodeMap.get(dependency.id)!.task),
              level: node.level,
            },
          });
        }
      });
    }

    node.children.forEach((child) => {
      traverse(child, node.id);
    });
  }

  hierarchy.forEach((node) => {
    traverse(node);
  });

  return { nodes, edges };
}
