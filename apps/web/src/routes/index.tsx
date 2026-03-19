import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import CourtCard from "#/components/courts/CourtCard";
import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

const skeletonIds = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

const HomePage = () => {
  const {
    data: courts,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => apiFetch<Court[]>("/api/courts"),
    queryKey: ["courts"],
  });

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-card court-pattern-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28 text-center relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 1 Q11 5.5 8 8 Q5 10.5 8 15"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M1 8 Q5.5 5 8 8 Q10.5 11 15 8"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            Cebu's #1 Pickleball Booking Platform
          </div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="mb-4 text-5xl font-black tracking-tight text-foreground sm:text-7xl uppercase leading-none"
          >
            Book a Court.
            <br />
            <span className="text-primary">Play Today.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Find and reserve the best pickleball courts across Cebu City,
            Mandaue, and Lapu-Lapu. Pay securely with GCash, Maya, or card.
          </p>
        </div>
        {/* Bottom fade to background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Courts */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="mb-8 text-3xl font-bold uppercase tracking-wide text-foreground"
        >
          Available Courts
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skeletonIds.map((id) => (
              <div
                key={id}
                className="aspect-[4/3] animate-pulse rounded-xl bg-card border border-border"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
            Failed to load courts. Please try again.
          </div>
        )}

        {courts && courts.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No courts available yet. Check back soon!
          </div>
        )}

        {courts && courts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courts.map((court, i) => (
              <div
                key={court.id}
                style={{
                  animation: "stagger-in 0.4s ease-out both",
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <CourtCard court={court} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({ component: HomePage });
