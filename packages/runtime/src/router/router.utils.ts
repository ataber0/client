import { CampusRouteParams } from "./router.hook";

const stripUndefinedFromParams = (params: CampusRouteParams) => {
  const newParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      newParams.set(key, value as string);
    }
  }

  return newParams;
};

export const getUrlWithParams = (
  url: string,
  params: CampusRouteParams | undefined,
) => {
  const queryString = params
    ? `?${stripUndefinedFromParams(params).toString()}`
    : "";
  return `${url}${queryString}`;
};
