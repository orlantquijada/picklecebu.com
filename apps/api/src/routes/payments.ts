import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "../db/client";
import { bookings, courtOwners, courts } from "../db/schema";
import { env } from "../env";
import {
  sendBookingConfirmationToPlayer,
  sendBookingNotificationToOwner,
} from "../lib/email";
import { verifyWebhookSignature } from "../lib/paymongo";

const app = new Hono();

app.post("/paymongo", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("paymongo-signature") ?? "";

  const valid = await verifyWebhookSignature(
    rawBody,
    signature,
    env.PAYMONGO_WEBHOOK_SECRET
  );
  if (!valid) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  const event = JSON.parse(rawBody) as {
    data: {
      attributes: {
        type: string;
        data: {
          id: string;
          attributes: {
            payment_intent_id?: string;
          };
        };
      };
    };
  };

  const eventType = event.data.attributes.type;
  const paymentData = event.data.attributes.data;
  const paymentId = paymentData.id;
  const paymentIntentId = paymentData.attributes.payment_intent_id;

  if (eventType === "payment.paid") {
    if (!paymentIntentId) {
      return c.json({ received: true });
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.paymongoPaymentIntentId, paymentIntentId));

    if (!booking) {
      console.error(`No booking for intent: ${paymentIntentId}`);
      return c.json({ received: true });
    }

    if (booking.status === "confirmed") {
      return c.json({ received: true });
    }

    await db
      .update(bookings)
      .set({
        paymongoPaymentId: paymentId,
        status: "confirmed",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, booking.id));

    const [court] = await db
      .select({ name: courts.name, ownerId: courts.ownerId, slug: courts.slug })
      .from(courts)
      .where(eq(courts.id, booking.courtId));

    if (court) {
      try {
        await sendBookingConfirmationToPlayer({
          bookingDate: booking.bookingDate,
          bookingId: booking.id,
          courtName: court.name,
          endHour: booking.endHour,
          playerEmail: booking.playerEmail,
          playerName: booking.playerName,
          startHour: booking.startHour,
          totalAmount: booking.totalAmount,
        });
      } catch (error) {
        console.error(error);
      }

      const [owner] = await db
        .select()
        .from(courtOwners)
        .where(eq(courtOwners.id, court.ownerId));

      if (owner?.notifyOnBooking) {
        try {
          await sendBookingNotificationToOwner({
            bookingDate: booking.bookingDate,
            bookingId: booking.id,
            courtName: court.name,
            endHour: booking.endHour,
            ownerEmail: owner.email,
            ownerName: owner.name,
            playerEmail: booking.playerEmail,
            playerName: booking.playerName,
            playerPhone: booking.playerPhone,
            startHour: booking.startHour,
            totalAmount: booking.totalAmount,
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  } else if (eventType === "payment.failed" && paymentIntentId) {
    await db
      .update(bookings)
      .set({ status: "failed", updatedAt: new Date().toISOString() })
      .where(eq(bookings.paymongoPaymentIntentId, paymentIntentId));
  }

  return c.json({ received: true });
});

export default app;
