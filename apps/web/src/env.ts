import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_API_URL: z.string().url().default("http://localhost:4000"),
    VITE_PAYMONGO_PUBLIC_KEY: z.string().optional(),
  },

  clientPrefix: "VITE_",

  emptyStringAsUndefined: true,
  runtimeEnv: import.meta.env,
});
