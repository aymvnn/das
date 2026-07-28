// Druppels van Sakīnah — /present: kioskscherm voor de staande tablet in de
// moskee. Geen navigatie, geen scrollen: alleen de koepel, het bedrag en de
// QR-code om te doneren, altijd zichtbaar en zichzelf live verversend.
import "../css/tokens.css";
import "../css/base.css";
import "../css/scenes.css";
import "../css/present.css";

import { renderTeller } from "./render.js";
import { bouwKoepel, startLevendWater } from "./koepel.js";
import { startTeller } from "./motion.js";
import { startQrDoneren } from "./interactions.js";
import { campagne } from "../../data/campagne.js";
import { plaatsLogo } from "./logo-paths.js";
import { standCents, ververStand } from "./stand.js";

// Safari/iOS-only vendor-prefixed Fullscreen API — niet in de standaard DOM-lib.
declare global {
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void> | void;
  }
  interface Document {
    webkitFullscreenElement?: Element | null;
  }
}

/* --- Kioskmodus: volledig scherm + scherm wakker houden ---
   Browsers mogen niet vanzelf naar volledig scherm bij het laden (dat vereist
   één tik). We tonen daarom een discrete "Volledig scherm"-knop die de
   vrijwilliger bij het opstarten één keer aantikt; hij verdwijnt zodra het
   scherm volledig is. Wie de pagina via "Toevoegen aan startscherm" opent,
   start dankzij het manifest sowieso al volledig scherm. --- */
function startKiosk(): void {
  const knop: HTMLElement | null = document.querySelector<HTMLElement>("[data-fullscreen]");
  const el: HTMLElement = document.documentElement;
  const kanVolledig: boolean = !!(el.requestFullscreen || el.webkitRequestFullscreen);

  if (knop && kanVolledig) {
    const alVolledig = (): Element | null | undefined =>
      document.fullscreenElement || document.webkitFullscreenElement;
    const verversKnop = (): void => {
      knop.hidden = !!alVolledig();
    };
    knop.addEventListener("click", async () => {
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      } catch {
        /* geweigerd of niet mogelijk: knop blijft staan */
      }
    });
    document.addEventListener("fullscreenchange", verversKnop);
    document.addEventListener("webkitfullscreenchange", verversKnop);
    verversKnop();
  }

  // Scherm wakker houden zolang de tablet deze pagina toont. De referentie
  // wordt bewust vastgehouden (niet verder gelezen): zonder een levende
  // verwijzing kan de garbage collector de wake lock voortijdig opheffen.
  let wakeLock: WakeLockSentinel | null = null;
  const houdWakker = async (): Promise<void> => {
    try {
      if ("wakeLock" in navigator && document.visibilityState === "visible") {
        wakeLock = await navigator.wakeLock.request("screen");
        void wakeLock;
      }
    } catch {
      /* niet ondersteund of geweigerd */
    }
  };
  void houdWakker();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void houdWakker();
  });
}

function init(): void {
  startKiosk();

  plaatsLogo("[data-logo-mini]");

  // Direct renderen met het bekende buiten-Stripe-bedrag, geen wachten.
  campagne.opgehaaldCents = standCents(0);
  renderTeller();
  bouwKoepel();
  startLevendWater(); // continue, rustige ademing van het wateroppervlak
  startTeller();
  void startQrDoneren();

  // Stripe-donaties erbij tellen en daarna live blijven verversen.
  void ververStand();
  setInterval(ververStand, 25000);

  // Tablet staat onbeheerd en langdurig aan: één keer per nacht een schone
  // herlaad, tegen eventuele drift na dagen onafgebroken open te staan.
  setTimeout(() => location.reload(), 6 * 60 * 60 * 1000);
}

init();
