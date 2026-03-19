import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import CourtCard from "#/components/courts/CourtCard";
import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

const skeletonIds = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`;

const neonKeyframes = `
@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.05); }
  66% { transform: translate(25px, -15px) scale(0.9); }
}
@keyframes neonPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 245, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.2); }
  50% { box-shadow: 0 0 30px rgba(255, 0, 110, 0.4), 0 0 60px rgba(255, 0, 110, 0.2); }
}
`;

const NeonArenaPage = () => {
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
        "--font-display": "'Chakra Petch', sans-serif",
        fontFamily: "'IBM Plex Sans', sans-serif",
        background: "#0A0A0F",
        color: "#e0e0e0",
      } as React.CSSProperties}
    >
      <style>{fontImport}{neonKeyframes}</style>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: "80vh" }}>
        {/* Animated orbs */}
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, transparent 70%)",
            top: "-10%",
            left: "-5%",
            animation: "orbFloat1 12s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 0, 110, 0.12) 0%, transparent 70%)",
            bottom: "-5%",
            right: "-3%",
            animation: "orbFloat2 10s ease-in-out infinite",
          }}
        />

        {/* 45° grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(45deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(255, 0, 110, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-28 sm:py-36 text-center">
          <div
            style={{
              background: "rgba(0, 245, 255, 0.08)",
              border: "1px solid rgba(0, 245, 255, 0.2)",
              color: "#00F5FF",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
            className="mb-8 inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium"
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00F5FF",
                boxShadow: "0 0 8px #00F5FF",
              }}
              className="inline-block"
            />
            LIVE — Courts Available Now
          </div>

          <h1
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              background: "linear-gradient(135deg, #00F5FF 0%, #FF006E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            className="mb-5 text-5xl font-bold tracking-tight sm:text-8xl leading-none uppercase"
          >
            Play
            <br />
            Pickle
          </h1>
          <p
            style={{ color: "rgba(224, 224, 224, 0.6)" }}
            className="mx-auto max-w-lg text-lg leading-relaxed"
          >
            Book courts across Cebu. Real-time availability. Instant
            confirmation. No waiting.
          </p>
          <div className="mt-10">
            <a
              href="#courts"
              style={{
                background: "linear-gradient(135deg, #00F5FF, #FF006E)",
                animation: "neonPulse 3s ease-in-out infinite",
              }}
              className="inline-block rounded-md px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105"
            >
              Find a Court
            </a>
          </div>
        </div>
      </div>

      {/* Courts Section */}
      <div id="courts" className="pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <h2
            style={{
              fontFamily: "'IBM Plex Sans', monospace",
              color: "rgba(0, 245, 255, 0.5)",
            }}
            className="mb-8 text-sm font-medium tracking-wider"
          >
            {"// Available Courts"}
          </h2>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skeletonIds.map((id) => (
                <div
                  key={id}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(0, 245, 255, 0.1)",
                  }}
                  className="aspect-[4/3] animate-pulse rounded-xl"
                />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(255, 0, 110, 0.08)",
                border: "1px solid rgba(255, 0, 110, 0.3)",
                color: "#FF006E",
              }}
              className="rounded-lg p-6 text-center"
            >
              Failed to load courts. Please try again.
            </div>
          )}

          {courts && courts.length === 0 && (
            <div
              style={{
                border: "1px dashed rgba(0, 245, 255, 0.2)",
                color: "rgba(224, 224, 224, 0.4)",
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
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(0, 245, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "2px",
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
    </div>
  );
};

export const Route = createFileRoute("/v4")({ component: NeonArenaPage });
