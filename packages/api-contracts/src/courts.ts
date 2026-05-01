import { z } from "zod";

export const AmenitySchema = z.enum([
  "Indoor",
  "Outdoor",
  "Covered",
  "Floodlights",
  "Parking",
  "Showers",
  "Pro Shop",
]);

export type Amenity = z.infer<typeof AmenitySchema>;

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

export const TimeSlotSchema = z.object({
  hour: z.number(),
  available: z.boolean(),
});

export type TimeSlot = z.infer<typeof TimeSlotSchema>;

export const BookingStatusSchema = z.object({
  id: z.string(),
  bookingDate: z.string(),
  courtId: z.string(),
  startHour: z.number(),
  endHour: z.number(),
  status: z.enum(["pending", "confirmed", "failed", "cancelled"]),
  playerName: z.string(),
  totalAmount: z.number(),
});

export type BookingStatus = z.infer<typeof BookingStatusSchema>;
