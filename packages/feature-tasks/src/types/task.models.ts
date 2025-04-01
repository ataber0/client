import { HttpRequestBody } from "@campus/runtime/http-client";

export interface TaskBase {
  id: string;
  name: string;
  status: "Todo" | "Done";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task extends TaskBase {
  dependencies: Task[];
  dependents: Task[];
  description: string | null;
}

export interface UpdateTaskPayload extends HttpRequestBody {
  name?: string;
  description?: string;
  status?: "Todo" | "Done";
}
