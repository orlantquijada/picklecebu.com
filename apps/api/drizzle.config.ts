import { defineConfig } from "drizzle-kit";

export default defineConfig({
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "./picklecebu.sqlite",
  },
  dialect: "sqlite",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
});
