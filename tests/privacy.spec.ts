// Privacyverklaring (privacy.html): inhoud, taalwissel en de mailto-link
// die het echte campagne-e-mailadres uit data/campagne.js moet tonen.
import { test, expect } from "@playwright/test";
import { sluitCookiebanner } from "./helpers.js";

test.describe("Privacypagina — inhoud", () => {
  test("laadt met de juiste titel en hoofdtekst", async ({ page }) => {
    await page.goto("/privacy.html");
    await expect(page).toHaveTitle("Privacy · Druppels van Sakīnah");
    await expect(page.locator("h1")).toHaveText("Kort en eerlijk");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  });

  test("de maillink toont en gebruikt het echte campagne-e-mailadres", async ({ page }) => {
    await page.goto("/privacy.html");
    const mailLink = page.locator("[data-mail-contact]");
    // render.ts/privacy.ts vullen zowel de zichtbare tekst als de href
    // vanuit campagne.contactEmail — als iemand per ongeluk het adres in
    // data/campagne.js verwijdert, moet deze test dat opvangen.
    await expect(mailLink).toHaveText("info@trefpunt-capelle.nl");
    await expect(mailLink).toHaveAttribute(
      "href",
      /^mailto:info@trefpunt-capelle\.nl\?subject=/,
    );
  });

  test('"Terug naar de campagne" verwijst naar de homepage', async ({ page }) => {
    await page.goto("/privacy.html");
    await expect(page.locator('a:has-text("Terug naar de campagne")')).toHaveAttribute(
      "href",
      "/",
    );
  });
});

test.describe("Privacypagina — taalwissel", () => {
  test("schakelt de hoofdtekst, richting en documenttitel mee naar het Arabisch", async ({ page }) => {
    await page.goto("/privacy.html");
    await sluitCookiebanner(page);

    await page.locator("[data-taal-knop]").click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toHaveText("بإيجازٍ وصِدق");
  });
});

test.describe("Privacypagina — cookie-instellingen wijzigen", () => {
  test("de link onderaan de pagina heropent de cookiebanner na een eerdere keuze", async ({ page }) => {
    await page.goto("/privacy.html");
    await sluitCookiebanner(page, "weigeren");
    await expect(page.locator("[data-cookie-banner]")).toBeHidden();

    await page.locator("[data-cookie-instellingen]").click();

    await expect(page.locator("[data-cookie-banner]")).toBeVisible();
  });
});
