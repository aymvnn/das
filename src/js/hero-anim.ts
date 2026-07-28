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
import type { PathShape } from "./logo-paths.js";
import {
  interpolate,
  easeInQuad,
  easeOutCubic,
  easeInOutCubic,
  svgEl,
  reducedMotion,
} from "./utils.js";

const FPS: number = 30;
const EIND_FRAME: number = 135;
const FALL: number = 14;
const STEP: number = 14;
const RIPPLE: number = 20;
const WATER_BODEM: number = 293;
const WATER_TOP: number = 193;
const DROPS: Array<{ x: number; start: number }> = [
  { x: 115, start: 0 },
  { x: 130, start: 7 },
  { x: 95, start: 14 },
  { x: 145, start: 21 },
  { x: 70, start: 28 },
  { x: 160, start: 35 },
  { x: 45, start: 42 },
  { x: 105, start: 49 },
];
const WATER_STAP: number = (WATER_BODEM - WATER_TOP) / DROPS.length;
const REVEAL_START: number = 70;
const REVEAL_DUUR: number = 46;
const SWAY_FRAME: number = 116;
const SWAY_PERIODE: number = 56;
const START_Y: number = -42; // boven het beeld

const waterLevelAt: (frame: number) => number = (frame: number): number => {
  let level: number = WATER_BODEM;
  for (const drop of DROPS) {
    const inslag: number = drop.start + FALL;
    level -= WATER_STAP * interpolate(frame, [inslag, inslag + STEP], [0, 1], easeOutCubic);
  }
  return level;
};

const laag = (paths: PathShape[], cls: string): string => `
  <g transform="${ARTBOARD_TRANSFORM}"><g transform="${LAAG_TRANSFORM}">
    ${paths.map((p) => `<g transform="${p.transform}"><path d="${p.d}" class="${cls}" fill-rule="nonzero"/></g>`).join("")}
  </g></g>`;

export function startHeroAnimatie(): void {
  const houder: HTMLElement | null = document.querySelector<HTMLElement>("[data-hero-anim]");
  if (!houder) return;

  const id: string = "hero";
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

  const svg: Element | null = houder.firstElementChild;
  if (!svg) return;
  const koepelGroep: SVGGElement | null = svg.querySelector<SVGGElement>("[data-koepelgroep]");
  const koepelRect: SVGRectElement | null = svg.querySelector<SVGRectElement>(`#${id}-koepel rect`);
  const lichtRect: SVGRectElement | null = svg.querySelector<SVGRectElement>(`#${id}-licht rect`);
  const donkerRect: SVGRectElement | null = svg.querySelector<SVGRectElement>(`#${id}-donker rect`);
  const lichtGroep: SVGGElement | null = svg.querySelector<SVGGElement>("[data-lichtgroep]");
  const donkerGroep: SVGGElement | null = svg.querySelector<SVGGElement>("[data-donkergroep]");
  const fx: SVGGElement | null = svg.querySelector<SVGGElement>("[data-fx]");
  if (!koepelGroep || !koepelRect || !lichtRect || !donkerRect || !lichtGroep || !donkerGroep || !fx) return;

  // Vaste druppel- en rimpel-elementen (hergebruikt per frame)
  const dropEls: SVGElement[] = DROPS.map(() => {
    const p: SVGElement = svgEl("path", { d: DROP_PATH, class: "vorm-teal", opacity: 0 });
    fx.append(p);
    return p;
  });
  const rippleEls: SVGElement[] = DROPS.map(() => {
    const e: SVGElement = svgEl("ellipse", {
      class: "rimpel",
      fill: "none",
      "stroke-width": 1.1,
      opacity: 0,
    });
    fx.append(e);
    return e;
  });

  const zetWater = (level: number): void => {
    const h: number = VIEWBOX_H - level + 25;
    lichtRect.setAttribute("y", String(level));
    lichtRect.setAttribute("height", String(h));
    donkerRect.setAttribute("y", String(level));
    donkerRect.setAttribute("height", String(h));
  };

  const zetKoepel = (reveal: number): void => {
    const clipY: number = interpolate(reveal, [0, 1], [196, 5]);
    koepelRect.setAttribute("y", String(clipY));
    koepelRect.setAttribute("height", String(VIEWBOX_H - clipY + 20));
    koepelGroep.setAttribute("opacity", String(interpolate(reveal, [0, 0.6], [0.4, 1])));
  };

  const zetSway = (frame: number): void => {
    const amp: number = interpolate(frame, [SWAY_FRAME - 6, SWAY_FRAME + 6], [0, 2]);
    const fase: number = ((frame - SWAY_FRAME) / SWAY_PERIODE) * Math.PI * 2;
    donkerGroep.style.transform = `translateY(${(amp * Math.sin(fase)).toFixed(2)}px)`;
    lichtGroep.style.transform = `translateY(${(amp * 0.85 * Math.sin(fase + 0.6)).toFixed(2)}px)`;
  };

  const tekenDrop = (i: number, frame: number): void => {
    const drop: { x: number; start: number } | undefined = DROPS[i];
    const el: SVGElement | undefined = dropEls[i];
    const rip: SVGElement | undefined = rippleEls[i];
    if (!drop || !el || !rip) return;
    const inslag: number = drop.start + FALL;
    const inslagY: number = waterLevelAt(inslag);
    const fallT: number = interpolate(frame, [drop.start, inslag], [0, 1], easeInQuad);
    const y: number = interpolate(fallT, [0, 1], [START_Y, inslagY]);
    const rek: number = 1 + 0.15 * Math.sin(fallT * Math.PI);
    const op: number =
      interpolate(frame, [drop.start, drop.start + 3], [0, 1]) *
      interpolate(frame, [inslag - 2, inslag], [1, 0]);

    if (op > 0.01) {
      el.setAttribute("opacity", op.toFixed(3));
      el.setAttribute("transform", `translate(${drop.x},${y.toFixed(2)}) scale(1,${rek.toFixed(3)})`);
    } else {
      el.setAttribute("opacity", "0");
    }

    if (frame >= inslag && frame <= inslag + RIPPLE) {
      const t: number = (frame - inslag) / RIPPLE;
      const schaal: number = easeOutCubic(t);
      const ripY: number = Math.min(inslagY, waterLevelAt(frame));
      const maxR: number = interpolate(inslagY, [WATER_TOP, WATER_BODEM], [11, 7]);
      rip.setAttribute("cx", String(drop.x));
      rip.setAttribute("cy", String(ripY));
      rip.setAttribute("rx", (schaal * maxR).toFixed(2));
      rip.setAttribute("ry", (schaal * maxR * 0.28).toFixed(2));
      rip.setAttribute("opacity", (0.85 * (1 - t)).toFixed(3));
    } else {
      rip.setAttribute("opacity", "0");
    }
  };

  // Toegankelijk eindbeeld zonder beweging
  if (reducedMotion()) {
    zetWater(WATER_TOP);
    zetKoepel(1);
    return;
  }

  /* --- Tijdlijn --- */
  let start: number | null = null;
  let actief: boolean = true;
  let ambient: { x: number; t0: number } | null = null; // losse druppels ná de tijdlijn
  let volgendeAmbient: number = EIND_FRAME + 5 * FPS;

  const tik = (now: number): void => {
    if (start === null) start = now;
    const frame: number = ((now - start) / 1000) * FPS;

    if (frame <= EIND_FRAME + 2) {
      zetWater(waterLevelAt(frame));
      zetKoepel(interpolate(frame, [REVEAL_START, REVEAL_START + REVEAL_DUUR], [0, 1], easeInOutCubic));
      DROPS.forEach((_: { x: number; start: number }, i: number): void => tekenDrop(i, frame));
    } else {
      /* --- Rustfase: af en toe één druppel --- */
      if (!ambient && frame >= volgendeAmbient) {
        ambient = { x: 45 + Math.random() * 118, t0: frame };
      }
      if (ambient) {
        const d: number = frame - ambient.t0;
        const VAL: number = 16;
        const el: SVGElement | undefined = dropEls[0];
        const rip: SVGElement | undefined = rippleEls[0];
        if (el && rip) {
          if (d <= VAL) {
            const t: number = easeInQuad(d / VAL);
            const y: number = interpolate(t, [0, 1], [START_Y, WATER_TOP]);
            el.setAttribute("opacity", String(Math.min(1, d / 3) * (d > VAL - 2 ? (VAL - d) / 2 : 1)));
            el.setAttribute("transform", `translate(${ambient.x},${y.toFixed(2)})`);
          } else if (d <= VAL + RIPPLE) {
            el.setAttribute("opacity", "0");
            const t: number = (d - VAL) / RIPPLE;
            rip.setAttribute("cx", String(ambient.x));
            rip.setAttribute("cy", String(WATER_TOP));
            rip.setAttribute("rx", (easeOutCubic(t) * 11).toFixed(2));
            rip.setAttribute("ry", (easeOutCubic(t) * 11 * 0.28).toFixed(2));
            rip.setAttribute("opacity", (0.85 * (1 - t)).toFixed(3));
          } else {
            rip.setAttribute("opacity", "0");
            ambient = null;
            volgendeAmbient = frame + (4 + Math.random() * 5) * FPS;
          }
        }
      }
    }
    zetSway(frame);
    if (actief) requestAnimationFrame(tik);
  };
  requestAnimationFrame(tik);

  // Pauzeer de loop zodra de hero uit beeld is (spaart batterij)
  new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      const eerste: IntersectionObserverEntry | undefined = entries[0];
      if (!eerste) return;
      const zichtbaar: boolean = eerste.isIntersecting;
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
