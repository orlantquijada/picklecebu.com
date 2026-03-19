import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import CourtCard from "#/components/courts/CourtCard";
import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

const skeletonIds = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');`;

const openCourtKeyframes = `
@keyframes gentleRise {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const trustItems = [
  { icon: "✓", label: "Instant Confirmation" },
  { icon: "🔒", label: "Secure Payment" },
  { icon: "★", label: "Best Prices" },
];

const OpenCourtPage = () => {
  const {
    data: courts,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => apiFetch<Court[]>("/api/courts"),
    queryKey: ["courts"],
  });

  return (
    <div
      style={{
        "--font-display": "'Plus Jakarta Sans', sans-serif",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#FFFFFF",
        color: "#1A202C",
      } as React.CSSProperties}
    >
      <style>{fontImport}{openCourtKeyframes}</style>

      {/* Hero */}
      <div
        className="relative"
        style={{ minHeight: "80vh", background: "#FFFFFF" }}
      >
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-32 sm:py-40 text-center">
          {/* Trust badge */}
          <div
            style={{
              background: "#F1F3F5",
              color: "#4A5568",
            }}
            className="mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ color: "#1B4FD8" }}
            >
              <path
                d="M8 1L2 4v4c0 3.5 2.6 6.4 6 7 3.4-.6 6-3.5 6-7V4L8 1z"
                fill="currentColor"
                opacity="0.15"
              />
              <path
                d="M8 1L2 4v4c0 3.5 2.6 6.4 6 7 3.4-.6 6-3.5 6-7V4L8 1z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
              <path d="M5.5 8L7.2 9.7L10.5 6.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Trusted by Cebu Players
          </div>

          <h1
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="mb-4 text-5xl font-bold tracking-tight sm:text-7xl leading-[1.1]"
          >
            <span style={{ color: "#1B4FD8" }}>Book Pickleball Courts</span>
            <br />
            <span style={{ color: "#1A202C" }}>in Cebu, Instantly</span>
          </h1>

          <p
            style={{ color: "#718096" }}
            className="mx-auto mt-4 max-w-lg text-lg leading-relaxed"
          >
            Find available courts near you, pick your time, and confirm your booking in seconds.
          </p>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: "#4A5568" }}>
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span style={{ color: "#1B4FD8" }}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#courts"
              style={{
                background: "#1B4FD8",
                color: "#FFFFFF",
              }}
              className="inline-block rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
            >
              Browse Courts
            </a>
            <a
              href="#courts"
              style={{ color: "#E85D4A" }}
              className="text-sm font-medium hover:underline"
            >
              How it works &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Courts Section */}
      <div id="courts" style={{ background: "#F8F9FB" }} className="pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-16">
          <h2
            style={{ color: "#1A202C" }}
            className="mb-2 text-2xl font-bold"
          >
            Available Courts
          </h2>
          <p style={{ color: "#718096" }} className="mb-8 text-sm">
            Choose a court and book your slot today.
          </p>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skeletonIds.map((id) => (
                <div
                  key={id}
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                  className="aspect-[4/3] animate-pulse rounded-xl"
                />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#FFF5F5",
                border: "1px solid #FED7D7",
                color: "#E53E3E",
              }}
              className="rounded-lg p-6 text-center"
            >
              Failed to load courts. Please try again.
            </div>
          )}

          {courts && courts.length === 0 && (
            <div
              style={{
                border: "1px dashed #CBD5E0",
                color: "#A0AEC0",
              }}
              className="rounded-lg p-12 text-center"
            >
              No courts available yet. Check back soon.
            </div>
          )}

          {courts && courts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courts.map((court, i) => (
                <div
                  key={court.id}
                  style={
                    {
                      "--card": "#FFFFFF",
                      "--card-foreground": "#1A202C",
                      "--border": "#E2E8F0",
                      "--foreground": "#1A202C",
                      "--muted": "#F1F3F5",
                      "--muted-foreground": "#718096",
                      "--primary": "#1B4FD8",
                      "--primary-foreground": "#FFFFFF",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      borderRadius: "12px",
                      animation: "gentleRise 0.4s ease-out both",
                      animationDelay: `${i * 0.08}s`,
                    } as React.CSSProperties
                  }
                >
                  <CourtCard court={court} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/v6")({ component: OpenCourtPage });
