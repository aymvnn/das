// Gedeelde "haal de actuele donatiestand op"-logica voor de hoofdpagina
// (main.ts) en het kioskscherm (present.ts): de totale stand = online
// Stripe-donaties (/api/total) + het handmatige buiten-Stripe-bedrag uit
// campagne.js. ververStand() telt de Stripe-donaties erbij en werkt teller
// + koepel bij; wordt periodiek herhaald zodat nieuwe donaties vanzelf
// verschijnen.
import { campagne } from "../../data/campagne.js";
import { renderTeller } from "./render.js";
import { updateTellerNaar } from "./motion.js";
import { updateKoepel } from "./koepel.js";

interface TotaalResponse {
  ok: boolean;
  totalCents?: number;
}

export function standCents(stripeCents: number | null): number {
  return (Number(stripeCents) || 0) + (Number(campagne.buitenStripeCents) || 0);
}

async function haalStripeTotaal(): Promise<number | null> {
  try {
    const ctrl: AbortController = new AbortController();
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => ctrl.abort(), 8000);
    const res: Response = await fetch("/api/total", {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data: TotaalResponse = await res.json();
    if (data && data.ok && typeof data.totalCents === "number" && data.totalCents >= 0) {
      return data.totalCents;
    }
  } catch {
    /* Stripe onbereikbaar: laat de huidige stand staan */
  }
  return null;
}

export async function ververStand(): Promise<void> {
  const stripe: number | null = await haalStripeTotaal();
  if (stripe === null) return; // API onbereikbaar: houd de huidige stand
  const nieuw: number = standCents(stripe);
  if (nieuw === campagne.opgehaaldCents) return;
  campagne.opgehaaldCents = nieuw;
  renderTeller(); // pct / druppels / "nog X te gaan" bijwerken
  updateTellerNaar(nieuw); // teller naar het nieuwe bedrag laten lopen
  updateKoepel(); // waterpeil meebewegen
}
