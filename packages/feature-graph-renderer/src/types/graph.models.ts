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
  status: "Todo" | "Done";
}

export interface Edge {
  from: Node;
  to: Node;
}
