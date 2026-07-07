// Eenmalig hulpscript (alleen voor ontwikkelaars): comprimeert de 6
// campagnevideo's uit ../../campagnevideos naar web-geschikte mp4's +
// poster-webp's in public/assets/video/campagne. Vereist ffmpeg in PATH.
// Draaien: npm run videos
import { execFileSync } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, "../../campagnevideos");
const SRC_STORIES = path.join(SRC, "social-stories-HF");
const OUT = path.resolve(here, "../public/assets/video/campagne");
const POSTERS = path.join(OUT, "posters");

// [bronmap, bronbestand, doelslug, seconde voor posterframe]
const JOBS = [
  [SRC, "DAS-CAMPAGNE1.mp4", "campagne-1", 2],
  [SRC, "DAS-CAMPAGNE2.mp4", "campagne-2", 6],
  [SRC, "DAS-CAMPAGNE3.mp4", "campagne-3", 2.5],
  [SRC, "DAS-CAMPAGNE4.mp4", "campagne-4", 9],
  [SRC, "DAS-WATER-1.mp4", "water-1", 3],
  [SRC, "DAS-WATER2.mp4", "water-2", 6],
  [SRC_STORIES, "DAS-story-1-druppel.mp4", "story-1-druppel", 2],
  [SRC_STORIES, "DAS-story-1-druppel-AR.mp4", "story-1-druppel-ar", 2],
  [SRC_STORIES, "DAS-story-3-aftellen.mp4", "story-3-aftellen", 2],
];

await mkdir(POSTERS, { recursive: true });

for (const [srcDir, srcName, slug, posterAt] of JOBS) {
  const src = path.join(srcDir, srcName);
  const outMp4 = path.join(OUT, `${slug}.mp4`);
  const outPoster = path.join(POSTERS, `${slug}.webp`);

  execFileSync("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-i",
    src,
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "27",
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outMp4,
  ]);

  execFileSync("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-ss",
    String(posterAt),
    "-i",
    src,
    "-frames:v",
    "1",
    "-vf",
    "scale=480:-1",
    "-c:v",
    "libwebp",
    "-quality",
    "78",
    outPoster,
  ]);

  const info = await stat(outMp4);
  console.log(`${slug}.mp4  ${(info.size / 1024).toFixed(0)} kB`);
}
console.log("Klaar.");
