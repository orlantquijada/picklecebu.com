import { formatHour } from "#/lib/format";

interface Slot {
  hour: number;
  available: boolean;
}

interface Props {
  slots: Slot[];
  selectedStart: number | null;
  selectedHours: number;
  onSelectHour: (hour: number) => void;
}

const CourtAvailabilityGrid = ({
  slots,
  selectedStart,
  selectedHours,
  onSelectHour,
}: Props) => {
  const isSelected = (hour: number) => {
    if (selectedStart === null) {
      return false;
    }
    return hour >= selectedStart && hour < selectedStart + selectedHours;
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-card border border-border" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-muted/40 opacity-40" />
          Taken
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
          Selected
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7 lg:grid-cols-13">
        {slots.map(({ hour, available }) => {
          const selected = isSelected(hour);
          const availableClass = available
            ? "bg-card border border-border text-foreground hover:border-primary hover:text-primary cursor-pointer"
            : "bg-muted/30 text-muted-foreground/40 border border-border/30 cursor-not-allowed";
          return (
            <button
              key={hour}
              type="button"
              disabled={!available}
              onClick={() => available && onSelectHour(hour)}
              style={
                selected
                  ? { animation: "court-pulse 0.4s ease-out" }
                  : undefined
              }
              className={[
                "rounded-md py-2.5 text-center text-xs font-medium transition-all duration-150",
                selected
                  ? "bg-primary text-primary-foreground border border-primary"
                  : availableClass,
              ].join(" ")}
            >
              {formatHour(hour)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CourtAvailabilityGrid;
