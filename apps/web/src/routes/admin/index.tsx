import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import { apiFetch } from "#/lib/api";
import { formatCentavos } from "#/lib/format";

interface Court {
  id: string;
  name: string;
  locationArea: string;
  isActive: number;
  hourlyRate: number;
}

const getMe = () =>
  apiFetch<{ id: string; role: string; name: string }>("/api/auth/me");

const AdminIndexPage = () => {
  const navigate = useNavigate();

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

  if (meError || (me && me.role !== "admin")) {
    navigate({ to: "/admin/login" });
    return null;
  }

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">PickleCebu Management</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      <div className="mb-6 flex gap-3">
        <Button asChild>
          <Link to="/admin/courts/new">+ Onboard New Court</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/courts">Manage Courts</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/bookings">All Bookings</Link>
        </Button>
      </div>

      <h2 className="mb-4 text-lg font-semibold">
        All Courts ({courts.length})
      </h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Area</th>
              <th className="px-4 py-3 text-left font-medium">Rate</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courts.map((court) => (
              <tr key={court.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{court.name}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/admin/")({
  component: AdminIndexPage,
});
