import { Minus, Plus } from "lucide-react";

import { formatHour, formatCentavos } from "#/lib/format";

interface Props {
  selectedStart: number | null;
  selectedHours: number;
  hourlyRate: number;
  onChangeHours: (hours: number) => void;
  maxHours: number;
}

export default function SlotPicker({
  selectedStart,
  selectedHours,
  hourlyRate,
  onChangeHours,
  maxHours,
}: Props) {
  if (selectedStart === null) {
    return (
      <div className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
        Select a time slot above to begin
      </div>
    );
  }

  const endHour = selectedStart + selectedHours;
  const subtotal = hourlyRate * selectedHours;
  const total = subtotal + 5000;

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
      {/* Large time display */}
      <div className="text-center">
        <div
          style={{ fontFamily: "var(--font-display)" }}
          className="text-3xl font-bold text-primary tracking-wide"
        >
          {formatHour(selectedStart)} – {formatHour(endHour)}
        </div>
      </div>

      {/* Hours stepper */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onChangeHours(Math.max(1, selectedHours - 1))}
          disabled={selectedHours <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="text-sm text-muted-foreground">
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-bold text-foreground"
          >
            {selectedHours}
          </span>{" "}
          {selectedHours === 1 ? "hour" : "hours"}
        </span>
        <button
          type="button"
          onClick={() => onChangeHours(Math.min(maxHours, selectedHours + 1))}
          disabled={selectedHours >= maxHours}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Price breakdown */}
      <div className="border-t border-border pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Court fee</span>
          <span>{formatCentavos(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Convenience fee</span>
          <span>₱50</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
          <span>Total</span>
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-xl text-primary"
          >
            {formatCentavos(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
