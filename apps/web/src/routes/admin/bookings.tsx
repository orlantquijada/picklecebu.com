import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { apiFetch } from "#/lib/api";
import { formatCentavos, formatHourRange } from "#/lib/format";

interface Booking {
  id: string;
  courtId: string;
  bookingDate: string;
  startHour: number;
  endHour: number;
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "failed" | "cancelled";
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  cancelled: "outline",
  confirmed: "default",
  failed: "destructive",
  pending: "secondary",
};

const getMe = () => apiFetch<{ role: string }>("/api/auth/me");

const AdminBookingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: me, error: meError } = useQuery({
    queryFn: getMe,
    queryKey: ["auth-me"],
    retry: false,
  });

  const { data: bookings = [], isLoading } = useQuery({
    enabled: me?.role === "admin",
    queryFn: () => apiFetch<Booking[]>("/api/admin/bookings"),
    queryKey: ["admin-bookings"],
  });

  const cancel = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/bookings/${id}/cancel`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });

  if (meError || (me && me.role !== "admin")) {
    navigate({ to: "/admin/login" });
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link to="/admin" className="text-sm text-primary hover:underline">
          ← Admin Panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">All Bookings</h1>
      </div>

      {isLoading ? (
        <div className="animate-pulse rounded-lg bg-muted h-48" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Time</th>
                <th className="px-4 py-3 text-left font-medium">Player</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {b.id.slice(0, 16)}
                  </td>
                  <td className="px-4 py-3">{b.bookingDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatHourRange(b.startHour, b.endHour)}
                  </td>
                  <td className="px-4 py-3">
                    <div>{b.playerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.playerEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCentavos(b.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[b.status] ?? "outline"}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {(b.status === "confirmed" || b.status === "pending") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => cancel.mutate(b.id)}
                        disabled={cancel.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookingsPage,
});
