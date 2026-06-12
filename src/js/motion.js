// Scroll-choreografie: onthullingen, tellers, sticky knop, lazy video's.
import { campagne } from "../../data/campagne.js";
import { euro, easeOutQuint, reducedMotion } from "./utils.js";

/* --- Onthullingen: alles stijgt op als drijfvermogen --- */
export function startReveals() {
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

/* --- De teller telt op zodra hij in beeld komt --- */
export function startTeller() {
  const el = document.querySelector("[data-countup]");
  if (!el) return;
  const doel = campagne.opgehaaldCents;

  if (reducedMotion()) {
    el.textContent = euro(doel);
    return;
  }
  el.textContent = euro(0);
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const DUUR = 1900;
      let t0 = null;
      const stap = (now) => {
        if (t0 === null) t0 = now;
        const t = Math.min(1, (now - t0) / DUUR);
        el.textContent = euro(doel * easeOutQuint(t));
        if (t < 1) requestAnimationFrame(stap);
      };
      requestAnimationFrame(stap);
    },
    { threshold: 0.5 },
  );
  io.observe(el);
}

/* --- Druppelraster vult zich druppel voor druppel in beeld --- */
export function startDruppelraster() {
  const raster = document.querySelector("[data-druppelraster]");
  if (!raster) return;
  const gevuld = Number(raster.dataset.gevuld || 0);
  const druppels = raster.querySelectorAll(".rasterdruppel");
  const vul = () => {
    for (let i = 0; i < gevuld && i < druppels.length; i++) {
      druppels[i].style.setProperty("--di", i);
      druppels[i].classList.add("is-gevuld");
    }
  };
  if (reducedMotion()) {
    vul();
    return;
  }
  const io = new IntersectionObserver(
    (e) => {
      if (!e[0].isIntersecting) return;
      io.disconnect();
      vul();
    },
    { threshold: 0.3 },
  );
  io.observe(raster);
}

/* --- Teamvoortgangsbalken vullen zich in beeld --- */
export function startTeamBalken() {
  const balken = document.querySelectorAll("[data-balk-pct]");
  const vul = (el) => (el.style.width = `${el.dataset.balkPct}%`);
  if (reducedMotion()) {
    balken.forEach(vul);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
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
export function startHeader() {
  const header = document.querySelector(".site-header");
  const zet = () => header.classList.toggle("is-gescrold", window.scrollY > 24);
  zet();
  window.addEventListener("scroll", zet, { passive: true });
}

/* --- Sticky doneerknop op mobiel ---
   Zichtbaar zodra de hero voorbij is; verbergt zichzelf bij de
   doneer-sectie en de footer (daar staat de knop al). --- */
export function startStickyCta() {
  const cta = document.querySelector("[data-sticky-cta]");
  if (!cta) return;
  cta.hidden = false;

  let heroVoorbij = false;
  let inDoneerZone = false;

  const update = () =>
    cta.classList.toggle("is-zichtbaar", heroVoorbij && !inDoneerZone);

  new IntersectionObserver(
    (e) => {
      heroVoorbij = !e[0].isIntersecting;
      update();
    },
    { threshold: 0.12 },
  ).observe(document.querySelector(".hero"));

  const zone = new IntersectionObserver(
    (entries) => {
      inDoneerZone = entries.some((e) => e.isIntersecting);
      update();
    },
    { threshold: 0.08 },
  );
  ["#doneren", ".site-footer"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) zone.observe(el);
  });
}

/* --- Video's pas laten spelen (en laden) zodra ze in beeld komen --- */
export function startLazyVideos() {
  const videos = document.querySelectorAll("[data-lazy-video], [data-footer-video]");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target;
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
const GOLF_SVG = (vul) => `
  <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
    <path fill="${vul}" opacity="0.35"
      d="M0,52 C140,20 290,20 430,46 C580,74 700,78 860,52 C1020,26 1160,22 1300,44 C1360,54 1410,60 1440,62 L1440,91 L0,91 Z"/>
    <path fill="${vul}"
      d="M0,66 C160,38 320,34 480,56 C640,78 780,82 940,62 C1100,42 1240,40 1380,58 L1440,66 L1440,91 L0,91 Z"/>
  </svg>`;

export function plaatsGolfDividers() {
  const PAPER = "#f2f1ee";
  const NAVY = "#1f2c54";
  const NAVY_DIEP = "#17203d";
  const ZONLICHT = "#fbf4e6"; // moet gelijk zijn aan --c-zonlicht (sectie-voorwie)
  const plekken = [
    [".sectie-koepel", PAPER],
    [".sectie-teams", NAVY],
    [".sectie-betekenis", ZONLICHT],
    [".sectie-faq", NAVY_DIEP],
  ];
  for (const [sel, kleur] of plekken) {
    const sectie = document.querySelector(sel);
    if (!sectie) continue;
    sectie.classList.add("heeft-golf");
    let div = sectie.querySelector(":scope > .golf-divider");
    if (!div) {
      div = document.createElement("div");
      div.className = "golf-divider";
      sectie.append(div);
    }
    div.innerHTML = GOLF_SVG(kleur);
  }
}
