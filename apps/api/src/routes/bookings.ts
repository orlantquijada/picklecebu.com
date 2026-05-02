import { CreateBookingPayloadSchema } from "@picklecebu/api-contracts";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "../db/client";
import { bookings, courts } from "../db/schema";
import { env } from "../env";
import {
  attachPaymentIntent,
  createPaymentIntent,
  createPaymentMethod,
} from "../lib/paymongo";
import { getAvailableSlots, isSlotAvailable } from "../lib/slots";

const app = new Hono();

app.post("/", zValidator("json", CreateBookingPayloadSchema), async (c) => {
  const data = c.req.valid("json");

  const [court] = await db
    .select()
    .from(courts)
    .where(and(eq(courts.slug, data.courtSlug), eq(courts.isActive, true)));

  if (!court) {
    return c.json({ error: "Court not found" }, 404);
  }

  const endHour = data.startHour + data.numHours;
  if (endHour > 20) {
    return c.json(
      { error: "Booking exceeds operating hours (last slot ends at 8PM)" },
      400
    );
  }

  const slots = await getAvailableSlots(db, court.id, data.bookingDate);
  if (!isSlotAvailable(slots, data.startHour, data.numHours)) {
    return c.json(
      { error: "One or more selected time slots are not available" },
      409
    );
  }

  const subtotal = court.hourlyRate * data.numHours;
  const convenienceFee = 5000;
  const totalAmount = subtotal + convenienceFee;

  const bookingId = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const returnUrl = `${env.WEB_URL}/venues/${court.slug}/confirm?booking_id=${bookingId}`;

  let checkoutUrl: string;
  let paymentIntentId: string;

  try {
    const [paymentMethod, intent] = await Promise.all([
      createPaymentMethod({
        billing: {
          email: data.playerEmail,
          name: data.playerName,
          phone: data.playerPhone,
        },
        type: data.paymentMethod,
      }),
      createPaymentIntent({
        amount: totalAmount,
        description: `${court.name} — ${data.bookingDate} ${data.startHour}:00–${endHour}:00`,
        metadata: {
          booking_id: bookingId,
          court_id: court.id,
          player_email: data.playerEmail,
        },
        paymentMethodAllowed: [data.paymentMethod],
        returnUrl,
        statementDescriptor: "PickleCebu",
      }),
    ]);

    paymentIntentId = intent.id;

    const attached = await attachPaymentIntent({
      clientKey: intent.attributes.client_key,
      paymentIntentId: intent.id,
      paymentMethodId: paymentMethod.id,
      returnUrl,
    });

    const redirectUrl = attached.attributes.next_action?.redirect?.url;
    if (!redirectUrl) {
      throw new Error("No redirect URL from PayMongo");
    }
    checkoutUrl = redirectUrl;
  } catch (error) {
    console.error("PayMongo error:", error);
    return c.json({ error: "Payment initialization failed" }, 500);
  }

  await db.insert(bookings).values({
    bookingDate: data.bookingDate,
    convenienceFee,
    courtId: court.id,
    endHour,
    id: bookingId,
    numHours: data.numHours,
    paymongoPaymentIntentId: paymentIntentId,
    playerEmail: data.playerEmail,
    playerName: data.playerName,
    playerPhone: data.playerPhone,
    startHour: data.startHour,
    status: "pending",
    subtotal,
    totalAmount,
  });

  return c.json({ bookingId, checkoutUrl });
});

app.get("/:id/status", async (c) => {
  const id = c.req.param("id");
  const [booking] = await db
    .select({
      bookingDate: bookings.bookingDate,
      courtId: bookings.courtId,
      endHour: bookings.endHour,
      id: bookings.id,
      playerName: bookings.playerName,
      startHour: bookings.startHour,
      status: bookings.status,
      totalAmount: bookings.totalAmount,
    })
    .from(bookings)
    .where(eq(bookings.id, id));

  if (!booking) {
    return c.json({ error: "Booking not found" }, 404);
  }
  return c.json(booking);
});

export default app;
