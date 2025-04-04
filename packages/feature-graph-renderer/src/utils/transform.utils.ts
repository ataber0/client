import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { ElkNode, LayoutOptions } from "elkjs";

export interface NodeData {
  id: string;
  label: string;
  size: number;
  task: Task;
  children: NodeData[];
  parentId?: string;
  layoutOptions: LayoutOptions;
}

export interface ElkNodeData extends ElkNode {
  x: number;
  y: number;
  size: number;
  task: Task;
  parentId?: string;
  children: ElkNodeData[];
}

export interface ReactFlowNode {
  id: string;
  type: "task";
  position: { x: number; y: number };
  data: { task: Task; level: number };
  parentId?: string;
}

export interface ReactFlowEdge {
  id: string;
  type: "taskEdge";
  source: string;
  target: string;
  data: { color: string; level: number };
}

const NODE_SIZE = 200;

export function buildHierarchy(tasks: Task[]): NodeData[] {
  const nodeMap = new Map<string, NodeData>();

  tasks.forEach((task) => {
    const node: NodeData = {
      id: task.id,
      label: task.name,
      parentId: task.parent?.id,
      size: task.parent ? NODE_SIZE * 0.5 : NODE_SIZE,
      task,
      children: [],
      layoutOptions: {
        "elk.layered.spacing.baseValue": "50",
      },
    };
    nodeMap.set(node.id, node);
  });

  const rootNodes: NodeData[] = [];

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

  return rootNodes;
}

export function convertToReactFlow(hierarchy: ElkNodeData[]): {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
} {
  const nodes: ReactFlowNode[] = [];
  const edges: ReactFlowEdge[] = [];
  const nodeMap = new Map<string, ElkNodeData>();

  // Helper function to collect all nodes into the nodeMap
  function collectNodes(nodes: ElkNodeData[]) {
    nodes.forEach((node) => {
      nodeMap.set(node.id, node);
      if (node.children.length > 0) {
        collectNodes(node.children);
      }
    });
  }

  // Collect all nodes into the map
  collectNodes(hierarchy);

  function traverse(node: ElkNodeData, level: number, parentId?: string) {
    nodes.push({
      id: node.id,
      type: "task",
      position: { x: node.x, y: node.y },
      parentId,
      data: { task: node.task, level },
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
              level,
            },
          });
        }
      });
    }

    node.children.forEach((child) => {
      traverse(child, level + 1, node.id);
    });
  }

  hierarchy.forEach((node) => {
    traverse(node, 0);
  });

  return { nodes, edges };
}
