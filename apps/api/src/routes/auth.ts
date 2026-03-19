import { zValidator } from "@hono/zod-validator";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { z } from "zod";

import { db } from "../db/client";
import { courtOwners } from "../db/schema";
import { env } from "../env";
import { requireAuth } from "../middleware/auth";
import type { JWTPayload } from "../middleware/auth";

const app = new Hono();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// 7 days in seconds
const JWT_EXPIRY = 7 * 24 * 60 * 60;

const setAuthCookie = (c: Parameters<typeof setCookie>[0], token: string) => {
  setCookie(c, "auth_token", token, {
    httpOnly: true,
    maxAge: JWT_EXPIRY,
    path: "/",
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
};

app.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  if (email === env.ADMIN_EMAIL) {
    const valid = await compare(password, env.ADMIN_PASSWORD_HASH);
    if (!valid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const payload: JWTPayload = {
      email,
      exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY,
      name: "Admin",
      role: "admin",
      sub: "admin",
    };
    const token = await sign(
      payload as unknown as Record<string, unknown>,
      env.JWT_SECRET
    );
    setAuthCookie(c, token);
    return c.json({ email, id: "admin", name: "Admin", role: "admin" });
  }

  const [owner] = await db
    .select()
    .from(courtOwners)
    .where(eq(courtOwners.email, email));

  if (!owner) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const valid = await compare(password, owner.passwordHash);
  if (!valid) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const payload: JWTPayload = {
    email: owner.email,
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY,
    name: owner.name,
    role: "owner",
    sub: owner.id,
  };
  const token = await sign(
    payload as unknown as Record<string, unknown>,
    env.JWT_SECRET
  );
  setAuthCookie(c, token);
  return c.json({
    email: owner.email,
    id: owner.id,
    name: owner.name,
    role: "owner",
  });
});

app.post("/logout", (c) => {
  deleteCookie(c, "auth_token", { path: "/" });
  return c.json({ success: true });
});

app.get("/me", requireAuth, (c) => {
  const user = c.get("user") as JWTPayload;
  return c.json({
    email: user.email,
    id: user.sub,
    name: user.name,
    role: user.role,
  });
});

export default app;
