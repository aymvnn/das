// Privacypagina: stijlen, logo, maillink en tweetaligheid (NL/AR + RTL).
import "../css/tokens.css";
import "../css/base.css";
import "../css/sections.css";
import "../css/scenes.css";

import { campagne } from "../../data/campagne.js";
import { plaatsLogo } from "./logo-paths.js";
import { initI18n, zetTaal, taal, t } from "./i18n.js";
import { inject as injectAnalytics } from "@vercel/analytics";
import { startCookieToestemming } from "./consent.js";

// Zelfde cookieloze bezoekersstatistieken als op de hoofdpagina.
injectAnalytics();

// Zelfde cookiebanner voor Microsoft Clarity als op de hoofdpagina, plus de
// "cookie-instellingen wijzigen"-link hieronder op deze pagina.
startCookieToestemming();

plaatsLogo("[data-logo-mini]");

// De maillink toont het e-mailadres zelf (geen data-i18n op de <a>, zodat de
// vertaalmachine de tekst niet overschrijft).
document.querySelectorAll<HTMLAnchorElement>("[data-mail-contact]").forEach((el) => {
  el.href = `mailto:${campagne.contactEmail}?subject=${encodeURIComponent("Privacy — Druppels van Sakīnah")}`;
  el.textContent = campagne.contactEmail;
});

// Documenttitel meebewegen met de taal.
function zetTitel(): void {
  document.title = t("privacy.docTitle");
}

// Bewaarde taalkeuze toepassen (dir/lang/Cairo/teksten) en de knop bedraden.
initI18n(zetTitel);
zetTitel();
const taalKnop: Element | null = document.querySelector("[data-taal-knop]");
if (taalKnop) {
  taalKnop.addEventListener("click", () => zetTaal(taal() === "ar" ? "nl" : "ar"));
}
