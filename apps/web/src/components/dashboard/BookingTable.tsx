import { Badge } from "#/components/ui/badge";
import { formatCentavos, formatHourRange } from "#/lib/format";

interface Booking {
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

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  cancelled: "outline",
  confirmed: "default",
  failed: "destructive",
  pending: "secondary",
};

export default function BookingTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Time</th>
            <th className="px-4 py-3 text-left font-medium">Player</th>
            <th className="px-4 py-3 text-left font-medium">Total</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-muted/20">
              <td className="px-4 py-3 font-medium">{b.bookingDate}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
