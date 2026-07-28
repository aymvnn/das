// De Koepel: het logo als levende voortgangsmeter.
// Het waterpeil ín het huis stijgt naar het werkelijke percentage; de
// 16 golfmijlpalen staan als fijne lijnen in het water. De golvenkom
// onder het huis is het al verzamelde water — daar valt zo nu en dan
// een losse druppel in.
import {
  ARTBOARD_TRANSFORM,
  LAAG_TRANSFORM,
  CRESCENT,
  STAR,
  DOME,
  DOME_INNER,
  WAVE_LIGHT,
  WAVE_DARK,
  DROP_PATH,
  VIEWBOX_W,
  VIEWBOX_H,
} from "./logo-paths.js";
import type { PathShape } from "./logo-paths.js";
import {
  percentage,
  golvenBehaald,
  TOTAAL_GOLVEN,
  GOLF_CENTS,
} from "../../data/campagne.js";
import {
  interpolate,
  easeOutQuint,
  easeInQuad,
  easeOutCubic,
  matMul,
  parseMatrix,
  matrixStr,
  svgEl,
  zodraZichtbaar,
  reducedMotion,
  euro,
} from "./utils.js";

// Verwijzingen zodat de koepel live kan meebewegen met nieuwe donaties.
let _mijlpalen: SVGGElement | null = null;
let _basisPeil: number = 0; // de ware waterstand in procenten (zonder ademing)
let _adem: number = 0; // continue, rustige ademings-offset in procenten (kioskmodus)
let _yVoorPct: ((p: number) => number) | null = null; // omzetting procent → y binnen de koepel
let _waterpeilEl: SVGGElement | null = null; // de te verschuiven watergroep

// Combineer basisstand + ademing en teken het wateroppervlak.
function _renderPeil(): void {
  if (!_waterpeilEl || !_yVoorPct) return;
  const p: number = Math.max(0, _basisPeil + _adem);
  _waterpeilEl.setAttribute("transform", `translate(0 ${_yVoorPct(p).toFixed(2)})`);
}
// Zet de ware waterstand (gebruikt door de opbouw- en live-animaties).
function _zetBasis(p: number): void {
  _basisPeil = p;
  _renderPeil();
}

const laag = (paths: PathShape[], cls: string): string => `
  <g transform="${ARTBOARD_TRANSFORM}"><g transform="${LAAG_TRANSFORM}">
    ${paths.map((p) => `<g transform="${p.transform}"><path d="${p.d}" class="${cls}" fill-rule="nonzero"/></g>`).join("")}
  </g></g>`;

// Golvend wateroppervlak: een lint van twee volledige schermbreedtes
// dat horizontaal voorbij drijft (CSS-animatie).
function golfPad(amp: number, golflengte: number, breedte: number = 560): string {
  let d: string = `M-160 0`;
  for (let x = -160; x < breedte - 160; x += golflengte) {
    d += ` q ${golflengte / 4} ${-amp * 2} ${golflengte / 2} 0 q ${golflengte / 4} ${amp * 2} ${golflengte / 2} 0`;
  }
  d += ` v 340 h ${-breedte} Z`;
  return d;
}

export function bouwKoepel(): void {
  const houder: HTMLElement | null = document.querySelector<HTMLElement>("[data-koepel]");
  if (!houder) return;

  const pct: number = percentage();
  const behaald: number = golvenBehaald();

  // Binnencontour van het huis in wortelcoördinaten:
  // artboard · laag · koepeltransform als één matrix op het pad.
  const M: string = matrixStr(
    matMul(matMul(parseMatrix(ARTBOARD_TRANSFORM), parseMatrix(LAAG_TRANSFORM)), parseMatrix(DOME_INNER.transform)),
  );

  houder.innerHTML = `
  <svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" overflow="visible" aria-hidden="true">
    <defs>
      <linearGradient id="k-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#38b6ab" stop-opacity="0.85"/>
        <stop offset="0.5" stop-color="#00847e" stop-opacity="0.92"/>
        <stop offset="1" stop-color="#00746e" stop-opacity="0.97"/>
      </linearGradient>
      <clipPath id="k-inner"><path transform="${M}" d="${DOME_INNER.d}"/></clipPath>
    </defs>

    <!-- meetpad (onzichtbaar) om de binnenruimte op te meten -->
    <g data-meet opacity="0"><path transform="${M}" d="${DOME_INNER.d}"/></g>

    <!-- water in het huis -->
    <g clip-path="url(#k-inner)">
      <rect x="-20" y="-20" width="${VIEWBOX_W + 40}" height="${VIEWBOX_H + 40}" fill="#ffffff" opacity="0.4"/>
      <g data-waterpeil>
        <path class="k-golf k-golf-a" d="${golfPad(1.6, 46)}" />
        <path class="k-golf k-golf-b" d="${golfPad(2.2, 64)}" />
        <rect x="-20" y="2.4" width="${VIEWBOX_W + 40}" height="340" fill="url(#k-water)"/>
      </g>
      <g data-mijlpalen></g>
    </g>

    <!-- het logo zelf -->
    <g>${laag([DOME, CRESCENT, STAR], "vorm-teal")}</g>
    <g>${laag([WAVE_LIGHT], "vorm-mint")}</g>
    <g>${laag([WAVE_DARK], "vorm-teal")}</g>
    <g data-fx></g>
  </svg>`;

  const svg: Element | null = houder.firstElementChild;
  if (!svg) return;
  const meet: SVGGraphicsElement | null = svg.querySelector<SVGGraphicsElement>("[data-meet]");
  if (!meet) return;
  const bbox: DOMRect = meet.getBBox();
  meet.remove();

  const waterpeil: SVGGElement | null = svg.querySelector<SVGGElement>("[data-waterpeil]");
  const mijlpalen: SVGGElement | null = svg.querySelector<SVGGElement>("[data-mijlpalen]");
  const fx: SVGGElement | null = svg.querySelector<SVGGElement>("[data-fx]");
  if (!waterpeil || !mijlpalen || !fx) return;

  const yVoorPct = (p: number): number => bbox.y + bbox.height * (1 - p / 100);

  /* --- 16 mijlpaallijnen in het water --- */
  for (let i = 1; i <= TOTAAL_GOLVEN; i++) {
    const y: number = yVoorPct((i / TOTAAL_GOLVEN) * 100);
    const status: string = i <= behaald ? "is-behaald" : i === behaald + 1 ? "is-volgende" : "";
    const lijn: SVGElement = svgEl("line", {
      x1: bbox.x - 6,
      x2: bbox.x + bbox.width + 6,
      y1: y,
      y2: y,
      class: `mijlpaal ${status}`,
      "data-golf": i,
    });
    const titel: SVGElement = svgEl("title");
    titel.textContent = `Golf ${i}: ${euro(GOLF_CENTS * i)}${i <= behaald ? " ✓" : ""}`;
    lijn.append(titel);
    mijlpalen.append(lijn);
  }

  /* --- waterpeil animeren naar het echte percentage --- */
  _yVoorPct = yVoorPct;
  _waterpeilEl = waterpeil;
  _mijlpalen = mijlpalen;
  _zetBasis(0.0001);

  if (reducedMotion()) {
    _zetBasis(pct);
  } else {
    zodraZichtbaar(houder, () => {
      const DUUR: number = 2100;
      let t0: number | null = null;
      const stap = (now: number): void => {
        if (t0 === null) t0 = now;
        const t: number = Math.min(1, (now - t0) / DUUR);
        _zetBasis(easeOutQuint(t) * pct);
        if (t < 1) requestAnimationFrame(stap);
      };
      requestAnimationFrame(stap);
    });
  }

  /* --- koppeling met de mijlpalenlijst ernaast --- */
  document.querySelectorAll<HTMLElement>(".golf-item").forEach((item) => {
    const i: string | undefined = item.dataset.golf;
    if (!i) return;
    const lijn: Element | null = mijlpalen.querySelector(`[data-golf="${i}"]`);
    if (!lijn) return;
    item.addEventListener("mouseenter", () => lijn.classList.add("is-actief"));
    item.addEventListener("mouseleave", () => lijn.classList.remove("is-actief"));
  });

  /* --- af en toe valt een druppel in de kom onder het huis --- */
  if (reducedMotion()) return;
  const drop: SVGElement = svgEl("path", { d: DROP_PATH, class: "vorm-teal", opacity: 0 });
  const rimpel: SVGElement = svgEl("ellipse", { class: "rimpel", fill: "none", "stroke-width": 1.1, opacity: 0 });
  fx.append(drop, rimpel);

  let bezig: boolean = false;
  const KOM_Y: number = 201; // wateroppervlak van de kom onder het huis

  const valDruppel = (): void => {
    if (bezig || document.hidden) return;
    bezig = true;
    const x: number = Math.random() < 0.5 ? 44 + Math.random() * 14 : 150 + Math.random() * 14;
    const t0: number = performance.now();
    const VAL: number = 620, RIP: number = 700;
    const stap = (now: number): void => {
      const d: number = now - t0;
      if (d <= VAL) {
        const t: number = easeInQuad(d / VAL);
        drop.setAttribute("opacity", String(Math.min(1, d / 90)));
        drop.setAttribute("transform", `translate(${x},${interpolate(t, [0, 1], [-30, KOM_Y]).toFixed(2)})`);
        requestAnimationFrame(stap);
      } else if (d <= VAL + RIP) {
        drop.setAttribute("opacity", "0");
        const t: number = (d - VAL) / RIP;
        rimpel.setAttribute("cx", String(x));
        rimpel.setAttribute("cy", String(KOM_Y));
        rimpel.setAttribute("rx", (easeOutCubic(t) * 9).toFixed(2));
        rimpel.setAttribute("ry", (easeOutCubic(t) * 2.6).toFixed(2));
        rimpel.setAttribute("opacity", (0.8 * (1 - t)).toFixed(3));
        requestAnimationFrame(stap);
      } else {
        rimpel.setAttribute("opacity", "0");
        bezig = false;
      }
    };
    requestAnimationFrame(stap);
  };

  let timer: number | null = null;
  zodraZichtbaar(houder, () => {
    valDruppel();
    timer = window.setInterval(valDruppel, 6500 + Math.random() * 2000);
  }, { threshold: 0.4 });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer) {
      clearInterval(timer);
      timer = null;
    } else if (!document.hidden && !timer) {
      timer = window.setInterval(valDruppel, 6500 + Math.random() * 2000);
    }
  });
}

/* --- Live bijwerken: waterpeil + mijlpalen naar de huidige stand animeren --- */
export function updateKoepel(): void {
  if (!_yVoorPct) return;
  const nieuwPct: number = percentage();
  const behaald: number = golvenBehaald();
  if (_mijlpalen) {
    _mijlpalen.querySelectorAll<SVGLineElement>(".mijlpaal").forEach((lijn) => {
      const i: number = Number(lijn.dataset.golf);
      lijn.classList.toggle("is-behaald", i <= behaald);
      lijn.classList.toggle("is-volgende", i === behaald + 1);
    });
  }
  if (reducedMotion()) {
    _zetBasis(nieuwPct);
    return;
  }
  const van: number = _basisPeil;
  const t0: number = performance.now();
  const DUUR: number = 1400;
  const stap = (now: number): void => {
    const t: number = Math.min(1, (now - t0) / DUUR);
    _zetBasis(van + (nieuwPct - van) * easeOutQuint(t));
    if (t < 1) requestAnimationFrame(stap);
  };
  requestAnimationFrame(stap);
}

/* --- Levend water (kioskmodus) ---
   Een trage, continue ademing van het wateroppervlak, boven op de drijvende
   golven en de vallende druppels. Zo blijft de koepel van een afstand zichtbaar
   in beweging en straalt hij rust uit. De offset wordt bij de ware waterstand
   opgeteld, dus opbouw- en live-updates blijven gewoon werken. --- */
let _ademtLoopt: boolean = false;
export function startLevendWater(ampPct: number = 0.85, periodeMs: number = 6200): void {
  if (reducedMotion() || !_yVoorPct || _ademtLoopt) return;
  _ademtLoopt = true;
  const t0: number = performance.now();
  const loop = (now: number): void => {
    // sin² → een zachte, asymmetrische deining (langzaam op, rustig neer)
    const fase: number = ((now - t0) / periodeMs) * Math.PI * 2;
    _adem = Math.sin(fase) * ampPct;
    _renderPeil();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
