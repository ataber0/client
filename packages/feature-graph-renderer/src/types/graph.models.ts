import { Task } from "@campus/feature-tasks/types";

export interface Point {
  x: number;
  y: number;
}

export interface Gradient {
  from: string;
  to: string;
}

export interface Node {
  id: string;
  position: Point;
  label: string;
  task: Task;
}

export interface Edge {
  from: Node;
  to: Node;
}
