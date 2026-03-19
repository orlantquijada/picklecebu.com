import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

export const Route = createFileRoute("/courts/$slug")({
  component: CourtLayout,
});

function CourtLayout() {
  const { slug } = Route.useParams();
  const {
    data: court,
    isLoading,
    error,
  } = useQuery({
    queryFn: () =>
      apiFetch<
        Court & {
          isActive: number;
          ownerId: string;
          createdAt: string;
          updatedAt: string;
        }
      >(`/api/courts/${slug}`),
    queryKey: ["court", slug],
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="aspect-video rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-destructive">Court not found.</p>
      </div>
    );
  }

  return <Outlet />;
}
