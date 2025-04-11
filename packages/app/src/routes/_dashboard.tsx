import { GraphRenderer } from "@campus/feature-graph-renderer/GraphRenderer";
import { Chat } from "@campus/feature-tasks/Chat";
import { useAuthToken } from "@campus/runtime/auth";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
  ssr: false,
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

      <div className="bg-background rounded-lg overflow-hidden fixed top-0 left-0 overflow-y-auto max-h-full w-80">
        <Outlet />
      </div>

      <Chat className="fixed top-0 right-0 p-2 bg-background rounded-lg w-[320px] max-h-full overflow-y-auto" />
    </div>
  );
}
