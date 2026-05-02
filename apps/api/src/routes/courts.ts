import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "../db/client";
import { courts } from "../db/schema";
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
  const [court] = await db
    .select()
    .from(courts)
    .where(and(eq(courts.slug, slug), eq(courts.isActive, true)));

  if (!court) {
    return c.json({ error: "Court not found" }, 404);
  }

  return c.json(court);
});

app.get(
  "/:slug/availability",
  zValidator("query", z.object({ date: z.iso.date() })),
  async (c) => {
    const slug = c.req.param("slug");
    const { date } = c.req.valid("query");

    const [court] = await db
      .select({ id: courts.id })
      .from(courts)
      .where(and(eq(courts.slug, slug), eq(courts.isActive, true)));

    if (!court) {
      return c.json({ error: "Court not found" }, 404);
    }

    const slots = await getAvailableSlots(db, court.id, date);
    return c.json(slots);
  }
);

export default app;
