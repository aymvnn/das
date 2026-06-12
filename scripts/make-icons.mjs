// Eenmalig: maakt apple-touch-icon.png en de QR-placeholder.
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(here, "../public/assets");

// 1) apple-touch-icon: logo op gebroken-wit, met marge
const logo = await readFile(path.join(ASSETS, "favicon.svg"));
const logoPng = await sharp(logo, { density: 300 }).resize({ height: 132 }).png().toBuffer();
await sharp({
  create: { width: 180, height: 180, channels: 4, background: "#f2f1ee" },
})
  .composite([{ input: logoPng, gravity: "center" }])
  .png()
  .toFile(path.join(ASSETS, "apple-touch-icon.png"));
console.log("apple-touch-icon.png");

// 2) QR-placeholder (TODO: vervangen door echte betaal-QR van de bank)
const qrSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320">
  <rect width="320" height="320" rx="24" fill="#e4f4f1"/>
  <rect x="10" y="10" width="300" height="300" rx="18" fill="none" stroke="#cfe8e2" stroke-width="2" stroke-dasharray="8 7"/>
  <path d="M160 92c20 27 37 51 37 77a37 37 0 0 1-74 0c0-26 17-50 37-77Z" fill="#00847e"/>
  <text x="160" y="236" text-anchor="middle" font-family="Verdana, sans-serif" font-size="17" font-weight="bold" fill="#1f2c54">Betaal-QR volgt</text>
  <text x="160" y="262" text-anchor="middle" font-family="Verdana, sans-serif" font-size="14" fill="#5b6480">gebruik tot die tijd het IBAN</text>
</svg>`;
await sharp(Buffer.from(qrSvg)).png().toFile(path.join(ASSETS, "qr-betaal.png"));
console.log("qr-betaal.png");
