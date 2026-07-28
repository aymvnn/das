// Rooktest: bevestigt dat de CI-pijplijn (build → preview → browsers) werkt.
// De echte testdekking (doneerflow, taalwissel, kiosk-modus, …) volgt later.
import { test, expect } from "@playwright/test";

test("homepage laadt met de juiste titel", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Druppels van Sakīnah/);
});

test("privacyverklaring laadt", async ({ page }) => {
  await page.goto("/privacy.html");
  await expect(page.locator("h1")).toContainText("Kort en eerlijk");
});

test("kioskscherm (/present.html) laadt", async ({ page }) => {
  // De /present-rewrite (zonder .html) komt uit vercel.json en geldt alleen
  // op Vercel zelf; "vite preview" kent die rewrite niet, dus hier het
  // bestand rechtstreeks aanroepen.
  await page.goto("/present.html");
  await expect(page.locator(".kiosk-scherm")).toBeVisible();
});
