import { createContext, ReactNode, useContext } from "react";

export type CampusRouteParams = Record<
  string,
  string | string[] | number | undefined
>;

export interface CampusRouter {
  push: (url: string, params?: CampusRouteParams) => void;
  replace: (url: string, params?: CampusRouteParams) => void;
  params: CampusRouteParams;
  pathName: string;
}

export const RouterContext = createContext<CampusRouter | undefined>(undefined);

export interface RouterProviderProps {
  router: CampusRouter;
  children: ReactNode;
}

export const RouterProvider = ({ router, children }: RouterProviderProps) => {
  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);

  if (!context) {
    throw Error("useLink must be used within the RouterProvider");
  }

  return context;
};
