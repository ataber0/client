import { useCallback, useMemo } from "react";
import { useAuthToken } from "../auth/auth-token.hook";

export type HttpSearchParams = Record<string, string | number | undefined>;

export type HttpRequestBody = Record<string, unknown>;

const getDevelopmentServerUrl = () => {
  // return "http://192.168.1.170:8001";
  return "http://localhost:8001";
};

const baseUrl = getDevelopmentServerUrl();

const baseHeaders = {
  "Content-Type": "application/json",
};

const getUrlSearchParams = (params: HttpSearchParams) => {
  const newParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      newParams.set(key, String(value));
    }
  }

  return newParams;
};

export const useHttpClient = () => {
  const { data: token } = useAuthToken();

  const headers = useMemo(() => {
    return {
      ...baseHeaders,
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const get = useCallback(
    async <T = unknown>(url: string, params?: HttpSearchParams): Promise<T> => {
      const stringifiedParams = params
        ? getUrlSearchParams(params).toString()
        : "";
      const urlWithParams = `${baseUrl}${url}${stringifiedParams}`;
      return fetch(urlWithParams, { headers }).then((response) =>
        response.json(),
      );
    },
    [headers],
  );

  const post = useCallback(
    <T = unknown>(url: string, body: HttpRequestBody = {}): Promise<T> => {
      return fetch(`${baseUrl}${url}`, {
        method: "post",
        body: JSON.stringify(body),
        headers,
      }).then((response) => response.json());
    },
    [headers],
  );

  return {
    get,
    post,
  };
};
