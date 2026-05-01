import {
  ApiCourtSchema,
  TimeSlotSchema,
  BookingStatusSchema,
  CreateBookingResponseSchema,
  type CreateBookingPayload,
} from "@picklecebu/api-contracts";
import { z } from "zod";

import { env } from "#/env";

export type {
  ApiCourt,
  TimeSlot,
  BookingStatus,
  CreateBookingPayload,
  CreateBookingResponse,
} from "@picklecebu/api-contracts";

const BASE = env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<unknown> {
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
      (parsed.success ? parsed.data.error : undefined) ?? res.statusText
    );
  }
  return res.json();
}

export function getCourts() {
  return apiFetch("/api/courts").then((d) => z.array(ApiCourtSchema).parse(d));
}

export async function getCourt(slug: string) {
  return apiFetch(`/api/courts/${slug}`).then((d) => ApiCourtSchema.parse(d));
}

export async function getAvailability(slug: string, date: string) {
  const params = new URLSearchParams({ date });
  return apiFetch(`/api/courts/${slug}/availability?${params}`).then((d) =>
    z.array(TimeSlotSchema).parse(d)
  );
}

export const createBooking = (payload: CreateBookingPayload) =>
  apiFetch("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((d) => CreateBookingResponseSchema.parse(d));

export const getBookingStatus = (id: string) =>
  apiFetch(`/api/bookings/${id}/status`).then((d) =>
    BookingStatusSchema.parse(d)
  );
