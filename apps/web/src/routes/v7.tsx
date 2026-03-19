import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import CourtCard from "#/components/courts/CourtCard";
import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

const skeletonIds = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,700&display=swap');`;

const smashKeyframes = `
@keyframes playfulStagger {
  from { opacity: 0; transform: translateY(20px) rotate(-1deg); }
  to { opacity: 1; transform: translateY(0) rotate(0deg); }
}
`;

const neighborhoods = ["Mandaue", "Cebu City", "Lapu-Lapu", "IT Park"];

const CebuSmashPage = () => {
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
        "--font-display": "'Syne', sans-serif",
        fontFamily: "'DM Sans', sans-serif",
        background: "#FDFAF6",
        color: "#2D1B0E",
        minHeight: "100vh",
      } as React.CSSProperties}
    >
      <style>{fontImport}{smashKeyframes}</style>

      {/* Hero */}
      <div
        className="relative"
        style={{ minHeight: "80vh", background: "#FDFAF6" }}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-28 sm:py-36">
          {/* Top label */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#F26419",
            }}
            className="mb-4 text-lg sm:text-xl"
          >
            Laro Na, Cebu!
          </p>

          <h1
            style={{ fontFamily: "'Syne', sans-serif", color: "#2D1B0E" }}
            className="text-5xl font-extrabold tracking-tight sm:text-8xl leading-[1.05]"
          >
            Play{" "}
            <span style={{ color: "#4CAF50" }}>Pickle,</span>
            <br />
            Meet Your
            <br />
            Neighbors
          </h1>

          {/* Neighborhood pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {neighborhoods.map((n) => (
              <span
                key={n}
                style={{
                  background: "#FFE8D6",
                  color: "#F26419",
                }}
                className="rounded-full px-4 py-1.5 text-sm font-medium"
              >
                {n}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <a
              href="#courts"
              style={{
                background: "#F26419",
                color: "#FFFFFF",
              }}
              className="inline-block rounded-full px-10 py-4 text-sm font-bold transition-all hover:opacity-90 hover:shadow-lg"
            >
              Find Courts Near You
            </a>
          </div>
        </div>

        {/* SVG wave divider */}
        <div className="absolute inset-x-0 bottom-0" style={{ lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "60px" }}
          >
            <path
              d="M0 40C240 70 480 10 720 40C960 70 1200 10 1440 40V80H0V40Z"
              fill="#FFF1E6"
            />
          </svg>
        </div>
      </div>

      {/* Courts Section */}
      <div id="courts" style={{ background: "#FFF1E6" }} className="pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-12">
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              color: "#2D1B0E",
            }}
            className="mb-1 text-2xl font-bold"
          >
            Courts Near You
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontStyle: "italic",
              color: "#8B6F47",
            }}
            className="mb-8 text-sm"
          >
            Pick your spot, grab your paddle, and see you on the court.
          </p>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skeletonIds.map((id) => (
                <div
                  key={id}
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0 2px 8px rgba(45, 27, 14, 0.06)",
                  }}
                  className="aspect-[4/3] animate-pulse rounded-xl"
                />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#FFF5F0",
                border: "1px solid #FDDCC8",
                color: "#D84315",
              }}
              className="rounded-lg p-6 text-center"
            >
              Failed to load courts. Please try again.
            </div>
          )}

          {courts && courts.length === 0 && (
            <div
              style={{
                border: "1px dashed #D4B896",
                color: "#8B6F47",
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
                      "--card-foreground": "#2D1B0E",
                      "--border": "#E8D5C0",
                      "--foreground": "#2D1B0E",
                      "--muted": "#FFF5EB",
                      "--muted-foreground": "#8B6F47",
                      "--primary": "#F26419",
                      "--primary-foreground": "#FFFFFF",
                      boxShadow: "0 2px 8px rgba(45, 27, 14, 0.08)",
                      borderRadius: "12px",
                      animation: "playfulStagger 0.5s ease-out both",
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

export const Route = createFileRoute("/v7")({ component: CebuSmashPage });
