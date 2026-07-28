// Kleine hulpfuncties — geen externe libraries nodig.

export const EURO = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const euro = (cents: number): string =>
  EURO.format(Math.round(cents / 100)).replace(/ ?€\s?/, "€ ");

export const pctTekst = (p: number): string =>
  `${p.toLocaleString("nl-NL", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}%`;

export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// interpolate(frame, [in0, in1], [uit0, uit1], easing?) — geklemd, zoals in Remotion
export const interpolate = (
  v: number,
  [i0, i1]: [number, number],
  [o0, o1]: [number, number],
  ease: (t: number) => number = (t) => t,
): number => lerp(o0, o1, ease(clamp01((v - i0) / (i1 - i0))));

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5);
export const easeInQuad = (t: number): number => t * t;
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// 2D affine matrix [a,b,c,d,e,f] — vermenigvuldiging M1 · M2
export type Matrix6 = [number, number, number, number, number, number];

export const matMul = (m1: Matrix6, m2: Matrix6): Matrix6 => [
  m1[0] * m2[0] + m1[2] * m2[1],
  m1[1] * m2[0] + m1[3] * m2[1],
  m1[0] * m2[2] + m1[2] * m2[3],
  m1[1] * m2[2] + m1[3] * m2[3],
  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
  m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];

export const parseMatrix = (str: string): Matrix6 => {
  const match: RegExpMatchArray | null = str.match(/matrix\(([^)]+)\)/);
  const groep: string | undefined = match?.[1];
  if (!groep) throw new Error(`Ongeldige matrix-string: ${str}`);
  const delen: number[] = groep.split(",").map(Number);
  const [a, b, c, d, e, f] = delen;
  if (delen.length !== 6 || a === undefined || b === undefined || c === undefined
    || d === undefined || e === undefined || f === undefined) {
    throw new Error(`Matrix-string heeft geen 6 delen: ${str}`);
  }
  return [a, b, c, d, e, f];
};

export const matrixStr = (m: readonly number[]): string =>
  `matrix(${m.map((n) => +n.toFixed(6)).join(",")})`;

export const reducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Eénmalige IntersectionObserver-trigger
export function zodraZichtbaar(
  el: Element,
  cb: () => void,
  opties: IntersectionObserverInit = { threshold: 0.35 },
): void {
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

export const svgEl = (
  naam: string,
  attrs: Record<string, string | number> = {},
): SVGElement => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", naam);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
};
