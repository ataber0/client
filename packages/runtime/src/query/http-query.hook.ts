import { useCallback, useMemo } from "react";
import {
  HttpSearchParams,
  useHttpClient,
} from "../http-client/http-client.hook";
import { QueryKey, useQuery, UseQueryOptions } from "./query.hook";

interface HttpQueryOptions<ResponseData, ReturnedData>
  extends Omit<
    UseQueryOptions<ResponseData, Error, ReturnedData>,
    "queryKey" | "queryFn"
  > {
  url: string;
  queryKey?: QueryKey;
  queryKeyPrefix?: QueryKey;
  params?: HttpSearchParams;
}

export const useHttpQuery = <ResponseData, ReturnedData = ResponseData>(
  options: HttpQueryOptions<ResponseData, ReturnedData>,
) => {
  const { get } = useHttpClient();

  const queryFn = useCallback(async () => {
    return get<ResponseData>(options.url);
  }, [options.url, get]);

  const queryKey = useMemo(() => {
    return [...(options.queryKeyPrefix ?? []), options.url, options.params];
  }, [options.queryKeyPrefix, options.url, options.params]);

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
};
