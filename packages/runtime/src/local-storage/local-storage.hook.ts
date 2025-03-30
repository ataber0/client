import { queryClient } from "../query/query-client";
import { useMutation, useQuery } from "../query/query.hook";

export const useLocalStorage = <T>(key: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [key],
    queryFn: () => {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    },
  });

  const { mutateAsync: setItem } = useMutation({
    mutationFn: async (value: T) => {
      if (value === undefined) {
        localStorage.removeItem(key);
        return undefined;
      }

      const stringifiedValue = JSON.stringify(value);
      localStorage.setItem(key, stringifiedValue);
      return value;
    },
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: [key] }, data);
    },
  });

  return { data, isLoading, setItem };
};
