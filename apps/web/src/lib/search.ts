import type { Venue } from "./constants";
import { FEATURED_VENUES } from "./constants";
import type { SearchParams } from "./search-params";
import { getWeekendDates, resolveDate } from "./search-params";

export type TimeSlot = {
  hour: number;
  available: boolean;
};

export type SearchResult = {
  venue: Venue;
  matchingSlots: TimeSlot[];
  courtTypes: string[];
};

export type SearchResponse = {
  results: SearchResult[];
  fallback: SearchResult[] | null;
  summary: string;
};

/** Deterministic pseudo-random from string seed */
function seededRand(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate mock availability slots for a venue on a date */
function generateSlots(slug: string, date: string): TimeSlot[] {
  const rand = seededRand(`${slug}-${date}`);
  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  return hours.map((hour) => ({
    hour,
    available: rand() > 0.35, // ~65% availability
  }));
}

function getVenueCourtTypes(venue: Venue): string[] {
  const types: string[] = [];
  for (const a of venue.amenities) {
    const lower = a.toLowerCase();
    if (lower === "indoor" || lower === "outdoor" || lower === "covered") {
      types.push(lower);
    }
  }
  return types.length > 0 ? types : ["outdoor"];
}

function matchesCourtType(venue: Venue, courtType: string): boolean {
  if (courtType === "any") return true;
  return getVenueCourtTypes(venue).includes(courtType);
}

function matchesArea(venue: Venue, whereSlug: string): boolean {
  if (whereSlug === "cebu-city") return true; // Cebu City = all areas
  const venueAreaSlug = venue.area.toLowerCase().replace(/\s+/g, "-");
  return venueAreaSlug === whereSlug;
}

function filterSlotsByTime(
  slots: TimeSlot[],
  time: string,
  durationMinutes: number,
): TimeSlot[] {
  const numHours = Math.ceil(durationMinutes / 60);

  // Filter to only available slots that can fit the duration
  const valid = slots.filter((s) => {
    if (!s.available) return false;
    // Check contiguous availability
    for (let h = 0; h < numHours; h++) {
      const needed = s.hour + h;
      const slot = slots.find((sl) => sl.hour === needed);
      if (!slot?.available) return false;
    }
    return true;
  });

  if (time === "any") return valid;

  const targetHour = Number(time.split(":")[0]);

  // Sort by proximity to target time
  return valid.sort(
    (a, b) => Math.abs(a.hour - targetHour) - Math.abs(b.hour - targetHour),
  );
}

function sortResults(
  results: SearchResult[],
  sort: string,
  time: string,
): SearchResult[] {
  const sorted = [...results];
  switch (sort) {
    case "price":
      sorted.sort(
        (a, b) => a.venue.pricePerHourCentavos - b.venue.pricePerHourCentavos,
      );
      break;
    case "earliest":
      sorted.sort((a, b) => {
        const aFirst = a.matchingSlots[0]?.hour ?? 24;
        const bFirst = b.matchingSlots[0]?.hour ?? 24;
        return aFirst - bFirst;
      });
      break;
    default: {
      // "best" — prioritize: has slots > badge > proximity to requested time
      const targetHour =
        time !== "any" ? Number(time.split(":")[0]) : 12;
      sorted.sort((a, b) => {
        const aSlots = a.matchingSlots.length;
        const bSlots = b.matchingSlots.length;
        if (aSlots > 0 && bSlots === 0) return -1;
        if (bSlots > 0 && aSlots === 0) return 1;
        const aBadge = a.venue.badge ? 1 : 0;
        const bBadge = b.venue.badge ? 1 : 0;
        if (aBadge !== bBadge) return bBadge - aBadge;
        const aDist = Math.abs((a.matchingSlots[0]?.hour ?? 12) - targetHour);
        const bDist = Math.abs((b.matchingSlots[0]?.hour ?? 12) - targetHour);
        return aDist - bDist;
      });
      break;
    }
  }
  return sorted;
}

export function searchVenues(params: SearchParams): SearchResponse {
  const date = resolveDate(params);
  const allVenues = FEATURED_VENUES;

  // Filter venues
  const filtered = allVenues.filter((v) => {
    if (!matchesArea(v, params.where)) return false;
    if (!matchesCourtType(v, params.courtType)) return false;
    if (params.priceMax && v.pricePerHourCentavos / 100 > params.priceMax)
      return false;
    return true;
  });

  const dates = params.weekend ? getWeekendDates() : [date];

  // Generate availability and filter slots (merge across dates for weekend)
  const results: SearchResult[] = filtered.map((venue) => {
    const allMatching: TimeSlot[] = [];
    for (const d of dates) {
      const allSlots = generateSlots(venue.slug, d);
      const matching = filterSlotsByTime(allSlots, params.time, params.duration);
      allMatching.push(...matching);
    }
    // Dedupe by hour (keep first occurrence)
    const seen = new Set<number>();
    const unique = allMatching.filter((s) => {
      if (seen.has(s.hour)) return false;
      seen.add(s.hour);
      return true;
    });
    return {
      venue,
      matchingSlots: unique.slice(0, 5),
      courtTypes: getVenueCourtTypes(venue),
    };
  });

  // Separate venues with and without matching slots
  const withSlots = results.filter((r) => r.matchingSlots.length > 0);
  const sorted = sortResults(withSlots, params.sort, params.time);

  // Build summary
  const count = sorted.length;
  const timeDesc =
    params.time === "any"
      ? "today"
      : params.time === "18:00"
        ? "tonight"
        : `at ${params.time}`;

  if (count > 0) {
    return {
      results: sorted,
      fallback: null,
      summary: `${count} venue${count !== 1 ? "s" : ""} available ${timeDesc}`,
    };
  }

  // Fallback: relax filters and show alternatives
  const fallbackResults: SearchResult[] = allVenues.map((venue) => {
    const allSlots = generateSlots(venue.slug, date);
    const matching = filterSlotsByTime(allSlots, "any", params.duration);
    return {
      venue,
      matchingSlots: matching.slice(0, 3),
      courtTypes: getVenueCourtTypes(venue),
    };
  });

  const fallbackSorted = sortResults(
    fallbackResults.filter((r) => r.matchingSlots.length > 0),
    "best",
    "any",
  ).slice(0, 3);

  return {
    results: [],
    fallback: fallbackSorted,
    summary: buildNoResultsSummary(params),
  };
}

function buildNoResultsSummary(params: SearchParams): string {
  const parts: string[] = [];
  if (params.courtType !== "any") parts.push(`${params.courtType} courts`);
  if (params.time !== "any") parts.push(`at ${params.time}`);
  if (params.duration > 60) parts.push(`for ${params.duration / 60} hours`);
  if (params.priceMax) parts.push(`under ₱${params.priceMax}`);
  return parts.length > 0
    ? `No ${parts.join(" ")} found`
    : "No venues found";
}
