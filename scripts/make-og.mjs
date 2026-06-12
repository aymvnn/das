// Eenmalig: bouwt de Open Graph-afbeelding (1200×630) voor WhatsApp/social.
// Tekst staat als vectorpaden (Bergen Sans) in og-tekst.json — geen
// font-installatie nodig om te renderen.
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(here, "../public/assets");
const tekst = JSON.parse(await readFile(path.join(here, "og-tekst.json"), "utf8"));

// Glyfpaden staan in font-eenheden met y-omhoog → schaal + spiegel per regel.
const regel = (blok, maat, x, basisY, kleur) => {
  const s = maat / blok.upm;
  const paden = blok.paden
    .map((p) => `<path transform="translate(${p.x},0)" d="${p.d}"/>`)
    .join("");
  return `<g fill="${kleur}" transform="translate(${x},${basisY}) scale(${s},-${s})">${paden}</g>`;
};

// Het logo (uit de SVG-bron, met de originele transformatieketen)
const logoSvg = await readFile(path.join(ASSETS, "favicon.svg"), "utf8");
const logoBinnen = logoSvg
  .slice(logoSvg.indexOf('<g id="Artboard1"'), logoSvg.lastIndexOf("</svg>"))
  .replace(/serif:id="[^"]*"/g, "")
  .replaceAll("rgb(0,132,126)", "#ffffff")
  .replaceAll("rgb(56,182,171)", "#8fd2ca");

const overlay = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="schaduw" x1="0" y1="0" x2="0.92" y2="0.35">
      <stop offset="0" stop-color="#17203d" stop-opacity="0.96"/>
      <stop offset="0.55" stop-color="#1f2c54" stop-opacity="0.82"/>
      <stop offset="1" stop-color="#1f2c54" stop-opacity="0.30"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#schaduw)"/>

  <!-- logo rechts, licht -->
  <g transform="translate(995,160) scale(0.82)" opacity="0.96">${logoBinnen}</g>

  ${regel(tekst.kicker, 26, 84, 218, "#8fd2ca")}
  ${regel(tekst.titel, 86, 80, 328, "#ffffff")}
  ${regel(tekst.sub, 40, 84, 400, "#e4f4f1")}

  <!-- druppel + voortgangsbalkje -->
  <g transform="translate(84,478)">
    <path d="M14 0C21 9.5 27.4 18.5 27.4 28.4A13.4 13.4 0 0 1 14 41.8 13.4 13.4 0 0 1 .6 28.4C.6 18.5 7 9.5 14 0Z" fill="#38b6ab"/>
    <rect x="50" y="12" width="380" height="18" rx="9" fill="#ffffff" opacity="0.22"/>
    <rect x="50" y="12" width="58" height="18" rx="9" fill="#38b6ab"/>
  </g>
</svg>`;

await sharp(path.join(ASSETS, "img", "pand-water-regen.webp"))
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 84 })
  .toFile(path.join(ASSETS, "og-image.jpg"));

console.log("og-image.jpg klaar");
