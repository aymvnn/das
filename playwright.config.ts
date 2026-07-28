import { defineConfig, devices } from "@playwright/test";

const PORT: number = 4173;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    // De site respecteert prefers-reduced-motion door reveal-/koepel-/hero-
    // animaties meteen naar hun eindstand te zetten (zie src/js/motion.ts,
    // koepel.ts, hero-anim.ts). Dat maakt asserts op de eindstand
    // deterministisch i.p.v. afhankelijk van animatietiming.
    contextOptions: {
      reducedMotion: "reduce",
    },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // De volledige testsuite draait ook op mobiele viewports/engines, niet
    // alleen desktop — de meeste donateurs komen via telefoon binnen.
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: "yarn build && yarn preview --port 4173",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
