import { useRouter } from "@campus/runtime/router";
import { useTaskDetails } from "./task-details.data-access";

export const useActiveTask = () => {
  const { params } = useRouter();

  return useTaskDetails(params?.taskId as string | undefined);
};
