import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import BookingTable from "#/components/dashboard/BookingTable";
import RevenueCard from "#/components/dashboard/RevenueCard";
import { Button } from "#/components/ui/button";
import { apiFetch } from "#/lib/api";

interface Court {
  id: string;
  name: string;
  slug: string;
  locationArea: string;
  hourlyRate: number;
  isActive: number;
}

interface BookingRow {
  id: string;
  bookingDate: string;
  startHour: number;
  endHour: number;
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "failed" | "cancelled";
}

interface Summary {
  week: number;
  month: number;
  totalBookings: number;
}

const getMe = () =>
  apiFetch<{ id: string; role: string; name: string; email: string }>(
    "/api/auth/me"
  );

const DashboardIndexPage = () => {
  const navigate = useNavigate();

  const {
    data: me,
    isLoading: meLoading,
    error: meError,
  } = useQuery({
    queryFn: getMe,
    queryKey: ["auth-me"],
    retry: false,
  });

  const { data: courts = [] } = useQuery({
    enabled: !!me,
    queryFn: () => apiFetch<Court[]>("/api/dashboard/courts"),
    queryKey: ["dashboard-courts"],
  });

  const { data: summary } = useQuery({
    enabled: !!me,
    queryFn: () => apiFetch<Summary>("/api/dashboard/bookings/summary"),
    queryKey: ["dashboard-summary"],
  });

  const firstCourt = courts[0];
  const today = new Date().toISOString().split("T")[0]!;
  const { data: upcomingBookings = [] } = useQuery({
    enabled: !!firstCourt,
    queryFn: () =>
      apiFetch<BookingRow[]>(
        `/api/dashboard/courts/${firstCourt!.id}/bookings?from=${today}&status=confirmed`
      ),
    queryKey: ["dashboard-bookings", firstCourt?.id],
  });

  if (meLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (meError || !me) {
    navigate({ to: "/dashboard/login" });
    return null;
  }

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    navigate({ to: "/dashboard/login" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {me.name}</p>
        </div>
        <div className="flex gap-3">
          {me.role === "admin" && (
            <Button variant="outline" asChild>
              <Link to="/admin">Admin Panel</Link>
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>

      {summary && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <RevenueCard
            title="Revenue This Week"
            amount={summary.week}
            description="Confirmed bookings"
          />
          <RevenueCard
            title="Revenue This Month"
            amount={summary.month}
            description="Confirmed bookings"
          />
          <RevenueCard
            title="Total Bookings"
            amount={0}
            description={`${summary.totalBookings} confirmed`}
          />
        </div>
      )}

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Courts</h2>
        </div>
        {courts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No courts assigned. Contact admin.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {courts.map((court) => (
              <Link
                key={court.id}
                to="/dashboard/courts/$id"
                params={{ id: court.id }}
                className="rounded-lg border p-4 hover:bg-muted/30 transition-colors block"
              >
                <div className="font-semibold">{court.name}</div>
                <div className="text-sm text-muted-foreground">
                  {court.locationArea}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/bookings">View All</Link>
          </Button>
        </div>
        <BookingTable bookings={upcomingBookings.slice(0, 5)} />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexPage,
});
