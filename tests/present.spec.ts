// Kioskscherm (/present.html): het scherm voor de staande tablet in de
// moskee. Geen navigatie, alleen koepel + QR + teller, en moet blijven
// werken (met een zinnig fallback-bedrag) ook als /api/total niet
// bereikbaar is — precies de situatie waarin dit draait onder "vite
// preview" (dat serveert geen Vercel serverless functions).
import { test, expect } from "@playwright/test";

test.describe("Kioskscherm — structuur", () => {
  test("laadt zonder sitenavigatie: alleen de kiosk-indeling", async ({ page }) => {
    await page.goto("/present.html");
    await expect(page.locator(".kiosk-scherm")).toBeVisible();
    // Regressie-guard: dit scherm mag nooit de gewone site-header/nav
    // meekrijgen — dat zou op een staande tablet volstrekt onbruikbaar zijn.
    await expect(page.locator(".site-header")).toHaveCount(0);
    await expect(page.locator("nav")).toHaveCount(0);
  });

  test("toont de koepel-visual, de QR-code en het merk", async ({ page }) => {
    await page.goto("/present.html");
    await expect(page.locator("[data-koepel] svg")).toBeVisible();
    await expect(page.locator("[data-qr-doneren] svg")).toBeVisible();
    await expect(page.locator(".kiosk-merknaam")).toHaveText("Dār as-Sakīnah");
  });

  test('de "volledig scherm"-knop is aanwezig maar staat niet automatisch aan te dringen', async ({ page }) => {
    // Browsers staan requestFullscreen() nooit toe zonder gebruikersinteractie
    // (zie startKiosk() in present.ts) — de knop moet dus renderen, maar er
    // mag geen fullscreen-aanvraag zijn gedaan vóór een klik.
    await page.goto("/present.html");
    await expect(page.locator("[data-fullscreen]")).toHaveCount(1);
    expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  });
});

test.describe("Kioskscherm — teller (sad path: /api/total onbereikbaar)", () => {
  test("valt terug op het handmatige buiten-Stripe-bedrag i.p.v. vast te lopen op € 0", async ({ page }) => {
    // "vite preview" serveert geen /api-routes, dus haalStripeTotaal() in
    // present.ts faalt hier altijd stil (net als in productie wanneer
    // Stripe tijdelijk onbereikbaar is). standCents(0) valt dan terug op
    // campagne.buitenStripeCents — de teller moet dát tonen, niet "€ 0"
    // en niet blijven hangen op een lege/NaN-waarde.
    await page.goto("/present.html");

    const tellerTekst = await page.locator(".kiosk-euro[data-countup]").innerText();
    expect(tellerTekst).toMatch(/^€\s*[\d.]+$/);
    expect(tellerTekst).not.toBe("€ 0");

    const doelTekst = await page.locator("[data-doel]").innerText();
    expect(doelTekst).toMatch(/^€\s*[\d.]+$/);

    // "X van de 400 druppels gevuld" moet een echt getal invullen, geen
    // "… van de 400 druppels gevuld" (de placeholder-ellips uit de HTML-bron).
    await expect(page.locator("[data-druppels-zin]")).not.toHaveText(/^…/);
  });

  test("blijft na meerdere 25s-intervaltikken stabiel, zonder de pagina te laten crashen", async ({ page }) => {
    // ververStand() herhaalt elke 25s (setInterval); deze test bevestigt dat
    // een herhaaldelijk falende fetch geen onafgehandelde promise-rejection
    // of JS-fout veroorzaakt op een scherm dat 24/7 onbeheerd open staat.
    // page.clock simuleert de tijd i.p.v. echt 90 seconden te wachten.
    const paginaFouten: string[] = [];
    page.on("pageerror", (err) => paginaFouten.push(err.message));

    await page.clock.install();
    await page.goto("/present.html");
    await page.clock.runFor("00:01:30"); // ruim drie 25s-intervaltikken

    expect(paginaFouten).toEqual([]);
    await expect(page.locator(".kiosk-scherm")).toBeVisible();
  });
});
