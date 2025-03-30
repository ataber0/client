export interface TaskBase {
  id: string;
  name: string;
  status: "Todo" | "Done";
  imageUrl?: string;
}

export interface Task extends TaskBase {
  dependencies: Task[];
  dependents: Task[];
  description: string | null;
}
