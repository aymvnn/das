// Maakt een Stripe Checkout-sessie (iDEAL/creditcard) voor het gekozen bedrag.
// Vereist de omgevingsvariabele STRIPE_SECRET_KEY (in Vercel, NOOIT in de code).
import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST." });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(503).json({ error: "Betalen is nog niet geconfigureerd." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { body = {}; }
  }
  const cents = Math.round(Number(body && body.cents) || 0);
  const team = String((body && body.team) || "").slice(0, 80);

  // € 1 t/m € 1.000.000 (in centen)
  if (!(cents >= 100 && cents <= 100000000)) {
    return res.status(400).json({ error: "Ongeldig bedrag." });
  }

  const stripe = new Stripe(key);
  const origin = req.headers.origin || `https://${req.headers.host}`;

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
    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(502).json({ error: "Kon de betaling niet starten." });
  }
}
