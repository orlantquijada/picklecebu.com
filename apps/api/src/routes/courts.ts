import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "../db/client";
import { courts } from "../db/schema";
import { getCourtBySlug } from "../lib/courts";
import { getAvailableSlots } from "../lib/slots";

const app = new Hono();

app.get("/", async (c) => {
  const result = await db
    .select()
    .from(courts)
    .where(eq(courts.isActive, true));

  return c.json(result);
});

app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const court = await getCourtBySlug(slug);
  if (!court) return c.json({ error: "Court not found" }, 404);
  return c.json(court);
});

app.get(
  "/:slug/availability",
  zValidator("query", z.object({ date: z.iso.date() })),
  async (c) => {
    const slug = c.req.param("slug");
    const { date } = c.req.valid("query");

    const court = await getCourtBySlug(slug);
    if (!court) return c.json({ error: "Court not found" }, 404);

    const slots = await getAvailableSlots(db, court.id, date);
    return c.json(slots);
  }
);

export default app;
