import type { ApiCourt, TimeSlot } from "./api";
import type { SearchParams } from "./search-params";

export type { TimeSlot };

export type SearchResult = {
  court: ApiCourt;
  matchingSlots: TimeSlot[];
  courtTypes: string[];
};

export type SearchResponse = {
  results: SearchResult[];
  fallback: SearchResult[] | null;
  summary: string;
};

function getCourtTypes(court: ApiCourt): string[] {
  const types: string[] = [];
  for (const a of court.amenities) {
    const lower = a.toLowerCase();
    if (lower === "indoor" || lower === "outdoor" || lower === "covered") {
      types.push(lower);
    }
  }
  return types.length > 0 ? types : ["outdoor"];
}

function matchesCourtType(court: ApiCourt, courtType: string): boolean {
  if (courtType === "any") return true;
  return getCourtTypes(court).includes(courtType);
}

function matchesArea(court: ApiCourt, whereSlug: string): boolean {
  if (whereSlug === "cebu-city") return true;
  const areaSlug = court.locationArea.toLowerCase().replace(/\s+/g, "-");
  return areaSlug === whereSlug;
}

function filterSlotsByTime(
  slots: TimeSlot[],
  time: string,
  durationMinutes: number,
): TimeSlot[] {
  const numHours = Math.ceil(durationMinutes / 60);

  const valid = slots.filter((s) => {
    if (!s.available) return false;
    for (let h = 0; h < numHours; h++) {
      const needed = s.hour + h;
      const slot = slots.find((sl) => sl.hour === needed);
      if (!slot?.available) return false;
    }
    return true;
  });

  if (time === "any") return valid;

  const targetHour = Number(time.split(":")[0]);

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
      sorted.sort((a, b) => a.court.hourlyRate - b.court.hourlyRate);
      break;
    case "earliest":
      sorted.sort((a, b) => {
        const aFirst = a.matchingSlots[0]?.hour ?? 24;
        const bFirst = b.matchingSlots[0]?.hour ?? 24;
        return aFirst - bFirst;
      });
      break;
    default: {
      const targetHour = time !== "any" ? Number(time.split(":")[0]) : 12;
      sorted.sort((a, b) => {
        const aSlots = a.matchingSlots.length;
        const bSlots = b.matchingSlots.length;
        if (aSlots > 0 && bSlots === 0) return -1;
        if (bSlots > 0 && aSlots === 0) return 1;
        const aDist = Math.abs((a.matchingSlots[0]?.hour ?? 12) - targetHour);
        const bDist = Math.abs((b.matchingSlots[0]?.hour ?? 12) - targetHour);
        return aDist - bDist;
      });
      break;
    }
  }
  return sorted;
}

export function searchCourts(
  allCourts: ApiCourt[],
  slots: Map<string, TimeSlot[]>,
  params: SearchParams,
): SearchResponse {
  const filtered = allCourts.filter((c) => {
    if (!matchesArea(c, params.where)) return false;
    if (!matchesCourtType(c, params.courtType)) return false;
    if (params.priceMax && c.hourlyRate / 100 > params.priceMax) return false;
    return true;
  });

  const results: SearchResult[] = filtered.map((court) => {
    const allSlots = slots.get(court.slug) ?? [];
    const matching = filterSlotsByTime(allSlots, params.time, params.duration);
    return {
      court,
      matchingSlots: matching.slice(0, 5),
      courtTypes: getCourtTypes(court),
    };
  });

  const withSlots = results.filter((r) => r.matchingSlots.length > 0);
  const sorted = sortResults(withSlots, params.sort, params.time);

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

  const fallbackResults: SearchResult[] = allCourts.map((court) => {
    const allSlots = slots.get(court.slug) ?? [];
    const matching = filterSlotsByTime(allSlots, "any", params.duration);
    return {
      court,
      matchingSlots: matching.slice(0, 3),
      courtTypes: getCourtTypes(court),
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
