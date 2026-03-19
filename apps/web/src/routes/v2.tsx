import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import CourtCard from "#/components/courts/CourtCard";
import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

const skeletonIds = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=Source+Sans+3:wght@400;500;600&display=swap');`;

const floatKeyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}
`;

function PickleballSvg({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill="#FF6B6B" opacity="0.15" />
      <circle cx="24" cy="24" r="22" stroke="#FF6B6B" strokeWidth="1.5" opacity="0.3" />
      <circle cx="16" cy="16" r="2.5" fill="#FF6B6B" opacity="0.25" />
      <circle cx="30" cy="14" r="2.5" fill="#FF6B6B" opacity="0.25" />
      <circle cx="20" cy="28" r="2.5" fill="#FF6B6B" opacity="0.25" />
      <circle cx="34" cy="26" r="2.5" fill="#FF6B6B" opacity="0.25" />
      <circle cx="24" cy="36" r="2.5" fill="#FF6B6B" opacity="0.25" />
    </svg>
  );
}

const TropicalDaylightPage = () => {
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
        "--font-display": "'Outfit', sans-serif",
        "--color-primary": "#FF6B6B",
        "--color-accent": "#2EC4B6",
        fontFamily: "'Source Sans 3', sans-serif",
      } as React.CSSProperties}
    >
      <style>{fontImport}{floatKeyframes}</style>

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #F7EDE2 40%, #d4f5f0 100%)",
        }}
        className="relative overflow-hidden"
      >
        {/* Floating pickleballs */}
        <PickleballSvg
          className="absolute w-16 h-16 opacity-60"
          style={{ top: "10%", left: "8%", animation: "float 6s ease-in-out infinite" }}
        />
        <PickleballSvg
          className="absolute w-12 h-12 opacity-40"
          style={{ top: "20%", right: "12%", animation: "float 8s ease-in-out 1s infinite" }}
        />
        <PickleballSvg
          className="absolute w-20 h-20 opacity-30"
          style={{ bottom: "15%", left: "15%", animation: "float 7s ease-in-out 2s infinite" }}
        />
        <PickleballSvg
          className="absolute w-10 h-10 opacity-50"
          style={{ bottom: "25%", right: "20%", animation: "float 5s ease-in-out 0.5s infinite" }}
        />

        <div className="mx-auto max-w-7xl px-4 py-24 sm:py-32 text-center relative z-10">
          <div
            style={{
              background: "rgba(46, 196, 182, 0.1)",
              border: "1px solid rgba(46, 196, 182, 0.3)",
              color: "#2EC4B6",
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
          >
            <span>🏓</span>
            Cebu's Premier Pickleball Courts
          </div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              color: "#1a1a2e",
            }}
            className="mb-5 text-5xl font-black tracking-tight sm:text-7xl leading-none"
          >
            Your Court is
            <br />
            <span style={{ color: "#FF6B6B" }}>Waiting.</span>
          </h1>
          <p
            style={{ color: "#5a5a7a" }}
            className="mx-auto max-w-xl text-lg leading-relaxed"
          >
            Book premium pickleball courts across Cebu City, Mandaue, and
            Lapu-Lapu. Simple booking, instant confirmation.
          </p>
          <div className="mt-8">
            <a
              href="#courts"
              style={{
                background: "#FF6B6B",
                boxShadow: "0 4px 20px rgba(255, 107, 107, 0.35)",
              }}
              className="inline-block rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              Browse Courts
            </a>
          </div>
        </div>
      </div>

      {/* Diagonal divider */}
      <div
        style={{
          background: "#F7EDE2",
          transform: "skewY(-3deg)",
          marginTop: "-3rem",
          height: "6rem",
        }}
      />

      {/* Courts Section */}
      <div
        id="courts"
        style={{ background: "#F7EDE2" }}
        className="pb-16"
      >
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              color: "#1a1a2e",
            }}
            className="mb-8 text-3xl font-bold tracking-wide"
          >
            Available Courts
          </h2>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skeletonIds.map((id) => (
                <div
                  key={id}
                  className="aspect-[4/3] animate-pulse rounded-xl"
                  style={{
                    background: "rgba(255, 107, 107, 0.08)",
                    border: "1px solid rgba(255, 107, 107, 0.15)",
                  }}
                />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(255, 107, 107, 0.1)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                color: "#FF6B6B",
              }}
              className="rounded-lg p-6 text-center"
            >
              Failed to load courts. Please try again.
            </div>
          )}

          {courts && courts.length === 0 && (
            <div
              style={{
                border: "2px dashed rgba(255, 107, 107, 0.3)",
                color: "#5a5a7a",
              }}
              className="rounded-lg p-12 text-center"
            >
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
                    filter: "drop-shadow(0 4px 12px rgba(255, 107, 107, 0.1))",
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

export const Route = createFileRoute("/v2")({ component: TropicalDaylightPage });
