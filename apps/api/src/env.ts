import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD_HASH: z.string().min(1),
    DATABASE_URL: z.string().default("./picklecebu.sqlite"),
    JWT_SECRET: z.string().min(32),
    MOCK_PAYMENT: z.coerce.boolean().optional().default(false),
    PAYMONGO_PUBLIC_KEY: z.string().min(1),
    PAYMONGO_SECRET_KEY: z.string().min(1),
    PAYMONGO_WEBHOOK_SECRET: z.string().min(1),
    PORT: z.coerce.number().default(4000),
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.string().email(),
    WEB_URL: z.string().url().default("http://localhost:3000"),
  },
});
