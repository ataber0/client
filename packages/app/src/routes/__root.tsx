import { Runtime } from "@campus/runtime";
import { CampusRouteParams, CampusRouter } from "@campus/runtime/router";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
  useParams,
  useRouter as useTanStackRouter,
} from "@tanstack/react-router";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
  ssr: false,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

const useRouter = (): CampusRouter => {
  const router = useTanStackRouter();

  const params = useParams({ strict: false });

  const location = useLocation();

  const navigate = (url: string, params?: CampusRouteParams) => {
    router.navigate({ to: url, params });
  };

  return {
    push: navigate,
    replace: navigate,
    params,
    pathName: location.pathname,
  };
};

function RootDocument({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <html>
      <head>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
        </style>

        <HeadContent />
      </head>
      <body>
        <Runtime router={router} linkComponent={Link}>
          {children}

          <Scripts />
        </Runtime>
      </body>
    </html>
  );
}
