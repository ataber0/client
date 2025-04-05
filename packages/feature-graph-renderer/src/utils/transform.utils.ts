import { Task } from "@campus/feature-tasks/types";
import { getStatusColor } from "@campus/feature-tasks/utils";
import { ElkNode, LayoutOptions } from "elkjs";
import { baseSpacing, nodeSize } from "./positioning.utils";

export interface NodeData {
  id: string;
  label: string;
  height: number;
  width: number;
  task: Task;
  children: NodeData[];
  parentId?: string;
  level: number;
  layoutOptions?: LayoutOptions;
}

export interface ElkNodeData extends ElkNode {
  x: number;
  y: number;
  height: number;
  width: number;
  task: Task;
  level: number;
  parentId?: string;
  children: ElkNodeData[];
}

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

export function buildHierarchy(tasks: Task[]): NodeData[] {
  const nodeMap = new Map<string, NodeData>();

  tasks.forEach((task) => {
    const node: NodeData = {
      id: task.id,
      label: task.name,
      parentId: task.parent?.id,
      width: nodeSize,
      height: nodeSize,
      task,
      children: [],
      level: 0,
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

  function setLevels(nodes: NodeData[], level: number) {
    nodes.forEach((node) => {
      node.level = level;
      node.height = nodeSize / Math.pow(5, level + 1);
      node.width = nodeSize / Math.pow(5, level + 1);
      node.layoutOptions = {
        "elk.layered.spacing.baseValue": (
          baseSpacing / Math.pow(5, level + 1)
        ).toString(),
      };
      if (node.children.length > 0) {
        setLevels(node.children, level + 1);
      }
    });
  }

  setLevels(rootNodes, 0);

  return rootNodes;
}

export function convertToReactFlow(hierarchy: ElkNodeData[]): ReactFlowGraph {
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

  function traverse(node: ElkNodeData, parentId?: string) {
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
