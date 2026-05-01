import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { z } from "zod";

import { env } from "../env";

const jwtPayloadSchema = z.object({
  sub: z.string(),
  role: z.enum(["owner", "admin"]),
  name: z.string(),
  email: z.string().email(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

function makeAuthMiddleware(check?: (role: JWTPayload["role"]) => boolean) {
  return createMiddleware<{ Variables: { user: JWTPayload } }>(
    async (c, next) => {
      const token = getCookie(c, "auth_token");
      if (!token) return c.json({ error: "Unauthorized" }, 401);
      try {
        const raw = await verify(token, env.JWT_SECRET, "HS256");
        const payload = jwtPayloadSchema.parse(raw);
        if (check && !check(payload.role))
          return c.json({ error: "Forbidden" }, 403);
        c.set("user", payload);
        await next();
      } catch {
        return c.json({ error: "Invalid token" }, 401);
      }
    }
  );
}

export const requireAuth = makeAuthMiddleware();
export const requireOwner = makeAuthMiddleware(
  (r) => r === "owner" || r === "admin"
);
export const requireAdmin = makeAuthMiddleware((r) => r === "admin");
