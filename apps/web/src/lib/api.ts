import { env } from "#/env";
import { AmenitySchema } from "./constants";
import type { Amenity, CourtInfo, Venue, VenueDetail } from "./constants";
import { z } from "zod";

const BASE = env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

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
    const raw = await res.json().catch(() => ({ error: res.statusText }));
    const parsed = z.object({ error: z.string().optional() }).safeParse(raw);
    throw new ApiError(
      res.status,
      (parsed.success ? parsed.data.error : undefined) ?? res.statusText,
    );
  }
  return res.json() as Promise<T>;
}

export const ApiCourtSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  hourlyRate: z.number(),
  locationArea: z.string(),
  amenities: z.array(AmenitySchema),
  rules: z.array(z.string()),
  galleryImageUrls: z.array(z.string()),
  coverImageUrl: z.string(),
  operatingHours: z.string().optional(),
  cancellationPolicy: z.string().optional(),
});

export type ApiCourt = z.infer<typeof ApiCourtSchema>;

export type TimeSlot = { hour: number; available: boolean };

export const getCourts = () =>
  apiFetch<unknown>("/api/courts").then((d) => z.array(ApiCourtSchema).parse(d));
export const getCourt = (slug: string) =>
  apiFetch<unknown>(`/api/courts/${slug}`).then((d) => ApiCourtSchema.parse(d));
export const getAvailability = (slug: string, date: string) =>
  apiFetch<TimeSlot[]>(`/api/courts/${slug}/availability?date=${date}`);

export type CreateBookingPayload = {
  bookingDate: string;
  courtSlug: string;
  numHours: number;
  paymentMethod: "gcash" | "paymaya";
  playerEmail: string;
  playerName: string;
  playerPhone: string;
  startHour: number;
};

export type CreateBookingResponse = {
  bookingId: string;
  checkoutUrl: string;
};

export const createBooking = (payload: CreateBookingPayload) =>
  apiFetch<CreateBookingResponse>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

function primaryCourtType(amenities: Amenity[]): CourtInfo["type"] {
  for (const a of amenities) {
    if (a === "Indoor" || a === "Outdoor" || a === "Covered") return a;
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
    amenities: c.amenities,
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
