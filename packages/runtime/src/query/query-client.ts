import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 900000, // 15 minutes
      refetchOnWindowFocus: false,
    },
  },
});
