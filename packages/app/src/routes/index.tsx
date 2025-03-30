import { useAuthToken } from "@campus/runtime/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { isLoading, data: token } = useAuthToken();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    redirect({ to: "/login" });
    return null;
  }

  return <div>HIYA</div>;
}
