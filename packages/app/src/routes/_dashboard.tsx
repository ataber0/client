import { GraphRenderer } from "@campus/feature-graph-renderer/GraphRenderer";
import { useAuthToken } from "@campus/runtime/auth";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoading, data: token } = useAuthToken();

  const { navigate } = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <div>
      <GraphRenderer />

      <div className="fixed top-0 left-0">
        <Outlet />
      </div>
    </div>
  );
}
