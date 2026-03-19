import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import BookingTable from "#/components/dashboard/BookingTable";
import { apiFetch } from "#/lib/api";

interface Court {
  id: string;
  name: string;
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

const getMe = () =>
  apiFetch<{ id: string; role: string; name: string }>("/api/auth/me");

const BookingsPage = () => {
  const navigate = useNavigate();
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const { data: me, error: meError } = useQuery({
    queryFn: getMe,
    queryKey: ["auth-me"],
    retry: false,
  });

  const { data: courts = [] } = useQuery({
    enabled: !!me,
    queryFn: () => apiFetch<Court[]>("/api/dashboard/courts"),
    queryKey: ["dashboard-courts"],
  });

  const courtId = selectedCourtId ?? courts[0]?.id;

  const { data: bookings = [], isLoading } = useQuery({
    enabled: !!courtId,
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter) {
        params.set("status", statusFilter);
      }
      return apiFetch<BookingRow[]>(
        `/api/dashboard/courts/${courtId}/bookings?${params}`
      );
    },
    queryKey: ["all-bookings", courtId, statusFilter],
  });

  if (meError) {
    navigate({ to: "/dashboard/login" });
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Booking History</h1>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        {courts.length > 1 && (
          <select
            value={courtId}
            onChange={(e) => setSelectedCourtId(e.target.value)}
            className="rounded-md border border-input px-3 py-1.5 text-sm"
          >
            {courts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input px-3 py-1.5 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="animate-pulse rounded-lg bg-muted h-48" />
      ) : (
        <BookingTable bookings={bookings} />
      )}
    </div>
  );
};

export const Route = createFileRoute("/dashboard/bookings")({
  component: BookingsPage,
});
