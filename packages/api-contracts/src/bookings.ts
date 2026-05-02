import { z } from "zod";

export const CreateBookingPayloadSchema = z.object({
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  courtSlug: z.string(),
  numHours: z.number().int().min(1).max(6),
  paymentMethod: z.enum(["gcash", "paymaya", "card"]),
  playerEmail: z.email(),
  playerName: z.string().min(2).max(100),
  playerPhone: z.string().min(7).max(20),
  startHour: z.number().int().min(7).max(19),
});

export type CreateBookingPayload = z.infer<typeof CreateBookingPayloadSchema>;

export const CreateBookingResponseSchema = z.object({
  bookingId: z.string(),
  checkoutUrl: z.string().nullable(),
});

export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;
