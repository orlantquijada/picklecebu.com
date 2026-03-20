import { createFileRoute } from "@tanstack/react-router";

import { Header } from "#/components/landing/header";
import { Footer } from "#/components/landing/footer";
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
import { VENUE_DETAILS } from "#/lib/constants";

function VenueDetailPage() {
  const { slug } = Route.useParams();
  const venue = VENUE_DETAILS[slug];

  if (!venue) {
    return (
      <>
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Venue not found</h1>
          <p className="mt-2 text-muted-foreground">
            The venue you're looking for doesn't exist.
          </p>
          <a href="/" className="mt-4 inline-block text-sm underline">
            Back to home
          </a>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8 lg:pb-16">
        {/* Photo gallery */}
        <PhotoGallery />

        {/* Venue header + sidebar start together */}
        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <VenueHeader venue={venue} />
            <div className="mt-6">
              <SectionNav />
            </div>
            {/* Content sections */}
            <div className="mt-8 space-y-8">
              <AboutSection venue={venue} />
              <CourtsSection venue={venue} />
              <AmenitiesSection venue={venue} />
              <LocationSection venue={venue} />
              <RulesSection venue={venue} />
            </div>
          </div>

          {/* Right column — sticky booking sidebar, starts at venue header level */}
          <div className="hidden lg:block">
            <BookingSidebar venue={venue} />
          </div>
        </div>
      </div>
      <MobileBookingBar venue={venue} />
      <Footer />
    </>
  );
}

export const Route = createFileRoute("/venues/$slug")({
  component: VenueDetailPage,
});
