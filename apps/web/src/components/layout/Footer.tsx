export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-0">
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="text-lg font-black text-primary"
            >
              PICKLE
            </span>
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="text-lg font-black text-foreground"
            >
              CEBU
            </span>
            <span className="ml-2 text-muted-foreground">
              — Cebu's Pickleball Booking Platform
            </span>
          </div>
          <span className="text-xs text-destructive font-medium">
            No Refund Policy: All bookings are final.
          </span>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PickleCebu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
