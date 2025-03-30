import { QueryClientProvider } from "@tanstack/react-query";
import { ElementType, ReactNode } from "react";
import { IconProvider } from "./icon/icon.hook";
import { LinkProvider } from "./link/link.hook";
import { queryClient } from "./query/query-client";
import { CampusRouter, RouterProvider } from "./router/router.hook";

export interface RuntimeProps {
  router: CampusRouter;
  linkComponent: ElementType;
  iconComponent: ElementType;
  children: ReactNode;
}

export const Runtime = ({
  router,
  linkComponent,
  iconComponent,
  children,
}: RuntimeProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <LinkProvider linkComponent={linkComponent}>
          <IconProvider iconComponent={iconComponent}>{children}</IconProvider>
        </LinkProvider>
      </RouterProvider>
    </QueryClientProvider>
  );
};
