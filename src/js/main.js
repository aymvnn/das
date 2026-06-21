// Druppels van Sakīnah — hoofdmodule
import "../css/tokens.css";
import "../css/base.css";
import "../css/sections.css";
import "../css/scenes.css";

import { renderAlles } from "./render.js";
import { startHeroAnimatie } from "./hero-anim.js";
import { bouwKoepel } from "./koepel.js";
import {
  startReveals,
  startTeller,
  startTeamBalken,
  startDruppelraster,
  startHeader,
  startStickyCta,
  startLazyVideos,
  plaatsGolfDividers,
} from "./motion.js";
import { startIbanKopieren, startBedragKiezen, startQrDoneren, startFaq } from "./interactions.js";
import { campagne } from "../../data/campagne.js";

/* --- Live stand ophalen (Stripe via /api/total) ---
   Lukt het niet (geen backend / offline / nog geen sleutel), dan blijft
   gewoon de waarde in data/campagne.js staan: stille fallback. --- */
async function laadStand() {
  const buitenStripe = Number(campagne.buitenStripeCents) || 0;
  let stripeCents = null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1200);
    const res = await fetch("/api/total", {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok && typeof data.totalCents === "number" && data.totalCents >= 0) {
        stripeCents = data.totalCents;
      }
    }
  } catch {
    /* Stripe onbereikbaar */
  }
  // Totale stand = online Stripe-donaties + handmatig buiten-Stripe-bedrag.
  // Is Stripe onbereikbaar, dan tonen we ten minste de bekende buiten-Stripe-donaties.
  campagne.opgehaaldCents = (stripeCents || 0) + buitenStripe;
}

/* --- Bedankt-bericht na terugkeer uit de betaling --- */
function toonBedankt() {
  const params = new URLSearchParams(location.search);
  if (!params.has("betaald") && !params.has("afgebroken")) return;
  const doneren = document.querySelector("#doneren");
  if (params.has("betaald") && doneren) {
    const melding = document.createElement("p");
    melding.className = "doneer-bedankt";
    melding.setAttribute("role", "status");
    melding.textContent =
      "Bārak Allāhoe fīk — je druppel is binnen. Moge Allah het van je aannemen.";
    doneren.querySelector(".container")?.prepend(melding);
  }
  doneren?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState({}, "", location.pathname + location.hash);
}

async function init() {
  // Direct zichtbaar, geen data nodig: hero meteen tonen (niet wachten op de stand)
  startHeroAnimatie();
  startHeader();
  document
    .querySelectorAll(".hero [data-reveal]")
    .forEach((el) => el.classList.add("is-zichtbaar"));

  // Live stand ophalen (snel; valt stil terug op campagne.js)
  await laadStand();

  // 1. Data de pagina in
  renderAlles();
  plaatsGolfDividers();

  // 2. De koepel-scène (met de actuele stand)
  bouwKoepel();

  // 3. Choreografie & interactie
  startReveals();
  startTeller();
  startTeamBalken();
  startDruppelraster();
  startStickyCta();
  startLazyVideos();
  startIbanKopieren();
  startBedragKiezen();
  startQrDoneren();
  startFaq();
  toonBedankt();
}

init();
