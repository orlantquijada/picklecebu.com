import { env } from "#/env";
import type { Amenity, CourtInfo, Venue, VenueDetail } from "./constants";

const BASE = env.VITE_API_URL;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export type ApiCourt = {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  hourlyRate: number;
  locationArea: string;
  amenities: string[];
  rules: string[];
  galleryImageUrls: string[];
  coverImageUrl: string;
  operatingHours: string;
  cancellationPolicy: string;
};

export type TimeSlot = { hour: number; available: boolean };

export const getCourts = () => apiFetch<ApiCourt[]>("/api/courts");
export const getCourt = (slug: string) => apiFetch<ApiCourt>(`/api/courts/${slug}`);
export const getAvailability = (slug: string, date: string) =>
  apiFetch<TimeSlot[]>(`/api/courts/${slug}/availability?date=${date}`);

function primaryCourtType(amenities: string[]): CourtInfo["type"] {
  for (const a of amenities) {
    const l = a.toLowerCase();
    if (l === "indoor" || l === "outdoor" || l === "covered")
      return (l.charAt(0).toUpperCase() + l.slice(1)) as CourtInfo["type"];
  }
  return "Outdoor";
}

export function apiCourtToVenue(c: ApiCourt): Venue {
  return {
    slug: c.slug,
    name: c.name,
    area: c.locationArea,
    description: c.description,
    pricePerHourCentavos: c.hourlyRate,
    amenities: c.amenities as Amenity[],
    courtCount: 1,
    badge: undefined,
  };
}

export function apiCourtToVenueDetail(c: ApiCourt): VenueDetail {
  return {
    ...apiCourtToVenue(c),
    address: c.address,
    fullDescription: c.description,
    operatingHours: c.operatingHours ?? "",
    courts: [{ name: "Court 1", type: primaryCourtType(c.amenities) }],
    rules: c.rules,
    cancellationPolicy: c.cancellationPolicy ?? "",
    checkInTime: "Arrive a few minutes before your slot",
    checkOutTime: "Please vacate the court on time",
    maxGuests: 4,
    locationDescription: c.address,
  };
}
