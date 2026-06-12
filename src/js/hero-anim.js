// Hero-animatie: native SVG-port van de Remotion-compositie (das-logo-video).
// Verhaal in drie fasen (30 fps, 135 frames = 4,5 s):
//   1. 0–77    acht druppels vallen gestaffeld; elke inslag tilt de waterlijn op
//   2. 70–116  de koepel met maan en ster rijst in één beweging uit het water
//   3. 116–…   rustmoment met nauwelijks zichtbare deining, daarna blijft het
//              water leven: om de paar seconden valt een losse druppel.
import {
  ARTBOARD_TRANSFORM,
  LAAG_TRANSFORM,
  CRESCENT,
  STAR,
  DOME,
  WAVE_LIGHT,
  WAVE_DARK,
  DROP_PATH,
  VIEWBOX_W,
  VIEWBOX_H,
} from "./logo-paths.js";
import {
  interpolate,
  easeInQuad,
  easeOutCubic,
  easeInOutCubic,
  svgEl,
  reducedMotion,
} from "./utils.js";

const FPS = 30;
const EIND_FRAME = 135;
const FALL = 14;
const STEP = 14;
const RIPPLE = 20;
const WATER_BODEM = 293;
const WATER_TOP = 193;
const DROPS = [
  { x: 115, start: 0 },
  { x: 130, start: 7 },
  { x: 95, start: 14 },
  { x: 145, start: 21 },
  { x: 70, start: 28 },
  { x: 160, start: 35 },
  { x: 45, start: 42 },
  { x: 105, start: 49 },
];
const WATER_STAP = (WATER_BODEM - WATER_TOP) / DROPS.length;
const REVEAL_START = 70;
const REVEAL_DUUR = 46;
const SWAY_FRAME = 116;
const SWAY_PERIODE = 56;
const START_Y = -42; // boven het beeld

const waterLevelAt = (frame) => {
  let level = WATER_BODEM;
  for (const drop of DROPS) {
    const inslag = drop.start + FALL;
    level -= WATER_STAP * interpolate(frame, [inslag, inslag + STEP], [0, 1], easeOutCubic);
  }
  return level;
};

const laag = (paths, cls) => `
  <g transform="${ARTBOARD_TRANSFORM}"><g transform="${LAAG_TRANSFORM}">
    ${paths.map((p) => `<g transform="${p.transform}"><path d="${p.d}" class="${cls}" fill-rule="nonzero"/></g>`).join("")}
  </g></g>`;

export function startHeroAnimatie() {
  const houder = document.querySelector("[data-hero-anim]");
  if (!houder) return;

  const id = "hero";
  houder.innerHTML = `
  <svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" overflow="visible" role="img"
       aria-label="Logo van Dār as-Sakīnah: druppels vullen het water waaruit de koepel oprijst">
    <defs>
      <clipPath id="${id}-koepel"><rect x="-20" y="196" width="${VIEWBOX_W + 40}" height="${VIEWBOX_H + 40}"/></clipPath>
      <clipPath id="${id}-licht"><rect x="-20" y="${WATER_BODEM}" width="${VIEWBOX_W + 40}" height="60"/></clipPath>
      <clipPath id="${id}-donker"><rect x="-20" y="${WATER_BODEM}" width="${VIEWBOX_W + 40}" height="60"/></clipPath>
    </defs>
    <g clip-path="url(#${id}-koepel)" data-koepelgroep opacity="0.4">${laag([DOME, CRESCENT, STAR], "vorm-teal")}</g>
    <g clip-path="url(#${id}-licht)" data-lichtgroep>${laag([WAVE_LIGHT], "vorm-mint")}</g>
    <g clip-path="url(#${id}-donker)" data-donkergroep>${laag([WAVE_DARK], "vorm-teal")}</g>
    <g data-fx></g>
  </svg>`;

  const svg = houder.firstElementChild;
  const koepelGroep = svg.querySelector("[data-koepelgroep]");
  const koepelRect = svg.querySelector(`#${id}-koepel rect`);
  const lichtRect = svg.querySelector(`#${id}-licht rect`);
  const donkerRect = svg.querySelector(`#${id}-donker rect`);
  const lichtGroep = svg.querySelector("[data-lichtgroep]");
  const donkerGroep = svg.querySelector("[data-donkergroep]");
  const fx = svg.querySelector("[data-fx]");

  // Vaste druppel- en rimpel-elementen (hergebruikt per frame)
  const dropEls = DROPS.map(() => {
    const p = svgEl("path", { d: DROP_PATH, class: "vorm-teal", opacity: 0 });
    fx.append(p);
    return p;
  });
  const rippleEls = DROPS.map(() => {
    const e = svgEl("ellipse", {
      class: "rimpel",
      fill: "none",
      "stroke-width": 1.1,
      opacity: 0,
    });
    fx.append(e);
    return e;
  });

  const zetWater = (level) => {
    const h = VIEWBOX_H - level + 25;
    lichtRect.setAttribute("y", level);
    lichtRect.setAttribute("height", h);
    donkerRect.setAttribute("y", level);
    donkerRect.setAttribute("height", h);
  };

  const zetKoepel = (reveal) => {
    const clipY = interpolate(reveal, [0, 1], [196, 5]);
    koepelRect.setAttribute("y", clipY);
    koepelRect.setAttribute("height", VIEWBOX_H - clipY + 20);
    koepelGroep.setAttribute("opacity", interpolate(reveal, [0, 0.6], [0.4, 1]));
  };

  const zetSway = (frame) => {
    const amp = interpolate(frame, [SWAY_FRAME - 6, SWAY_FRAME + 6], [0, 2]);
    const fase = ((frame - SWAY_FRAME) / SWAY_PERIODE) * Math.PI * 2;
    donkerGroep.style.transform = `translateY(${(amp * Math.sin(fase)).toFixed(2)}px)`;
    lichtGroep.style.transform = `translateY(${(amp * 0.85 * Math.sin(fase + 0.6)).toFixed(2)}px)`;
  };

  const tekenDrop = (i, frame) => {
    const drop = DROPS[i];
    const inslag = drop.start + FALL;
    const inslagY = waterLevelAt(inslag);
    const fallT = interpolate(frame, [drop.start, inslag], [0, 1], easeInQuad);
    const y = interpolate(fallT, [0, 1], [START_Y, inslagY]);
    const rek = 1 + 0.15 * Math.sin(fallT * Math.PI);
    const op =
      interpolate(frame, [drop.start, drop.start + 3], [0, 1]) *
      interpolate(frame, [inslag - 2, inslag], [1, 0]);

    const el = dropEls[i];
    if (op > 0.01) {
      el.setAttribute("opacity", op.toFixed(3));
      el.setAttribute("transform", `translate(${drop.x},${y.toFixed(2)}) scale(1,${rek.toFixed(3)})`);
    } else {
      el.setAttribute("opacity", 0);
    }

    const rip = rippleEls[i];
    if (frame >= inslag && frame <= inslag + RIPPLE) {
      const t = (frame - inslag) / RIPPLE;
      const schaal = easeOutCubic(t);
      const ripY = Math.min(inslagY, waterLevelAt(frame));
      const maxR = interpolate(inslagY, [WATER_TOP, WATER_BODEM], [11, 7]);
      rip.setAttribute("cx", drop.x);
      rip.setAttribute("cy", ripY);
      rip.setAttribute("rx", (schaal * maxR).toFixed(2));
      rip.setAttribute("ry", (schaal * maxR * 0.28).toFixed(2));
      rip.setAttribute("opacity", (0.85 * (1 - t)).toFixed(3));
    } else {
      rip.setAttribute("opacity", 0);
    }
  };

  // Toegankelijk eindbeeld zonder beweging
  if (reducedMotion()) {
    zetWater(WATER_TOP);
    zetKoepel(1);
    return;
  }

  /* --- Tijdlijn --- */
  let start = null;
  let actief = true;
  let ambient = null; // { x, t0 } voor losse druppels ná de tijdlijn
  let volgendeAmbient = EIND_FRAME + 5 * FPS;

  const tik = (now) => {
    if (start === null) start = now;
    const frame = ((now - start) / 1000) * FPS;

    if (frame <= EIND_FRAME + 2) {
      zetWater(waterLevelAt(frame));
      zetKoepel(interpolate(frame, [REVEAL_START, REVEAL_START + REVEAL_DUUR], [0, 1], easeInOutCubic));
      DROPS.forEach((_, i) => tekenDrop(i, frame));
    } else {
      /* --- Rustfase: af en toe één druppel --- */
      if (!ambient && frame >= volgendeAmbient) {
        ambient = { x: 45 + Math.random() * 118, t0: frame };
      }
      if (ambient) {
        const d = frame - ambient.t0;
        const VAL = 16;
        const el = dropEls[0];
        const rip = rippleEls[0];
        if (d <= VAL) {
          const t = easeInQuad(d / VAL);
          const y = interpolate(t, [0, 1], [START_Y, WATER_TOP]);
          el.setAttribute("opacity", Math.min(1, d / 3) * (d > VAL - 2 ? (VAL - d) / 2 : 1));
          el.setAttribute("transform", `translate(${ambient.x},${y.toFixed(2)})`);
        } else if (d <= VAL + RIPPLE) {
          el.setAttribute("opacity", 0);
          const t = (d - VAL) / RIPPLE;
          rip.setAttribute("cx", ambient.x);
          rip.setAttribute("cy", WATER_TOP);
          rip.setAttribute("rx", (easeOutCubic(t) * 11).toFixed(2));
          rip.setAttribute("ry", (easeOutCubic(t) * 11 * 0.28).toFixed(2));
          rip.setAttribute("opacity", (0.85 * (1 - t)).toFixed(3));
        } else {
          rip.setAttribute("opacity", 0);
          ambient = null;
          volgendeAmbient = frame + (4 + Math.random() * 5) * FPS;
        }
      }
    }
    zetSway(frame);
    if (actief) requestAnimationFrame(tik);
  };
  requestAnimationFrame(tik);

  // Pauzeer de loop zodra de hero uit beeld is (spaart batterij)
  new IntersectionObserver(
    (entries) => {
      const zichtbaar = entries[0].isIntersecting;
      if (zichtbaar && !actief) {
        actief = true;
        requestAnimationFrame(tik);
      } else if (!zichtbaar) {
        actief = false;
      }
    },
    { threshold: 0 },
  ).observe(houder);
}
