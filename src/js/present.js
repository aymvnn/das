// Druppels van Sakīnah — /present: kioskscherm voor de staande tablet in de
// moskee. Geen navigatie, geen scrollen: alleen de koepel, het bedrag en de
// QR-code om te doneren, altijd zichtbaar en zichzelf live verversend.
import "../css/tokens.css";
import "../css/base.css";
import "../css/scenes.css";
import "../css/present.css";

import { renderTeller } from "./render.js";
import { bouwKoepel, updateKoepel, startLevendWater } from "./koepel.js";
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

/* --- Kioskmodus: volledig scherm + scherm wakker houden ---
   Browsers mogen niet vanzelf naar volledig scherm bij het laden (dat vereist
   één tik). We tonen daarom een discrete "Volledig scherm"-knop die de
   vrijwilliger bij het opstarten één keer aantikt; hij verdwijnt zodra het
   scherm volledig is. Wie de pagina via "Toevoegen aan startscherm" opent,
   start dankzij het manifest sowieso al volledig scherm. --- */
function startKiosk() {
  const knop = document.querySelector("[data-fullscreen]");
  const el = document.documentElement;
  const kanVolledig = !!(el.requestFullscreen || el.webkitRequestFullscreen);

  if (knop && kanVolledig) {
    const alVolledig = () => document.fullscreenElement || document.webkitFullscreenElement;
    const verversKnop = () => {
      knop.hidden = !!alVolledig();
    };
    knop.addEventListener("click", async () => {
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } catch {
        /* geweigerd of niet mogelijk: knop blijft staan */
      }
    });
    document.addEventListener("fullscreenchange", verversKnop);
    document.addEventListener("webkitfullscreenchange", verversKnop);
    verversKnop();
  }

  // Scherm wakker houden zolang de tablet deze pagina toont.
  let wakeLock = null;
  const houdWakker = async () => {
    try {
      if ("wakeLock" in navigator && document.visibilityState === "visible") {
        wakeLock = await navigator.wakeLock.request("screen");
      }
    } catch {
      /* niet ondersteund of geweigerd */
    }
  };
  houdWakker();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") houdWakker();
  });
}

function init() {
  startKiosk();

  const mini = document.querySelector("[data-logo-mini]");
  if (mini) {
    mini.innerHTML = `<svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" aria-hidden="true">${logoMarkup()}</svg>`;
  }

  // Direct renderen met het bekende buiten-Stripe-bedrag, geen wachten.
  campagne.opgehaaldCents = standCents(0);
  renderTeller();
  bouwKoepel();
  startLevendWater(); // continue, rustige ademing van het wateroppervlak
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
