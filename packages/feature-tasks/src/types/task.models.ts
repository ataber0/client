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
  dependencies: TaskBase[];
  dependents: TaskBase[];
  subtasks: TaskBase[];
  description: string | null;
  parent?: TaskBase;
}

export interface UpdateTaskPayload extends HttpRequestBody {
  name?: string;
  description?: string;
  status?: "Todo" | "Done";
}

export interface CreateTaskPayload extends HttpRequestBody {
  name: string;
  description?: string;
  dependencyId?: string;
  dependentId?: string;
}

export interface CreateDependencyPayload extends HttpRequestBody {
  upstreamId: string;
  downstreamId: string;
}

export interface RemoveDependencyPayload extends HttpRequestBody {
  upstreamId: string;
  downstreamId: string;
}
