// Kleine hulpfuncties — geen externe libraries nodig.

export const EURO = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const euro = (cents) => EURO.format(Math.round(cents / 100)).replace(/ ?€\s?/, "€ ");

export const pctTekst = (p) =>
  `${p.toLocaleString("nl-NL", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}%`;

export const clamp01 = (t) => Math.min(1, Math.max(0, t));

export const lerp = (a, b, t) => a + (b - a) * t;

// interpolate(frame, [in0, in1], [uit0, uit1], easing?) — geklemd, zoals in Remotion
export const interpolate = (v, [i0, i1], [o0, o1], ease = (t) => t) =>
  lerp(o0, o1, ease(clamp01((v - i0) / (i1 - i0))));

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
export const easeInQuad = (t) => t * t;
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// 2D affine matrix [a,b,c,d,e,f] — vermenigvuldiging M1 · M2
export const matMul = (m1, m2) => [
  m1[0] * m2[0] + m1[2] * m2[1],
  m1[1] * m2[0] + m1[3] * m2[1],
  m1[0] * m2[2] + m1[2] * m2[3],
  m1[1] * m2[2] + m1[3] * m2[3],
  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
  m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];

export const parseMatrix = (str) =>
  str.match(/matrix\(([^)]+)\)/)[1].split(",").map(Number);

export const matrixStr = (m) => `matrix(${m.map((n) => +n.toFixed(6)).join(",")})`;

export const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Eénmalige IntersectionObserver-trigger
export function zodraZichtbaar(el, cb, opties = { threshold: 0.35 }) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        io.disconnect();
        cb();
        return;
      }
    }
  }, opties);
  io.observe(el);
}

export const svgEl = (naam, attrs = {}) => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", naam);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};
