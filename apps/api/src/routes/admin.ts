import { zValidator } from "@hono/zod-validator";
import { hash } from "bcryptjs";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "../db/client";
import { bookings, courtOwners, courts } from "../db/schema";
import { requireAdmin } from "../middleware/auth";

const app = new Hono();

app.use("*", requireAdmin);

// GET /api/admin/courts
app.get("/courts", async (c) => {
  const result = await db.select().from(courts).orderBy(desc(courts.createdAt));
  return c.json(
    result.map((court) => ({
      ...court,
      amenities: JSON.parse(court.amenities) as string[],
    }))
  );
});

// POST /api/admin/courts
const onboardSchema = z.object({
  court: z.object({
    address: z.string().min(5),
    amenities: z.array(z.string()).default([]),
    coverImageUrl: z.string().url().optional(),
    description: z.string().optional(),
    hourlyRate: z.number().int().positive(),
    locationArea: z.string().min(2),
    name: z.string().min(2),
    slug: z.string().regex(/^[a-z0-9-]+$/),
  }),
  owner: z.object({
    email: z.string().email(),
    name: z.string().min(2),
    phone: z.string().optional(),
    tempPassword: z.string().min(8),
  }),
});

app.post("/courts", zValidator("json", onboardSchema), async (c) => {
  const data = c.req.valid("json");

  const ownerId = `co_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const courtId = `ct_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const passwordHash = await hash(data.owner.tempPassword, 12);

  await db.insert(courtOwners).values({
    email: data.owner.email,
    id: ownerId,
    name: data.owner.name,
    passwordHash,
    phone: data.owner.phone,
  });

  await db.insert(courts).values({
    address: data.court.address,
    amenities: JSON.stringify(data.court.amenities),
    coverImageUrl: data.court.coverImageUrl,
    description: data.court.description,
    hourlyRate: data.court.hourlyRate,
    id: courtId,
    isActive: 1,
    locationArea: data.court.locationArea,
    name: data.court.name,
    ownerId,
    slug: data.court.slug,
  });

  return c.json({ courtId, ownerId }, 201);
});

// PATCH /api/admin/courts/:id
app.patch("/courts/:id", async (c) => {
  const courtId = c.req.param("id");
  const body = await c.req.json<
    Partial<{
      name: string;
      description: string;
      address: string;
      locationArea: string;
      amenities: string[];
      coverImageUrl: string;
      hourlyRate: number;
      isActive: number;
    }>
  >();

  const updates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  if (body.name !== undefined) {
    updates.name = body.name;
  }
  if (body.description !== undefined) {
    updates.description = body.description;
  }
  if (body.address !== undefined) {
    updates.address = body.address;
  }
  if (body.locationArea !== undefined) {
    updates.locationArea = body.locationArea;
  }
  if (body.amenities !== undefined) {
    updates.amenities = JSON.stringify(body.amenities);
  }
  if (body.coverImageUrl !== undefined) {
    updates.coverImageUrl = body.coverImageUrl;
  }
  if (body.hourlyRate !== undefined) {
    updates.hourlyRate = body.hourlyRate;
  }
  if (body.isActive !== undefined) {
    updates.isActive = body.isActive;
  }

  await db.update(courts).set(updates).where(eq(courts.id, courtId));
  return c.json({ success: true });
});

// GET /api/admin/bookings
app.get("/bookings", async (c) => {
  const result = await db
    .select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt));
  return c.json(result);
});

// PATCH /api/admin/bookings/:id/cancel
app.patch("/bookings/:id/cancel", async (c) => {
  const id = c.req.param("id");
  await db
    .update(bookings)
    .set({ status: "cancelled", updatedAt: new Date().toISOString() })
    .where(eq(bookings.id, id));
  return c.json({ success: true });
});

// GET /api/admin/owners
app.get("/owners", async (c) => {
  const result = await db
    .select({
      createdAt: courtOwners.createdAt,
      email: courtOwners.email,
      id: courtOwners.id,
      name: courtOwners.name,
      notifyOnBooking: courtOwners.notifyOnBooking,
      phone: courtOwners.phone,
    })
    .from(courtOwners);
  return c.json(result);
});

export default app;
