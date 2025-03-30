import { MyTasks } from "@campus/feature-tasks/MyTasks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <MyTasks />
    </div>
  );
}
