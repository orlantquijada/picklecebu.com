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

export const courtsQueryOptions = () =>
  queryOptions({
    queryKey: courtKeys.all,
    queryFn: getCourts,
  });

export const courtQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: courtKeys.detail(slug),
    queryFn: () => getCourt(slug),
  });

export const availabilityQueryOptions = (slug: string, date: string) =>
  queryOptions({
    queryKey: availabilityKeys.slot(slug, date),
    queryFn: () => getAvailability(slug, date),
    enabled: !!slug && !!date,
  });

export const bookingStatusQueryOptions = (
  id: string,
  pollingEnabled: boolean,
) =>
  queryOptions({
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

export const useCourtsQuery = () => useQuery(courtsQueryOptions());

export const useCourtQuery = (slug: string) =>
  useQuery(courtQueryOptions(slug));

export const useAvailabilityQuery = (slug: string, date: string) =>
  useQuery(availabilityQueryOptions(slug, date));

export const useBookingStatusQuery = (id: string, pollingEnabled: boolean) =>
  useQuery(bookingStatusQueryOptions(id, pollingEnabled));

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
