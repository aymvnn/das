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

const laag = (paths, cls) => `
  <g transform="${ARTBOARD_TRANSFORM}"><g transform="${LAAG_TRANSFORM}">
    ${paths.map((p) => `<g transform="${p.transform}"><path d="${p.d}" class="${cls}" fill-rule="nonzero"/></g>`).join("")}
  </g></g>`;

// Golvend wateroppervlak: een lint van twee volledige schermbreedtes
// dat horizontaal voorbij drijft (CSS-animatie).
function golfPad(amp, golflengte, breedte = 560) {
  let d = `M-160 0`;
  for (let x = -160; x < breedte - 160; x += golflengte) {
    d += ` q ${golflengte / 4} ${-amp * 2} ${golflengte / 2} 0 q ${golflengte / 4} ${amp * 2} ${golflengte / 2} 0`;
  }
  d += ` v 340 h ${-breedte} Z`;
  return d;
}

export function bouwKoepel() {
  const houder = document.querySelector("[data-koepel]");
  if (!houder) return;

  const pct = percentage();
  const behaald = golvenBehaald();

  // Binnencontour van het huis in wortelcoördinaten:
  // artboard · laag · koepeltransform als één matrix op het pad.
  const M = matrixStr(
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

  const svg = houder.firstElementChild;
  const meet = svg.querySelector("[data-meet]");
  const bbox = meet.getBBox();
  meet.remove();

  const waterpeil = svg.querySelector("[data-waterpeil]");
  const mijlpalen = svg.querySelector("[data-mijlpalen]");
  const fx = svg.querySelector("[data-fx]");

  const yVoorPct = (p) => bbox.y + bbox.height * (1 - p / 100);
  const bodem = bbox.y + bbox.height + 4;

  /* --- 16 mijlpaallijnen in het water --- */
  for (let i = 1; i <= TOTAAL_GOLVEN; i++) {
    const y = yVoorPct((i / TOTAAL_GOLVEN) * 100);
    const status = i <= behaald ? "is-behaald" : i === behaald + 1 ? "is-volgende" : "";
    const lijn = svgEl("line", {
      x1: bbox.x - 6,
      x2: bbox.x + bbox.width + 6,
      y1: y,
      y2: y,
      class: `mijlpaal ${status}`,
      "data-golf": i,
    });
    const titel = svgEl("title");
    titel.textContent = `Golf ${i} — ${euro(GOLF_CENTS * i)}${i <= behaald ? " ✓" : ""}`;
    lijn.append(titel);
    mijlpalen.append(lijn);
  }

  /* --- waterpeil animeren naar het echte percentage --- */
  const zetPeil = (p) => {
    waterpeil.setAttribute("transform", `translate(0 ${yVoorPct(p).toFixed(2)})`);
  };
  zetPeil(0.0001);

  if (reducedMotion()) {
    zetPeil(pct);
  } else {
    zodraZichtbaar(houder, () => {
      const DUUR = 2100;
      let t0 = null;
      const stap = (now) => {
        if (t0 === null) t0 = now;
        const t = Math.min(1, (now - t0) / DUUR);
        zetPeil(easeOutQuint(t) * pct);
        if (t < 1) requestAnimationFrame(stap);
      };
      requestAnimationFrame(stap);
    });
  }

  /* --- koppeling met de mijlpalenlijst ernaast --- */
  document.querySelectorAll(".golf-item").forEach((item) => {
    const i = item.dataset.golf;
    const lijn = mijlpalen.querySelector(`[data-golf="${i}"]`);
    if (!lijn) return;
    item.addEventListener("mouseenter", () => lijn.classList.add("is-actief"));
    item.addEventListener("mouseleave", () => lijn.classList.remove("is-actief"));
  });

  /* --- af en toe valt een druppel in de kom onder het huis --- */
  if (reducedMotion()) return;
  const drop = svgEl("path", { d: DROP_PATH, class: "vorm-teal", opacity: 0 });
  const rimpel = svgEl("ellipse", { class: "rimpel", fill: "none", "stroke-width": 1.1, opacity: 0 });
  fx.append(drop, rimpel);

  let bezig = false;
  const KOM_Y = 201; // wateroppervlak van de kom onder het huis

  const valDruppel = () => {
    if (bezig || document.hidden) return;
    bezig = true;
    const x = Math.random() < 0.5 ? 44 + Math.random() * 14 : 150 + Math.random() * 14;
    const t0 = performance.now();
    const VAL = 620, RIP = 700;
    const stap = (now) => {
      const d = now - t0;
      if (d <= VAL) {
        const t = easeInQuad(d / VAL);
        drop.setAttribute("opacity", Math.min(1, d / 90));
        drop.setAttribute("transform", `translate(${x},${interpolate(t, [0, 1], [-30, KOM_Y]).toFixed(2)})`);
        requestAnimationFrame(stap);
      } else if (d <= VAL + RIP) {
        drop.setAttribute("opacity", 0);
        const t = (d - VAL) / RIP;
        rimpel.setAttribute("cx", x);
        rimpel.setAttribute("cy", KOM_Y);
        rimpel.setAttribute("rx", (easeOutCubic(t) * 9).toFixed(2));
        rimpel.setAttribute("ry", (easeOutCubic(t) * 2.6).toFixed(2));
        rimpel.setAttribute("opacity", (0.8 * (1 - t)).toFixed(3));
        requestAnimationFrame(stap);
      } else {
        rimpel.setAttribute("opacity", 0);
        bezig = false;
      }
    };
    requestAnimationFrame(stap);
  };

  let timer = null;
  zodraZichtbaar(houder, () => {
    valDruppel();
    timer = setInterval(valDruppel, 6500 + Math.random() * 2000);
  }, { threshold: 0.4 });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer) {
      clearInterval(timer);
      timer = null;
    } else if (!document.hidden && !timer) {
      timer = setInterval(valDruppel, 6500 + Math.random() * 2000);
    }
  });
}
