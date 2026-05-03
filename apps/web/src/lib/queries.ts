import { useQuery, useQueries, queryOptions } from "@tanstack/react-query";

import { getCourt, getCourts, getAvailability, getBookingStatus } from "./api";
import type { ApiCourt, TimeSlot } from "./api";

export const courtKeys = {
  all: ["courts"] as const,
  detail: (slug: string) => [...courtKeys.all, slug] as const,
};

export const availabilityKeys = {
  all: ["availability"] as const,
  slot: (slug: string, date: string) =>
    [...availabilityKeys.all, slug, date] as const,
};

export const bookingStatusKeys = {
  all: ["booking-status"] as const,
  detail: (id: string) => [...bookingStatusKeys.all, id] as const,
};

export function courtsQueryOptions() {
  return queryOptions({
    queryKey: courtKeys.all,
    queryFn: getCourts,
  });
}

export function courtQueryOptions(slug: string) {
  return queryOptions({
    queryKey: courtKeys.detail(slug),
    queryFn: () => getCourt(slug),
  });
}

export function availabilityQueryOptions(slug: string, date: string) {
  return queryOptions({
    queryKey: availabilityKeys.slot(slug, date),
    queryFn: () => getAvailability(slug, date),
    enabled: !!slug && !!date,
  });
}

export function bookingStatusQueryOptions(
  id: string,
  pollingEnabled: boolean,
) {
  return queryOptions({
    queryKey: bookingStatusKeys.detail(id),
    queryFn: () => getBookingStatus(id),
    enabled: !!id,
    refetchInterval: pollingEnabled
      ? (query) => {
          const s = query.state.data?.status;
          if (s && s !== "pending") return false;
          return 2000;
        }
      : false,
    retry: false,
  });
}

export function useCourtsQuery() { return useQuery(courtsQueryOptions()); }

export function useCourtQuery(slug: string) {
  return useQuery(courtQueryOptions(slug));
}

export function useAvailabilityQuery(slug: string, date: string) {
  return useQuery(availabilityQueryOptions(slug, date));
}

export function useBookingStatusQuery(id: string, pollingEnabled: boolean) {
  return useQuery(bookingStatusQueryOptions(id, pollingEnabled));
}

export function useAvailabilityQueries(
  courts: ApiCourt[],
  date: string,
): Map<string, TimeSlot[]> {
  const results = useQueries({
    queries: courts.map((c) => availabilityQueryOptions(c.slug, date)),
  });

  const map = new Map<string, TimeSlot[]>();
  courts.forEach((c, i) => {
    const data = results[i]?.data;
    if (data) map.set(c.slug, data);
  });
  return map;
}
