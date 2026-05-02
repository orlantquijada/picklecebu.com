import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "../db/client";
import { blockedSlots, bookings, courts } from "../db/schema";
import { requireOwner } from "../middleware/auth";
import type { JWTPayload } from "../middleware/auth";

const app = new Hono<{ Variables: { user: JWTPayload } }>();

app.use("*", requireOwner);

async function assertCourtAccess(courtId: string, user: JWTPayload) {
  const [court] = await db
    .select({ ownerId: courts.ownerId })
    .from(courts)
    .where(eq(courts.id, courtId));
  if (!court) throw new HTTPException(404, { message: "Court not found" });
  if (user.role !== "admin" && court.ownerId !== user.sub)
    throw new HTTPException(403, { message: "Forbidden" });
  return court;
}

// GET /api/dashboard/courts
app.get("/courts", async (c) => {
  const user = c.get("user");

  const ownerCourts = await db
    .select()
    .from(courts)
    .where(user.role === "admin" ? undefined : eq(courts.ownerId, user.sub));

  return c.json(ownerCourts);
});

const bookingsQuerySchema = z.object({
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
  status: z
    .enum(["pending", "confirmed", "failed", "cancelled"])
    .optional(),
});

// GET /api/dashboard/courts/:id/bookings
app.get(
  "/courts/:id/bookings",
  zValidator("query", bookingsQuerySchema),
  async (c) => {
    const user = c.get("user");
    const courtId = c.req.param("id");
    const { from, to, status } = c.req.valid("query");

    await assertCourtAccess(courtId, user);

    const conditions = [eq(bookings.courtId, courtId)];
    if (from) {
      conditions.push(gte(bookings.bookingDate, from));
    }
    if (to) {
      conditions.push(lte(bookings.bookingDate, to));
    }
    if (status) {
      conditions.push(eq(bookings.status, status));
    }

    const result = await db
      .select()
      .from(bookings)
      .where(and(...conditions))
      .orderBy(desc(bookings.bookingDate));

    return c.json(result);
  }
);

// GET /api/dashboard/bookings/summary
app.get("/bookings/summary", async (c) => {
  const user = c.get("user");

  const ownerCourts = await db
    .select({ id: courts.id })
    .from(courts)
    .where(user.role === "admin" ? undefined : eq(courts.ownerId, user.sub));

  const courtIds = ownerCourts.map((court) => court.id);
  if (courtIds.length === 0) {
    return c.json({ month: 0, totalBookings: 0, week: 0 });
  }

  const now = new Date();
  const [weekAgo = ""] = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T");
  const [monthAgo = ""] = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T");
  const [today = ""] = now.toISOString().split("T");

  const [weekRevenue, monthRevenue, totalCount] = await Promise.all([
    db
      .select({ total: sql<number>`sum(${bookings.totalAmount})` })
      .from(bookings)
      .where(
        and(
          eq(bookings.status, "confirmed"),
          gte(bookings.bookingDate, weekAgo),
          lte(bookings.bookingDate, today)
        )
      ),
    db
      .select({ total: sql<number>`sum(${bookings.totalAmount})` })
      .from(bookings)
      .where(
        and(
          eq(bookings.status, "confirmed"),
          gte(bookings.bookingDate, monthAgo),
          lte(bookings.bookingDate, today)
        )
      ),
    db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.status, "confirmed")),
  ]);

  return c.json({
    month: monthRevenue[0]?.total ?? 0,
    totalBookings: totalCount[0]?.count ?? 0,
    week: weekRevenue[0]?.total ?? 0,
  });
});

// POST /api/dashboard/courts/:id/block
const blockSchema = z.object({
  date: z.iso.date(),
  hour: z.number().int().min(7).max(19),
  reason: z.string().optional(),
});

app.post("/courts/:id/block", zValidator("json", blockSchema), async (c) => {
  const user = c.get("user");
  const courtId = c.req.param("id");
  const data = c.req.valid("json");

  await assertCourtAccess(courtId, user);

  const id = `bs_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
  await db.insert(blockedSlots).values({
    courtId,
    id,
    reason: data.reason,
    slotDate: data.date,
    slotHour: data.hour,
  });

  return c.json({ id, success: true });
});

// DELETE /api/dashboard/courts/:id/block
app.delete("/courts/:id/block", zValidator("json", blockSchema), async (c) => {
  const user = c.get("user");
  const courtId = c.req.param("id");
  const data = c.req.valid("json");

  await assertCourtAccess(courtId, user);

  await db
    .delete(blockedSlots)
    .where(
      and(
        eq(blockedSlots.courtId, courtId),
        eq(blockedSlots.slotDate, data.date),
        eq(blockedSlots.slotHour, data.hour)
      )
    );

  return c.json({ success: true });
});

// PATCH /api/dashboard/courts/:id/settings
const settingsSchema = z.object({
  hourlyRate: z.number().int().positive().optional(),
  notifyOnBooking: z.boolean().optional(),
});

app.patch(
  "/courts/:id/settings",
  zValidator("json", settingsSchema),
  async (c) => {
    const user = c.get("user");
    const courtId = c.req.param("id");
    const data = c.req.valid("json");

    await assertCourtAccess(courtId, user);

    const updates: Partial<typeof courts.$inferInsert> = {
      updatedAt: new Date().toISOString(),
    };
    if (data.hourlyRate !== undefined) {
      updates.hourlyRate = data.hourlyRate;
    }

    await db.update(courts).set(updates).where(eq(courts.id, courtId));
    return c.json({ success: true });
  }
);

export default app;
