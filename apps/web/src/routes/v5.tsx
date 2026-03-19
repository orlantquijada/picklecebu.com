import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import CourtCard from "#/components/courts/CourtCard";
import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

const skeletonIds = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,800;1,600&family=Inter:wght@400;500&display=swap');`;

const rushKeyframes = `
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 16px rgba(0, 200, 83, 0.5), 0 0 40px rgba(0, 200, 83, 0.15); }
  50% { box-shadow: 0 0 24px rgba(0, 200, 83, 0.7), 0 0 60px rgba(0, 200, 83, 0.25); }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const CourtRushPage = () => {
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
        "--font-display": "'Barlow Condensed', sans-serif",
        fontFamily: "'Inter', sans-serif",
        background: "#0D0D0D",
        color: "#FFFFFF",
        minHeight: "100vh",
      } as React.CSSProperties}
    >
      <style>{fontImport}{rushKeyframes}</style>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: "85vh" }}>
        {/* Diagonal green stripe */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "60%",
            height: "140%",
            background: "linear-gradient(135deg, rgba(0, 200, 83, 0.12) 0%, rgba(0, 200, 83, 0.04) 100%)",
            transform: "rotate(-15deg)",
          }}
        />

        {/* Volt yellow court-line grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(0deg, rgba(232, 255, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232, 255, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:py-40">
          {/* Badge */}
          <div
            style={{
              background: "rgba(232, 255, 0, 0.1)",
              border: "1px solid rgba(232, 255, 0, 0.3)",
              color: "#E8FF00",
              fontFamily: "'Inter', sans-serif",
            }}
            className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium uppercase tracking-wider"
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#E8FF00",
                animation: "pulseDot 1.5s ease-in-out infinite",
              }}
              className="inline-block"
            />
            Courts Filling Fast
          </div>

          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-6xl font-extrabold uppercase tracking-tight sm:text-9xl leading-[0.9]"
          >
            <span style={{ color: "#FFFFFF" }}>Cebu's Courts</span>
            <br />
            <span style={{ color: "#00C853" }}>Are Calling</span>
          </h1>

          <div className="mt-12">
            <a
              href="#courts"
              style={{
                background: "#00C853",
                color: "#0D0D0D",
                animation: "glowPulse 2.5s ease-in-out infinite",
              }}
              className="inline-block rounded-full px-10 py-4 text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105"
            >
              Book a Court Now
            </a>
          </div>
        </div>
      </div>

      {/* Courts Section */}
      <div id="courts" className="pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontStyle: "italic",
              color: "#E8FF00",
            }}
            className="mb-8 text-sm font-semibold uppercase tracking-widest"
          >
            Available Now
          </h2>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skeletonIds.map((id) => (
                <div
                  key={id}
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid rgba(232, 255, 0, 0.08)",
                  }}
                  className="aspect-[4/3] animate-pulse rounded-xl"
                />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(255, 50, 50, 0.08)",
                border: "1px solid rgba(255, 50, 50, 0.3)",
                color: "#FF5252",
              }}
              className="rounded-lg p-6 text-center"
            >
              Failed to load courts. Please try again.
            </div>
          )}

          {courts && courts.length === 0 && (
            <div
              style={{
                border: "1px dashed rgba(232, 255, 0, 0.15)",
                color: "rgba(255, 255, 255, 0.35)",
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
                      "--card": "#1A1A1A",
                      "--card-foreground": "#FFFFFF",
                      "--border": "rgba(255, 255, 255, 0.08)",
                      "--foreground": "#FFFFFF",
                      "--muted": "#2A2A2A",
                      "--muted-foreground": "rgba(255, 255, 255, 0.5)",
                      "--primary": "#00C853",
                      "--primary-foreground": "#0D0D0D",
                      borderRadius: "12px",
                      animation: "slideUp 0.4s ease-out both",
                      animationDelay: `${i * 0.1}s`,
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

export const Route = createFileRoute("/v5")({ component: CourtRushPage });
