import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import CourtCard from "#/components/courts/CourtCard";
import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

const skeletonIds = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Libre+Franklin:wght@400;500;600&display=swap');`;

const fadeInKeyframes = `
@keyframes editorialFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const EditorialLuxePage = () => {
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
        "--font-display": "'Playfair Display', serif",
        fontFamily: "'Libre Franklin', sans-serif",
      } as React.CSSProperties}
    >
      <style>{fontImport}{fadeInKeyframes}</style>

      {/* Hero */}
      <div
        style={{ background: "#1B4332", minHeight: "70vh" }}
        className="relative flex items-end overflow-hidden"
      >
        {/* Subtle pattern overlay */}
        <div
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201, 162, 39, 0.06) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
          className="absolute inset-0"
        />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-10 pb-16 pt-32 sm:pt-40">
          <p
            style={{
              color: "#C9A227",
              fontFamily: "'Libre Franklin', sans-serif",
              letterSpacing: "0.2em",
            }}
            className="mb-4 text-xs font-semibold uppercase"
          >
            Cebu&apos;s Finest Courts
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#FAF8F5",
              fontStyle: "italic",
            }}
            className="mb-6 text-5xl font-bold sm:text-7xl leading-[1.1] max-w-3xl"
          >
            The Art of
            <br />
            Pickleball
          </h1>
          <hr
            style={{
              border: "none",
              borderTop: "2px solid #C9A227",
              width: "80px",
            }}
            className="mb-6"
          />
          <p
            style={{ color: "rgba(250, 248, 245, 0.7)" }}
            className="max-w-lg text-lg leading-relaxed"
          >
            Reserve premium courts across Cebu. A curated selection for
            discerning players who expect excellence.
          </p>
          <div className="mt-10">
            <a
              href="#courts"
              style={{
                color: "#C9A227",
                borderColor: "#C9A227",
                letterSpacing: "0.15em",
              }}
              className="inline-block border px-8 py-3 text-xs font-semibold uppercase transition-all hover:bg-[#C9A227] hover:text-[#1B4332]"
            >
              View Collection
            </a>
          </div>
        </div>
      </div>

      {/* Courts Section */}
      <div
        id="courts"
        style={{ background: "#FAF8F5" }}
        className="py-20"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mb-12">
            <p
              style={{
                color: "#C9A227",
                letterSpacing: "0.2em",
              }}
              className="mb-3 text-xs font-semibold uppercase"
            >
              Our Selection
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1B4332",
                fontStyle: "italic",
              }}
              className="text-4xl font-bold"
            >
              Available Courts
            </h2>
            <hr
              style={{
                border: "none",
                borderTop: "2px solid #C9A227",
                width: "60px",
              }}
              className="mt-4"
            />
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {skeletonIds.map((id) => (
                <div
                  key={id}
                  className="aspect-[4/3] animate-pulse rounded-lg"
                  style={{
                    background: "rgba(27, 67, 50, 0.05)",
                    border: "1px solid rgba(27, 67, 50, 0.1)",
                  }}
                />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(180, 50, 50, 0.05)",
                border: "1px solid rgba(180, 50, 50, 0.2)",
                color: "#8B3A3A",
              }}
              className="rounded-lg p-6 text-center"
            >
              Failed to load courts. Please try again.
            </div>
          )}

          {courts && courts.length === 0 && (
            <div
              style={{
                border: "1px dashed rgba(27, 67, 50, 0.2)",
                color: "#1B4332",
              }}
              className="rounded-lg p-12 text-center opacity-60"
            >
              No courts available yet. Check back soon.
            </div>
          )}

          {courts && courts.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {courts.map((court, i) => (
                <div
                  key={court.id}
                  style={{
                    animation: `editorialFadeIn 0.6s ease-out both`,
                    animationDelay: `${i * 0.12}s`,
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

export const Route = createFileRoute("/v3")({ component: EditorialLuxePage });
