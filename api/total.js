// Leest de actuele stand rechtstreeks bij Stripe op (som van geslaagde betalingen),
// zonder database. Gecachet aan de rand zodat Stripe niet bij elke pageview wordt bevraagd.
// Vereist de omgevingsvariabele STRIPE_SECRET_KEY (in Vercel).
import Stripe from "stripe";

export default async function handler(req, res) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Geen sleutel: de site valt terug op de waarde in data/campagne.js
    return res.status(503).json({ ok: false });
  }

  const stripe = new Stripe(key);
  try {
    let totalCents = 0;
    let count = 0;
    const teams = {};

    // Autopaginerend: telt ALLE geslaagde EUR-betalingen op.
    // Dit Stripe-account (ayman@trefpunt-capelle.nl) is uitsluitend voor de
    // stichting, dus elke betaling = een donatie (via welke methode dan ook).
    // LET OP: zou dit account ooit ook niet-donaties verwerken, dan moet hier
    // weer gefilterd worden op metadata.kenmerk === "Druppel".
    for await (const pi of stripe.paymentIntents.list({ limit: 100 })) {
      if (pi.status !== "succeeded" || pi.currency !== "eur") continue;
      const meta = pi.metadata || {};
      const amt = pi.amount_received || pi.amount || 0;
      totalCents += amt;
      count += 1;
      const team = meta.team || "";
      if (team) teams[team] = (teams[team] || 0) + amt;
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ ok: true, totalCents, count, teams });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
}
