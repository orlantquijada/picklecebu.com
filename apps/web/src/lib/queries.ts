import { useQuery, useQueries } from "@tanstack/react-query";

import { getCourt, getCourts, getAvailability } from "./api";
import type { ApiCourt, TimeSlot } from "./api";

export function useCourtsQuery() {
  return useQuery({
    queryKey: ["courts"],
    queryFn: getCourts,
  });
}

export function useCourtQuery(slug: string) {
  return useQuery({
    queryKey: ["courts", slug],
    queryFn: () => getCourt(slug),
  });
}

export function useAvailabilityQuery(slug: string, date: string) {
  return useQuery({
    queryKey: ["availability", slug, date],
    queryFn: () => getAvailability(slug, date),
    enabled: !!slug && !!date,
  });
}

export function useAvailabilityQueries(
  courts: ApiCourt[],
  date: string
): Map<string, TimeSlot[]> {
  const results = useQueries({
    queries: courts.map((c) => ({
      queryKey: ["availability", c.slug, date],
      queryFn: () => getAvailability(c.slug, date),
      enabled: !!date,
    })),
  });

  const map = new Map<string, TimeSlot[]>();
  courts.forEach((c, i) => {
    const data = results[i]?.data;
    if (data) map.set(c.slug, data);
  });
  return map;
}
