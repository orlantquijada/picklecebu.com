import { AlertTriangle } from "lucide-react";

export default function NoRefundNotice() {
  return (
    <div className="flex gap-3 border-l-2 border-destructive pl-4 py-1">
      <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
      <div className="text-sm">
        <p className="font-semibold text-destructive">No Refund Policy</p>
        <p className="text-muted-foreground mt-0.5">
          All bookings are final. No refunds for cancellations or no-shows.
          Verify your date and time before confirming.
        </p>
      </div>
    </div>
  );
}
