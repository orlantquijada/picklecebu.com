import { createFileRoute } from "@tanstack/react-router";

import { BrowseAreas } from "#/components/landing/browse-areas";
import { FeaturedVenues } from "#/components/landing/featured-venues";
import { FinalCta } from "#/components/landing/final-cta";
import { ForCourtOwners } from "#/components/landing/for-court-owners";
import { Hero } from "#/components/landing/hero";
import { HowItWorks } from "#/components/landing/how-it-works";
import { WhyPickleCebu } from "#/components/landing/why-picklecebu";

const HomePage = () => (
  <>
    <Hero />
    <BrowseAreas />
    <FeaturedVenues />
    <WhyPickleCebu />
    <HowItWorks />
    <ForCourtOwners />
    <FinalCta />
  </>
);

export const Route = createFileRoute("/_layout/")({ component: HomePage });
