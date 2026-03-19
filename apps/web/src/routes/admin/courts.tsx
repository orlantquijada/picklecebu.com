import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import { apiFetch } from "#/lib/api";
import { formatCentavos } from "#/lib/format";

interface Court {
  id: string;
  name: string;
  slug: string;
  locationArea: string;
  isActive: number;
  hourlyRate: number;
}

const getMe = () => apiFetch<{ role: string }>("/api/auth/me");

const AdminCourtsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: me, error: meError } = useQuery({
    queryFn: getMe,
    queryKey: ["auth-me"],
    retry: false,
  });

  const { data: courts = [] } = useQuery({
    enabled: me?.role === "admin",
    queryFn: () => apiFetch<Court[]>("/api/admin/courts"),
    queryKey: ["admin-courts"],
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: number }) =>
      apiFetch(`/api/admin/courts/${id}`, {
        body: JSON.stringify({ isActive }),
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courts"] });
    },
  });

  if (meError || (me && me.role !== "admin")) {
    navigate({ to: "/admin/login" });
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/admin" className="text-sm text-primary hover:underline">
            ← Admin Panel
          </Link>
          <h1 className="mt-2 text-2xl font-bold">All Courts</h1>
        </div>
        <Button asChild>
          <Link to="/admin/courts/new">+ New Court</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Area</th>
              <th className="px-4 py-3 text-left font-medium">Rate</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courts.map((court) => (
              <tr key={court.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{court.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {court.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {court.locationArea}
                </td>
                <td className="px-4 py-3">
                  {formatCentavos(court.hourlyRate)}/hr
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      court.isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {court.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleActive.mutate({
                        id: court.id,
                        isActive: court.isActive ? 0 : 1,
                      })
                    }
                    disabled={toggleActive.isPending}
                  >
                    {court.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/admin/courts")({
  component: AdminCourtsPage,
});
