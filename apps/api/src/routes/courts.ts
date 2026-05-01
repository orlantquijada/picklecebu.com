import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "../db/client";
import { courts } from "../db/schema";
import { getAvailableSlots } from "../lib/slots";

const app = new Hono();

const stringArray = z.array(z.string());

app.get("/", async (c) => {
  const result = await db
    .select({
      address: courts.address,
      amenities: courts.amenities,
      cancellationPolicy: courts.cancellationPolicy,
      coverImageUrl: courts.coverImageUrl,
      description: courts.description,
      galleryImageUrls: courts.galleryImageUrls,
      hourlyRate: courts.hourlyRate,
      id: courts.id,
      locationArea: courts.locationArea,
      name: courts.name,
      operatingHours: courts.operatingHours,
      rules: courts.rules,
      slug: courts.slug,
    })
    .from(courts)
    .where(eq(courts.isActive, 1));

  return c.json(
    result.map((court) => ({
      ...court,
      amenities: stringArray.parse(JSON.parse(court.amenities)),
      galleryImageUrls: stringArray.parse(JSON.parse(court.galleryImageUrls ?? "[]")),
      rules: stringArray.parse(JSON.parse(court.rules ?? "[]")),
    }))
  );
});

app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const [court] = await db
    .select()
    .from(courts)
    .where(and(eq(courts.slug, slug), eq(courts.isActive, 1)));

  if (!court) {
    return c.json({ error: "Court not found" }, 404);
  }

  return c.json({
    ...court,
    amenities: JSON.parse(court.amenities) as string[],
    galleryImageUrls: JSON.parse(court.galleryImageUrls ?? "[]") as string[],
    rules: JSON.parse(court.rules ?? "[]") as string[],
  });
});

app.get("/:slug/availability", async (c) => {
  const slug = c.req.param("slug");
  const date = c.req.query("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return c.json({ error: "Invalid date format. Use YYYY-MM-DD" }, 400);
  }

  const [court] = await db
    .select({ id: courts.id })
    .from(courts)
    .where(and(eq(courts.slug, slug), eq(courts.isActive, 1)));

  if (!court) {
    return c.json({ error: "Court not found" }, 404);
  }

  const slots = await getAvailableSlots(db, court.id, date);
  return c.json(slots);
});

export default app;
