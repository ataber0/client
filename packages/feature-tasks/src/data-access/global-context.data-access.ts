import { useHttpQuery } from "@campus/runtime/query";
import { ContextItem } from "../types/context.models";

export const useGlobalContext = () => {
  return useHttpQuery<ContextItem[]>({
    queryKeyPrefix: ["context"],
    url: "/api/context/me/",
  });
};
