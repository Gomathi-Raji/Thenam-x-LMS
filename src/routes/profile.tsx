import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — AetherLMS" }] }),
  component: ProfileLayout,
});

function ProfileLayout() {
  return <Outlet />;
}
