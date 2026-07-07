// Cookietoestemming voor Microsoft Clarity (sessie-opnames/heatmaps — plaatst
// wél cookies, in tegenstelling tot de cookieloze Vercel Web Analytics die
// altijd al aanstond). Clarity laadt pas ná expliciete toestemming; de keuze
// wordt onthouden en is later te wijzigen via [data-cookie-instellingen]
// (link onderaan de privacyverklaring).
const OPSLAG_SLEUTEL = "analyticsToestemming"; // "granted" | "denied"
const CLARITY_PROJECT_ID = "xioeolx2qj";

let _geladen = false;

function ladClarity() {
  if (_geladen || window.clarity) return;
  _geladen = true;
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
}

export function toestemming() {
  try {
    return localStorage.getItem(OPSLAG_SLEUTEL);
  } catch {
    return null;
  }
}

function onthoudToestemming(waarde) {
  try {
    localStorage.setItem(OPSLAG_SLEUTEL, waarde);
  } catch {
    /* privé-/incognitomodus zonder opslag: keuze geldt dan alleen dit bezoek */
  }
}

export function startCookieToestemming() {
  const banner = document.querySelector("[data-cookie-banner]");
  if (!banner) return;

  const huidige = toestemming();
  if (huidige === "granted") {
    ladClarity();
  } else if (huidige !== "denied") {
    banner.hidden = false;
  }

  banner.querySelector("[data-cookie-accepteren]")?.addEventListener("click", () => {
    onthoudToestemming("granted");
    ladClarity();
    banner.hidden = true;
  });
  banner.querySelector("[data-cookie-weigeren]")?.addEventListener("click", () => {
    onthoudToestemming("denied");
    banner.hidden = true;
  });

  // "Cookie-instellingen wijzigen"-link (bv. onderaan de privacyverklaring)
  // heropent de banner. Via delegatie op document, want deze link zit in een
  // data-i18n-html-blok dat bij elke taalwissel opnieuw wordt opgebouwd (een
  // rechtstreeks gebonden listener zou dan verweesd raken op het oude element).
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cookie-instellingen]")) {
      e.preventDefault();
      banner.hidden = false;
    }
  });
}
