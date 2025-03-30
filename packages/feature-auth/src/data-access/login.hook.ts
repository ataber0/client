import { useAuthToken } from "@campus/runtime/auth";
import { useHttpClient } from "@campus/runtime/http-client";
import { useMutation } from "@campus/runtime/query";

export const useLogin = () => {
  const { setItem } = useAuthToken();

  const { post } = useHttpClient();

  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      return post<{ access: string }>("/api/token/pair", {
        username: username,
        password,
      });
    },
    onSuccess: async (data: { access: string }) => {
      await setItem(data.access);
    },
  });
};
