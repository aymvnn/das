import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Relatieve paden zodat de build op elke statische host werkt (Vercel, map op een server, enz.)
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(here, "index.html"),
        privacy: resolve(here, "privacy.html"),
      },
    },
  },
});
