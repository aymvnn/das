// Cookietoestemming voor Microsoft Clarity (sessie-opnames/heatmaps — plaatst
// wél cookies, in tegenstelling tot de cookieloze Vercel Web Analytics die
// altijd al aanstond). Clarity laadt pas ná expliciete toestemming; de keuze
// wordt onthouden en is later te wijzigen via [data-cookie-instellingen]
// (link onderaan de privacyverklaring).
const OPSLAG_SLEUTEL: string = "analyticsToestemming"; // "granted" | "denied"
const CLARITY_PROJECT_ID: string = "xioeolx2qj";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

let _geladen: boolean = false;

function ladClarity(): void {
  if (_geladen || window.clarity) return;
  _geladen = true;

  const clarity: ClarityFn = (...args: unknown[]) => {
    (clarity.q ??= []).push(args);
  };
  window.clarity = clarity;

  const script: HTMLScriptElement = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  const eerste: HTMLScriptElement | undefined = document.getElementsByTagName("script")[0];
  eerste?.parentNode?.insertBefore(script, eerste);
}

export function toestemming(): string | null {
  try {
    return localStorage.getItem(OPSLAG_SLEUTEL);
  } catch {
    return null;
  }
}

function onthoudToestemming(waarde: string): void {
  try {
    localStorage.setItem(OPSLAG_SLEUTEL, waarde);
  } catch {
    /* privé-/incognitomodus zonder opslag: keuze geldt dan alleen dit bezoek */
  }
}

export function startCookieToestemming(): void {
  const banner: HTMLElement | null = document.querySelector<HTMLElement>("[data-cookie-banner]");
  if (!banner) return;

  const huidige: string | null = toestemming();
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
    if (!(e.target instanceof Element)) return;
    if (e.target.closest("[data-cookie-instellingen]")) {
      e.preventDefault();
      banner.hidden = false;
    }
  });
}
