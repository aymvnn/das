// Eenmalig hulpscript (alleen voor ontwikkelaars): zet de bronfoto's uit
// ../fotos-site om naar geoptimaliseerde webp's in public/assets/img.
// Draaien: npm run assets
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, "../../fotos-site");
const OUT = path.resolve(here, "../public/assets/img");

const DRIVE = path.join(SRC, "drive-download-20260611T210044Z-3-001");
const AI = path.join(SRC, "das-ai");

// [bron, doelnaam, maxBreedte, kwaliteit]
const JOBS = [
  // Exterieur / groot
  [path.join(SRC, "andere_invalshoek,_vanaf_het_water,_202606120032.jpeg"), "pand-water-zon.webp", 1920, 80],
  [path.join(AI, "regendruppels_in_het_water_2K_202606120031.jpeg"), "pand-water-regen.webp", 1920, 80],
  [path.join(AI, "Keep_the_existing_composition,_architecture_202606112307.jpeg"), "pand-lente.webp", 1920, 80],
  [path.join(AI, "Keep_the_existing_composition,_architecture,_202606112349.jpeg"), "pand-daken.webp", 1600, 78],
  [path.join(DRIVE, "het pand - vanaf de zijkant 2.jpg"), "pand-huidig.webp", 1600, 78],

  // Interieur
  [path.join(AI, "Keep_the_existing_composition,_layout,_202606112313.jpeg"), "gebedszaal-tapijt.webp", 1400, 80],
  [path.join(AI, "childrenplayinginmosque.jpeg"), "moskee-sfeer.webp", 1600, 78],
  [path.join(DRIVE, "IMG_1183.jpeg"), "tapijt-daglicht.webp", 1400, 78],
  // Privacy: gemeenschapsfoto bewust klein houden zodat niemand herkenbaar is
  [path.join(DRIVE, "IMG_1188.jpeg"), "gemeenschap-gebed.webp", 1100, 75],

  // Verhaal: van oplevering tot eerste gebed
  [path.join(DRIVE, "het trefpunt na oplevering.jpeg"), "verhaal-oplevering.webp", 1400, 76],
  [path.join(DRIVE, "het-trefpunt - 7.jpeg"), "verhaal-lege-hal.webp", 1400, 76],
  [path.join(DRIVE, "het-trefpunt-update-29-jan-2026 - 5.jpeg"), "verhaal-klusdag.webp", 1400, 76],
  [path.join(DRIVE, "het-trefpunt-update-29-jan-2026 - 3.jpeg"), "verhaal-raam-water.webp", 1200, 76],
  [path.join(SRC, "Start_20260301_133117.jpg"), "tapijt-start.webp", 1200, 76],
  [path.join(SRC, "Bezig_20260301_134447.jpg"), "tapijt-bezig.webp", 1200, 76],
  [path.join(SRC, "Eindresultaat_20260301_134752.jpg"), "tapijt-klaar.webp", 1200, 76],

  // Acties (kleiner)
  [path.join(DRIVE, "het-trefpunt-update-29-jan-2026 - 10.jpeg"), "acties/klusweekend.webp", 900, 74],
  [path.join(SRC, "Eindresultaat_20260301_134752.jpg"), "acties/tapijtdag.webp", 900, 74],
  [path.join(DRIVE, "IMG_1183.jpeg"), "acties/eerste-gebed.webp", 900, 74],
];

await mkdir(path.join(OUT, "acties"), { recursive: true });

for (const [src, name, width, quality] of JOBS) {
  const dest = path.join(OUT, name);
  // .rotate() zonder argument past de EXIF-oriëntatie toe (IMG_-serie staat 90° gedraaid opgeslagen)
  const img = sharp(src).rotate().resize({ width, withoutEnlargement: true });
  const info = await img.webp({ quality, effort: 5 }).toFile(dest);
  console.log(`${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} kB`);
}
console.log("Klaar.");
