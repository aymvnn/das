// Scroll-choreografie: onthullingen, tellers, sticky knop, lazy video's.
import { campagne } from "../../data/campagne.js";
import { euro, easeOutQuint, reducedMotion } from "./utils.js";

/* --- Onthullingen: alles stijgt op als drijfvermogen --- */
export function startReveals(): void {
  const els = document.querySelectorAll("[data-reveal]");
  if (reducedMotion()) {
    els.forEach((el) => el.classList.add("is-zichtbaar"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-zichtbaar");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.16, rootMargin: "0px 0px -4% 0px" },
  );
  els.forEach((el) => io.observe(el));
}

/* --- De teller ---
   Staat boven de vouw, dus meteen animeren (geen scroll-trigger nodig).
   updateTellerNaar() laat 'm live naar een nieuw totaal lopen bij verse donaties. --- */
let tellerEl: HTMLElement | null = null;
let tellerHuidig: number = 0; // laatst getoonde waarde in centen
let tellerRaf: number | null = null;

function animeerTeller(naarCents: number, duur: number): void {
  if (!tellerEl) return;
  const el: HTMLElement = tellerEl;
  if (tellerRaf) cancelAnimationFrame(tellerRaf);
  const van: number = tellerHuidig;
  let t0: number | null = null;
  const stap = (now: number): void => {
    if (t0 === null) t0 = now;
    const t: number = Math.min(1, (now - t0) / duur);
    tellerHuidig = van + (naarCents - van) * easeOutQuint(t);
    el.textContent = euro(tellerHuidig);
    if (t < 1) {
      tellerRaf = requestAnimationFrame(stap);
    } else {
      tellerHuidig = naarCents;
      el.textContent = euro(naarCents);
      tellerRaf = null;
    }
  };
  tellerRaf = requestAnimationFrame(stap);
}

function zetTellerDirect(cents: number): void {
  if (tellerRaf) {
    cancelAnimationFrame(tellerRaf);
    tellerRaf = null;
  }
  tellerHuidig = cents;
  if (tellerEl) tellerEl.textContent = euro(cents);
}

export function startTeller(): void {
  tellerEl = document.querySelector<HTMLElement>("[data-countup]");
  if (!tellerEl) return;
  const doel: number = campagne.opgehaaldCents;
  // Onzichtbare tab of reduced-motion: geen rAF-animatie (die pauzeert dan),
  // maar meteen het juiste bedrag tonen — nooit een blijvende € 0.
  if (reducedMotion() || document.hidden) {
    zetTellerDirect(doel);
    return;
  }
  tellerHuidig = 0;
  tellerEl.textContent = euro(0);
  animeerTeller(doel, 1900);
}

export function updateTellerNaar(nieuwCents: number): void {
  if (!tellerEl) return;
  if (Math.round(nieuwCents) === Math.round(tellerHuidig)) return;
  if (reducedMotion() || document.hidden) {
    zetTellerDirect(nieuwCents);
    return;
  }
  animeerTeller(nieuwCents, 1100);
}

/* --- Druppelraster vult zich druppel voor druppel in beeld --- */
export function startDruppelraster(): void {
  const raster: HTMLElement | null = document.querySelector<HTMLElement>("[data-druppelraster]");
  if (!raster) return;
  const gevuld: number = Number(raster.dataset.gevuld || 0);
  const druppels: NodeListOf<SVGElement> = raster.querySelectorAll<SVGElement>(".rasterdruppel");
  const vul = (): void => {
    const n: number = druppels.length;
    // Van onderaf vullen: het water stijgt (bottom-up), onderste druppel eerst.
    for (let k = 0; k < gevuld && k < n; k++) {
      const idx: number = n - 1 - k;
      const druppel: SVGElement | undefined = druppels[idx];
      if (!druppel) continue;
      druppel.style.setProperty("--di", String(k));
      druppel.classList.add("is-gevuld");
    }
  };
  if (reducedMotion()) {
    vul();
    return;
  }
  const io = new IntersectionObserver(
    (e) => {
      const eerste: IntersectionObserverEntry | undefined = e[0];
      if (!eerste || !eerste.isIntersecting) return;
      io.disconnect();
      vul();
    },
    { threshold: 0.3 },
  );
  io.observe(raster);
}

/* --- Teamvoortgangsbalken vullen zich in beeld --- */
export function startTeamBalken(): void {
  const balken: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>("[data-balk-pct]");
  const vul = (el: HTMLElement): void => {
    el.style.width = `${el.dataset.balkPct}%`;
  };
  if (reducedMotion()) {
    balken.forEach(vul);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.target instanceof HTMLElement) {
          vul(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.6 },
  );
  balken.forEach((el) => io.observe(el));
}

/* --- Header krijgt een rug zodra je scrolt --- */
export function startHeader(): void {
  const header: HTMLElement | null = document.querySelector<HTMLElement>(".site-header");
  if (!header) return;
  const zet = (): boolean => header.classList.toggle("is-gescrold", window.scrollY > 24);
  zet();
  window.addEventListener("scroll", zet, { passive: true });
}

/* --- Sticky doneerknop op mobiel ---
   Zichtbaar zodra de hero voorbij is; verbergt zichzelf bij de
   doneer-sectie en de footer (daar staat de knop al). --- */
export function startStickyCta(): void {
  const cta: HTMLElement | null = document.querySelector<HTMLElement>("[data-sticky-cta]");
  if (!cta) return;
  cta.hidden = false;

  let heroVoorbij: boolean = false;
  let inDoneerZone: boolean = false;

  const update = (): boolean =>
    cta.classList.toggle("is-zichtbaar", heroVoorbij && !inDoneerZone);

  const hero: Element | null = document.querySelector(".hero");
  if (hero) {
    new IntersectionObserver(
      (e) => {
        const eerste: IntersectionObserverEntry | undefined = e[0];
        heroVoorbij = eerste ? !eerste.isIntersecting : false;
        update();
      },
      { threshold: 0.12 },
    ).observe(hero);
  }

  const zone = new IntersectionObserver(
    (entries) => {
      inDoneerZone = entries.some((e) => e.isIntersecting);
      update();
    },
    { threshold: 0.08 },
  );
  ["#doneren", ".site-footer"].forEach((sel) => {
    const el: Element | null = document.querySelector(sel);
    if (el) zone.observe(el);
  });
}

/* --- Video's pas laten spelen (en laden) zodra ze in beeld komen --- */
export function startLazyVideos(): void {
  const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll<HTMLVideoElement>(
    "[data-lazy-video], [data-footer-video]",
  );
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!(e.target instanceof HTMLVideoElement)) continue;
        const v: HTMLVideoElement = e.target;
        if (e.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      }
    },
    { rootMargin: "180px 0px" },
  );
  videos.forEach((v) => io.observe(v));
}

/* --- Golf-overgangen tussen secties --- */
const GOLF_SVG = (vul: string): string => `
  <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
    <path fill="${vul}" opacity="0.35"
      d="M0,52 C140,20 290,20 430,46 C580,74 700,78 860,52 C1020,26 1160,22 1300,44 C1360,54 1410,60 1440,62 L1440,91 L0,91 Z"/>
    <path fill="${vul}"
      d="M0,66 C160,38 320,34 480,56 C640,78 780,82 940,62 C1100,42 1240,40 1380,58 L1440,66 L1440,91 L0,91 Z"/>
  </svg>`;

export function plaatsGolfDividers(): void {
  const NAVY: string = "#1f2c54";
  const NAVY_DIEP: string = "#17203d";
  const ZONLICHT: string = "#fbf4e6"; // moet gelijk zijn aan --c-zonlicht (sectie-voorwie)
  const plekken: Array<[string, string]> = [
    [".sectie-koepel", ZONLICHT],
    [".sectie-teams", NAVY],
    [".sectie-betekenis", ZONLICHT],
    [".sectie-faq", NAVY_DIEP],
  ];
  for (const [sel, kleur] of plekken) {
    const sectie: HTMLElement | null = document.querySelector<HTMLElement>(sel);
    if (!sectie) continue;
    sectie.classList.add("heeft-golf");
    let div: HTMLElement | null = sectie.querySelector<HTMLElement>(":scope > .golf-divider");
    if (!div) {
      div = document.createElement("div");
      div.className = "golf-divider";
      sectie.append(div);
    }
    div.innerHTML = GOLF_SVG(kleur);
  }
}
