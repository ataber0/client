import { TaskDetails } from "@campus/feature-tasks/TaskDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/tasks/$taskId")({
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const { taskId } = Route.useParams();

  return (
    <div>
      <TaskDetails taskId={taskId} />
    </div>
  );
}
