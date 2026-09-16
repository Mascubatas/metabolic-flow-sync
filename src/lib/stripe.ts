import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Stripe from "stripe";

export const PRODUCT_PRICE_USD = 2900;

export function getStripeSecretKey() {
  const values = [
    typeof process !== "undefined" ? process.env?.STRIPE_SECRET_KEY : undefined,
    typeof process !== "undefined" ? process.env?.STRIPE_KEY : undefined,
  ];

  return values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim() ?? "";
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      name: z.string().min(1),
      company: z.string().optional().default(""),
      amount: z.number().int().positive(),
      currency: z.string().default("usd"),
    }),
  )
  .handler(async ({ data }) => {
    const secretKey = getStripeSecretKey();
    if (!secretKey) {
      throw new Error(
        "A Stripe secret key is required to create a checkout session. Set STRIPE_SECRET_KEY in your environment (restricted keys are supported when they have checkout permissions).",
      );
    }
    if (secretKey.startsWith("pk_")) {
      throw new Error(
        "Stripe is configured with a publishable key. Set STRIPE_SECRET_KEY or STRIPE_KEY to a restricted (rk_) or secret (sk_) key.",
      );
    }

    const stripe = new Stripe(secretKey);
    const siteUrl = process.env.APP_URL || process.env.PUBLIC_URL || "http://localhost:8080";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: data.currency,
            unit_amount: data.amount,
            product_data: {
              name: "Metabolix Lifetime Access",
              description: `Purchase by ${data.name}${data.company ? ` for ${data.company}` : ""}`,
            },
          },
        },
      ],
      metadata: {
        name: data.name,
        company: data.company || "",
      },
      success_url: `${siteUrl}/buy?payment=success`,
      cancel_url: `${siteUrl}/buy?payment=cancelled`,
      payment_method_types: ["card"],
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  });
