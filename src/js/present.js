// Druppels van Sakīnah — /present: kioskscherm voor de staande tablet in de
// moskee. Geen navigatie, geen scrollen: alleen de koepel, het bedrag en de
// QR-code om te doneren, altijd zichtbaar en zichzelf live verversend.
import "../css/tokens.css";
import "../css/base.css";
import "../css/scenes.css";
import "../css/present.css";

import { renderTeller } from "./render.js";
import { bouwKoepel, updateKoepel } from "./koepel.js";
import { startTeller, updateTellerNaar } from "./motion.js";
import { startQrDoneren } from "./interactions.js";
import { campagne } from "../../data/campagne.js";
import { logoMarkup, VIEWBOX_W, VIEWBOX_H } from "./logo-paths.js";

/* --- Stand ophalen: zelfde optelsom als de hoofdsite (Stripe + het
   handmatige buiten-Stripe-bedrag uit campagne.js). --- */
function standCents(stripeCents) {
  return (Number(stripeCents) || 0) + (Number(campagne.buitenStripeCents) || 0);
}

async function haalStripeTotaal() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch("/api/total", {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.ok && typeof data.totalCents === "number" && data.totalCents >= 0) {
      return data.totalCents;
    }
  } catch {
    /* Stripe onbereikbaar: laat de huidige stand staan */
  }
  return null;
}

async function ververStand() {
  const stripe = await haalStripeTotaal();
  if (stripe === null) return;
  const nieuw = standCents(stripe);
  if (nieuw === campagne.opgehaaldCents) return;
  campagne.opgehaaldCents = nieuw;
  renderTeller();
  updateTellerNaar(nieuw);
  updateKoepel();
}

function init() {
  const mini = document.querySelector("[data-logo-mini]");
  if (mini) {
    mini.innerHTML = `<svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" aria-hidden="true">${logoMarkup()}</svg>`;
  }

  // Direct renderen met het bekende buiten-Stripe-bedrag, geen wachten.
  campagne.opgehaaldCents = standCents(0);
  renderTeller();
  bouwKoepel();
  startTeller();
  startQrDoneren();

  // Stripe-donaties erbij tellen en daarna live blijven verversen.
  ververStand();
  setInterval(ververStand, 25000);

  // Tablet staat onbeheerd en langdurig aan: één keer per nacht een schone
  // herlaad, tegen eventuele drift na dagen onafgebroken open te staan.
  setTimeout(() => location.reload(), 6 * 60 * 60 * 1000);
}

init();
