import { and, eq } from "drizzle-orm";

import { db } from "../db/client";
import { courts } from "../db/schema";

export async function getCourtBySlug(slug: string) {
  const [court] = await db
    .select()
    .from(courts)
    .where(and(eq(courts.slug, slug), eq(courts.isActive, true)));
  return court ?? null;
}
