import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import BlockSlotModal from "#/components/dashboard/BlockSlotModal";
import BookingTable from "#/components/dashboard/BookingTable";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { apiFetch } from "#/lib/api";
import { formatCentavos } from "#/lib/format";

interface Court {
  id: string;
  name: string;
  slug: string;
  address: string;
  locationArea: string;
  hourlyRate: number;
  isActive: number;
  amenities: string[];
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

const ManageCourtPage = () => {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newRate, setNewRate] = useState("");
  const [rateSaved, setRateSaved] = useState(false);

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

  const court = courts.find((c) => c.id === id);

  const today = new Date().toISOString().split("T")[0]!;
  const { data: bookings = [] } = useQuery({
    enabled: !!court,
    queryFn: () =>
      apiFetch<BookingRow[]>(
        `/api/dashboard/courts/${id}/bookings?from=${today}`
      ),
    queryKey: ["court-bookings", id],
  });

  const updateRate = useMutation({
    mutationFn: (rate: number) =>
      apiFetch(`/api/dashboard/courts/${id}/settings`, {
        body: JSON.stringify({ hourlyRate: rate }),
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-courts"] });
      setRateSaved(true);
      setTimeout(() => setRateSaved(false), 2000);
    },
  });

  if (meError) {
    navigate({ to: "/dashboard/login" });
    return null;
  }

  if (!court) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{court.name}</h1>
        <p className="text-muted-foreground">{court.address}</p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 font-semibold">Hourly Rate</h2>
          <p className="mb-3 text-2xl font-bold text-primary">
            {formatCentavos(court.hourlyRate)}/hr
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="New rate (centavos)"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="max-w-40"
            />
            <Button
              size="sm"
              onClick={() => {
                const rate = Number.parseInt(newRate, 10);
                if (rate > 0) {
                  updateRate.mutate(rate);
                }
              }}
              disabled={updateRate.isPending || !newRate}
            >
              {rateSaved ? "Saved!" : "Update"}
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter amount in centavos (e.g., 50000 = ₱500)
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-3 font-semibold">Manage Availability</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Block specific time slots for maintenance or private events.
          </p>
          <Button onClick={() => setShowBlockModal(true)}>Block a Slot</Button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Upcoming Bookings</h2>
        <BookingTable bookings={bookings} />
      </div>

      {showBlockModal && (
        <BlockSlotModal
          courtId={id}
          onClose={() => setShowBlockModal(false)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["availability"] })
          }
        />
      )}
    </div>
  );
};

export const Route = createFileRoute("/dashboard/courts/$id")({
  component: ManageCourtPage,
});
