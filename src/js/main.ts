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
  startHeader,
  startStickyCta,
  startLazyVideos,
  plaatsGolfDividers,
} from "./motion.js";
import {
  startIbanKopieren,
  startBedragKiezen,
  startQrDoneren,
  startFaq,
  startVideoCarrousel,
  ververVideoPosters,
} from "./interactions.js";
import { campagne } from "../../data/campagne.js";
import { initI18n, zetTaal, taal, t } from "./i18n.js";
import { inject as injectAnalytics } from "@vercel/analytics";
import { startCookieToestemming } from "./consent.js";
import { standCents, ververStand } from "./stand.js";

/* --- Bedankt-bericht na terugkeer uit de betaling --- */
function toonBedankt(): void {
  const params: URLSearchParams = new URLSearchParams(location.search);
  if (!params.has("betaald") && !params.has("afgebroken")) return;
  const doneren: Element | null = document.querySelector("#doneren");
  if (params.has("betaald") && doneren) {
    const melding: HTMLParagraphElement = document.createElement("p");
    melding.className = "doneer-bedankt";
    melding.setAttribute("role", "status");
    melding.textContent = t("bedankt.tekst");
    doneren.querySelector(".container")?.prepend(melding);
  }
  doneren?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState({}, "", location.pathname + location.hash);
}

function opTaalWissel(): void {
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

  // Videokaarten met een taalgevoelige variant (bv. story-1-AR) tonen meteen
  // de juiste poster na het wisselen van taal.
  ververVideoPosters();
}

function init(): void {
  // Cookieloze, privacyvriendelijke bezoekersstatistieken (Vercel Web Analytics):
  // telt paginaweergaven zonder cookies, zonder persoonsgegevens en zonder
  // cross-site tracking. Zie de privacyverklaring.
  injectAnalytics();

  // Microsoft Clarity (sessie-opnames/heatmaps) laadt pas ná expliciete
  // toestemming via de cookiebanner — dit plaatst wél cookies.
  startCookieToestemming();

  // Taal (bewaarde keuze) + statische teksten toepassen, vóór het renderen
  initI18n(opTaalWissel);
  const taalKnop: Element | null = document.querySelector("[data-taal-knop]");
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
  startStickyCta();
  startLazyVideos();
  startIbanKopieren();
  startBedragKiezen();
  void startQrDoneren();
  startFaq();
  startVideoCarrousel();
  toonBedankt();

  // 4. Stripe-donaties erbij tellen en daarna live blijven verversen,
  //    zodat elke nieuwe donatie vanzelf op de teller verschijnt.
  void ververStand();
  setInterval(ververStand, 25000);
}

init();
