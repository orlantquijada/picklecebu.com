import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { PhotoGallery } from "#/components/venue/photo-gallery";
import { VenueHeader } from "#/components/venue/venue-header";
import {
  BookingSidebar,
  MobileBookingBar,
} from "#/components/venue/booking-sidebar";
import { SectionNav } from "#/components/venue/section-nav";
import { AboutSection } from "#/components/venue/about-section";
import { CourtsSection } from "#/components/venue/courts-section";
import { AmenitiesSection } from "#/components/venue/amenities-section";
import { LocationSection } from "#/components/venue/location-section";
import { RulesSection } from "#/components/venue/rules-section";
import { useCourtQuery, useAvailabilityQuery } from "#/lib/queries";

const venueSearchSchema = z.object({
  date: z.string().optional(),
  start: z.string().optional(),
  duration: z.string().optional(),
});

function VenueDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8 lg:pb-16">
      <div className="aspect-[21/9] animate-pulse rounded-xl bg-muted" />
      <div className="mt-6 space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

function VenueDetailPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const today = new Date().toISOString().slice(0, 10);
  const date = search.date ?? today;

  const { data: court, isPending, isError } = useCourtQuery(slug);
  useAvailabilityQuery(slug, date);

  if (isPending) return <VenueDetailSkeleton />;

  if (isError || !court) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Venue not found</h1>
        <p className="mt-2 text-muted-foreground">
          The venue you're looking for doesn't exist.
        </p>
        <a href="/" className="mt-4 inline-block text-sm underline">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8 lg:pb-16">
        {/* Photo gallery */}
        <PhotoGallery />

        {/* Venue header + sidebar start together */}
        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <VenueHeader court={court} />
            <div className="mt-6">
              <SectionNav />
            </div>
            {/* Content sections */}
            <div className="mt-8 space-y-8">
              <AboutSection court={court} />
              <CourtsSection court={court} />
              <AmenitiesSection court={court} />
              <LocationSection court={court} />
              <RulesSection court={court} />
            </div>
          </div>

          {/* Right column — sticky booking sidebar, starts at venue header level */}
          <div className="hidden lg:block">
            <BookingSidebar court={court} booking={search} />
          </div>
        </div>
      </div>
      <MobileBookingBar court={court} />
    </>
  );
}

export const Route = createFileRoute("/_layout/venues/$slug")({
  component: VenueDetailPage,
  validateSearch: (search) => venueSearchSchema.parse(search),
});
