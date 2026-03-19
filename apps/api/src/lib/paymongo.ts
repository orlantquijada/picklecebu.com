import { env } from "../env";

const PAYMONGO_BASE = "https://api.paymongo.com/v1";
const authHeader = `Basic ${Buffer.from(`${env.PAYMONGO_SECRET_KEY}:`).toString("base64")}`;

const paymongoFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`${PAYMONGO_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`PayMongo ${res.status}: ${JSON.stringify(err)}`);
  }
  return res.json() as Promise<T>;
};

export type PaymentMethodType = "gcash" | "paymaya" | "card";

export interface PaymentIntent {
  id: string;
  attributes: {
    amount: number;
    status: string;
    client_key: string;
    payment_method_allowed: string[];
    next_action?: {
      type: string;
      redirect?: { url: string; return_url: string };
    };
  };
}

export interface PaymentMethod {
  id: string;
  attributes: { type: string };
}

export interface AttachedPaymentIntent {
  id: string;
  attributes: {
    status: string;
    next_action?: {
      type: string;
      redirect?: { url: string };
    };
  };
}

export const createPaymentIntent = async (params: {
  amount: number;
  description?: string;
  metadata?: Record<string, string>;
  paymentMethodAllowed?: PaymentMethodType[];
  returnUrl: string;
  statementDescriptor?: string;
}): Promise<PaymentIntent> => {
  const r = await paymongoFetch<{ data: PaymentIntent }>("/payment_intents", {
    body: JSON.stringify({
      data: {
        attributes: {
          amount: params.amount,
          capture_type: "automatic",
          currency: "PHP",
          description: params.description,
          metadata: params.metadata,
          payment_method_allowed: params.paymentMethodAllowed ?? [
            "gcash",
            "paymaya",
            "card",
          ],
          return_url: params.returnUrl,
          statement_descriptor: params.statementDescriptor ?? "PickleCebu",
        },
      },
    }),
    method: "POST",
  });
  return r.data;
};

export const createPaymentMethod = async (params: {
  type: PaymentMethodType;
  billing?: { name?: string; email?: string; phone?: string };
}): Promise<PaymentMethod> => {
  const r = await paymongoFetch<{ data: PaymentMethod }>("/payment_methods", {
    body: JSON.stringify({
      data: {
        attributes: {
          billing: params.billing,
          type: params.type,
        },
      },
    }),
    method: "POST",
  });
  return r.data;
};

export const attachPaymentIntent = async (params: {
  paymentIntentId: string;
  paymentMethodId: string;
  returnUrl: string;
  clientKey: string;
}): Promise<AttachedPaymentIntent> => {
  const r = await paymongoFetch<{ data: AttachedPaymentIntent }>(
    `/payment_intents/${params.paymentIntentId}/attach`,
    {
      body: JSON.stringify({
        data: {
          attributes: {
            client_key: params.clientKey,
            payment_method: params.paymentMethodId,
            return_url: params.returnUrl,
          },
        },
      }),
      method: "POST",
    }
  );
  return r.data;
};

export const retrievePaymentIntent = async (
  intentId: string
): Promise<PaymentIntent> => {
  const r = await paymongoFetch<{ data: PaymentIntent }>(
    `/payment_intents/${intentId}`
  );
  return r.data;
};

export const verifyWebhookSignature = async (
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> => {
  const parts = signature.split(",");
  const tPart = parts.find((p) => p.startsWith("t="));
  const liPart = parts.find((p) => p.startsWith("li="));
  if (!tPart || !liPart) {
    return false;
  }

  const timestamp = tPart.slice(2);
  const receivedSig = liPart.slice(3);
  const sigPayload = `${timestamp}.${rawBody}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(sigPayload)
  );
  const expectedSig = [...new Uint8Array(sigBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (receivedSig.length !== expectedSig.length) {
    return false;
  }
  let equal = true;
  for (let i = 0; i < receivedSig.length; i += 1) {
    if (receivedSig.codePointAt(i) !== expectedSig.codePointAt(i)) {
      equal = false;
    }
  }
  return equal;
};
