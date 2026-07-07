// Druppels van Sakīnah — hoofdmodule
import "../css/tokens.css";
import "../css/base.css";
import "../css/sections.css";
import "../css/scenes.css";

import { renderAlles, renderTeller } from "./render.js";
import { startHeroAnimatie } from "./hero-anim.js";
import { bouwKoepel, updateKoepel } from "./koepel.js";
import {
  startReveals,
  startTeller,
  updateTellerNaar,
  startTeamBalken,
  startDruppelraster,
  startHeader,
  startStickyCta,
  startLazyVideos,
  plaatsGolfDividers,
} from "./motion.js";
import { startIbanKopieren, startBedragKiezen, startQrDoneren, startFaq } from "./interactions.js";
import { campagne } from "../../data/campagne.js";
import { initI18n, zetTaal, taal, t } from "./i18n.js";
import { inject as injectAnalytics } from "@vercel/analytics";

/* --- Stand ophalen ---
   De totale stand = online Stripe-donaties (/api/total) + het handmatige
   buiten-Stripe-bedrag uit campagne.js. We renderen eerst meteen met het
   buiten-Stripe-bedrag (geen wachten), tellen daarna de Stripe-donaties erbij,
   en verversen periodiek zodat nieuwe donaties vanzelf op de teller verschijnen. --- */
function standCents(stripeCents) {
  return (Number(stripeCents) || 0) + (Number(campagne.buitenStripeCents) || 0);
}

async function haalStripeTotaal() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch("/api/total", {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.ok && typeof data.totalCents === "number" && data.totalCents >= 0) {
      return data.totalCents;
    }
  } catch {
    /* Stripe onbereikbaar */
  }
  return null;
}

async function ververStand() {
  const stripe = await haalStripeTotaal();
  if (stripe === null) return; // API onbereikbaar: houd de huidige stand
  const nieuw = standCents(stripe);
  if (nieuw === campagne.opgehaaldCents) return;
  campagne.opgehaaldCents = nieuw;
  renderTeller(); // pct / druppels / "nog X te gaan" bijwerken
  updateTellerNaar(nieuw); // teller naar het nieuwe bedrag laten lopen
  updateKoepel(); // waterpeil meebewegen
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
    melding.textContent = t("bedankt.tekst");
    doneren.querySelector(".container")?.prepend(melding);
  }
  doneren?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState({}, "", location.pathname + location.hash);
}

function opTaalWissel() {
  // Dynamische, datagedreven blokken (teller, teams, acties, overdracht,
  // gedeelde WhatsApp-tekst) opnieuw in de gekozen taal opbouwen. renderAlles
  // is idempotent: teams-/actielijsten worden eerst geleegd.
  renderAlles();

  // Nieuw opgebouwde teams/acties meteen tonen (geen her-animatie/flits) en
  // hun voortgangsbalken opnieuw laten vullen.
  document
    .querySelectorAll("[data-teams-lijst] [data-reveal], [data-acties-lijst] [data-reveal]")
    .forEach((el) => el.classList.add("is-zichtbaar"));
  startTeamBalken();
}

function init() {
  // Cookieloze, privacyvriendelijke bezoekersstatistieken (Vercel Web Analytics):
  // telt paginaweergaven zonder cookies, zonder persoonsgegevens en zonder
  // cross-site tracking. Zie de privacyverklaring.
  injectAnalytics();

  // Taal (bewaarde keuze) + statische teksten toepassen, vóór het renderen
  initI18n(opTaalWissel);
  const taalKnop = document.querySelector("[data-taal-knop]");
  if (taalKnop) {
    taalKnop.addEventListener("click", () => zetTaal(taal() === "ar" ? "nl" : "ar"));
  }

  // Hero meteen tonen (geen data nodig)
  startHeroAnimatie();
  startHeader();
  document
    .querySelectorAll(".hero [data-reveal]")
    .forEach((el) => el.classList.add("is-zichtbaar"));

  // Direct renderen met het bekende buiten-Stripe-bedrag (instant, geen wachten)
  campagne.opgehaaldCents = standCents(0);

  // 1. Data de pagina in
  renderAlles();
  plaatsGolfDividers();

  // 2. De koepel-scène
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

  // 4. Stripe-donaties erbij tellen en daarna live blijven verversen,
  //    zodat elke nieuwe donatie vanzelf op de teller verschijnt.
  ververStand();
  setInterval(ververStand, 25000);
}

init();
