// Maakt een Stripe Checkout-sessie (iDEAL/creditcard) voor het gekozen bedrag.
// Vereist de omgevingsvariabele STRIPE_SECRET_KEY (in Vercel, NOOIT in de code).
import type { VercelApiHandler } from "@vercel/node";
import Stripe from "stripe";

interface CheckoutBody {
  cents?: number;
  team?: string;
}

const headerString = (h: string | string[] | undefined): string | undefined =>
  Array.isArray(h) ? h[0] : h;

const handler: VercelApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Alleen POST." });
    return;
  }

  const key: string | undefined = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    res.status(503).json({ error: "Betalen is nog niet geconfigureerd." });
    return;
  }

  let body: CheckoutBody = req.body;
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body || "{}");
    } catch {
      body = {};
    }
  }
  const cents: number = Math.round(Number(body?.cents) || 0);
  const team: string = String(body?.team || "").slice(0, 80);

  // € 1 t/m € 1.000.000 (in centen)
  if (!(cents >= 100 && cents <= 100000000)) {
    res.status(400).json({ error: "Ongeldig bedrag." });
    return;
  }

  const stripe = new Stripe(key);
  const origin: string = headerString(req.headers.origin) || `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["ideal", "card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: cents,
            product_data: { name: "Druppel — Dār as-Sakīnah" },
          },
        },
      ],
      metadata: { team, kenmerk: "Druppel" },
      payment_intent_data: {
        description: "Druppels van Sakīnah",
        metadata: { team, kenmerk: "Druppel" },
      },
      success_url: `${origin}/?betaald=1`,
      cancel_url: `${origin}/?afgebroken=1#doneren`,
    });
    res.status(200).json({ url: session.url });
  } catch {
    res.status(502).json({ error: "Kon de betaling niet starten." });
  }
};

export default handler;
