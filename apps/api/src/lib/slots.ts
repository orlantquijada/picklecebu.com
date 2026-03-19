import { and, eq, inArray } from "drizzle-orm";

import type { DB } from "../db/client";
import { blockedSlots, bookings } from "../db/schema";

export const VALID_HOURS = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
] as const;
export type ValidHour = (typeof VALID_HOURS)[number];

export const getAvailableSlots = async (
  db: DB,
  courtId: string,
  date: string
): Promise<{ hour: number; available: boolean }[]> => {
  const [activeBookings, blocked] = await Promise.all([
    db
      .select({ endHour: bookings.endHour, startHour: bookings.startHour })
      .from(bookings)
      .where(
        and(
          eq(bookings.courtId, courtId),
          eq(bookings.bookingDate, date),
          inArray(bookings.status, ["pending", "confirmed"])
        )
      ),
    db
      .select({ slotHour: blockedSlots.slotHour })
      .from(blockedSlots)
      .where(
        and(eq(blockedSlots.courtId, courtId), eq(blockedSlots.slotDate, date))
      ),
  ]);

  const takenHours = new Set<number>();
  for (const booking of activeBookings) {
    for (let h = booking.startHour; h < booking.endHour; h += 1) {
      takenHours.add(h);
    }
  }
  for (const slot of blocked) {
    takenHours.add(slot.slotHour);
  }

  return VALID_HOURS.map((hour) => ({
    available: !takenHours.has(hour),
    hour,
  }));
};

export const isSlotAvailable = (
  slots: { hour: number; available: boolean }[],
  startHour: number,
  numHours: number
): boolean => {
  for (let h = startHour; h < startHour + numHours; h += 1) {
    const slot = slots.find((s) => s.hour === h);
    if (!slot?.available) {
      return false;
    }
  }
  return true;
};
