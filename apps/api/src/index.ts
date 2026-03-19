import { Hono } from "hono";

import { runMigrations } from "./db/migrate";
import { env } from "./env";
import { corsMiddleware } from "./middleware/cors";
import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import bookingsRouter from "./routes/bookings";
import courtsRouter from "./routes/courts";
import dashboardRouter from "./routes/dashboard";
import paymentsRouter from "./routes/payments";

// Run DB migrations on startup
runMigrations();

const app = new Hono();

app.use("*", corsMiddleware);

app.route("/api/courts", courtsRouter);
app.route("/api/bookings", bookingsRouter);
app.route("/api/webhooks", paymentsRouter);
app.route("/api/auth", authRouter);
app.route("/api/dashboard", dashboardRouter);
app.route("/api/admin", adminRouter);

app.get("/health", (c) => c.json({ status: "ok" }));

export default {
  fetch: app.fetch,
  port: env.PORT,
};
