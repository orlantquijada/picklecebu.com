import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

import { env } from "../env";

export interface JWTPayload {
  sub: string;
  role: "owner" | "admin";
  name: string;
  email: string;
  exp: number;
}

export const requireAuth = createMiddleware<{
  Variables: { user: JWTPayload };
}>(async (c, next) => {
  const token = getCookie(c, "auth_token");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const payload = (await verify(
      token,
      env.JWT_SECRET,
      "HS256"
    )) as unknown as JWTPayload;
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export const requireOwner = createMiddleware<{
  Variables: { user: JWTPayload };
}>(async (c, next) => {
  const token = getCookie(c, "auth_token");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const payload = (await verify(
      token,
      env.JWT_SECRET,
      "HS256"
    )) as unknown as JWTPayload;
    if (payload.role !== "owner" && payload.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export const requireAdmin = createMiddleware<{
  Variables: { user: JWTPayload };
}>(async (c, next) => {
  const token = getCookie(c, "auth_token");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const payload = (await verify(
      token,
      env.JWT_SECRET,
      "HS256"
    )) as unknown as JWTPayload;
    if (payload.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});
