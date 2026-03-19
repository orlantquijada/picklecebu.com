import { formatCentavos } from "#/lib/format";

interface Props {
  subtotal: number;
  convenienceFee: number;
  total: number;
}

export default function BookingTotal({
  subtotal,
  convenienceFee,
  total,
}: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>Court fee</span>
        <span>{formatCentavos(subtotal)}</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Convenience fee</span>
        <span>{formatCentavos(convenienceFee)}</span>
      </div>
      <div className="border-t border-border pt-3 flex justify-between items-baseline">
        <span className="font-semibold text-foreground">Total</span>
        <span
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-bold text-primary"
        >
          {formatCentavos(total)}
        </span>
      </div>
    </div>
  );
}
