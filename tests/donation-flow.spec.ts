// Doneerflow (hoofdpagina, sectie #doneren): het belangrijkste conversiepad
// van de site. Getest via het echte fetch("/api/create-checkout")-contract
// (src/js/interactions.ts, startBedragKiezen()) met page.route()-mocks voor
// de Stripe-respons — zo testen we het frontend-gedrag deterministisch,
// zonder een echte Stripe-sleutel of de Vercel-serverless-runtime nodig te
// hebben. Zie api/create-checkout.ts voor het daadwerkelijke API-contract
// ({ url } bij succes, { error } of niets bij falen).
import { test, expect, type Page } from "@playwright/test";
import { sluitCookiebanner } from "./helpers.js";

const MOCK_CHECKOUT_URL = "https://checkout.stripe.com/mock-sessie/happy-flow";

/** Laat /api/create-checkout een geslaagde Stripe-sessie teruggeven, en
 * vangt de navigatie ernaartoe op zodat de test niet echt het internet op
 * hoeft (checkout.stripe.com zelf zou in een sandboxed CI-runner falen). */
async function mockGeslaagdeCheckout(page: Page): Promise<void> {
  await page.route("**/api/create-checkout", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: MOCK_CHECKOUT_URL }),
    });
  });
  await page.route(`${MOCK_CHECKOUT_URL.split("/mock-sessie")[0]}/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Mock Stripe Checkout</title><h1>Mock Stripe Checkout</h1>",
    });
  });
}

test.describe("Doneerflow — happy path (mocked Stripe-checkout)", () => {
  test("een vast bedrag kiezen stuurt door naar de Stripe-checkoutpagina", async ({ page }) => {
    await mockGeslaagdeCheckout(page);
    await page.goto("/");
    await sluitCookiebanner(page);

    await test.step("klik op de €25-chip", async () => {
      await page.locator('[data-bedrag-chip][data-euro="25"]').click();
    });

    // Geen assert op de tussentijdse "wordt doorgestuurd…"-melding: in
    // Chromium is de gemockte navigatie soms al voltooid vóórdat we die
    // melding kunnen lezen, wat de assert-en-navigatie in een race zet.
    // De navigatie zelf is de betekenisvolle uitkomst van deze happy flow.
    await test.step("de site stuurt daadwerkelijk door naar de checkoutpagina", async () => {
      await page.waitForURL(`${MOCK_CHECKOUT_URL}*`);
      expect(page.url()).toBe(MOCK_CHECKOUT_URL);
    });
  });

  test("een zelfgekozen bedrag doneren stuurt door naar de Stripe-checkoutpagina", async ({ page }) => {
    await mockGeslaagdeCheckout(page);
    await page.goto("/");
    await sluitCookiebanner(page);

    let verzondenBedrag: unknown;
    await page.route("**/api/create-checkout", async (route) => {
      verzondenBedrag = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: MOCK_CHECKOUT_URL }),
      });
    });

    await page.locator("[data-bedrag-eigen]").fill("75");
    await page.locator("[data-bedrag-eigen-form] button[type=submit]").click();

    await page.waitForURL(`${MOCK_CHECKOUT_URL}*`);
    // Regressie-guard: €75 moet als 7500 cent bij de API terechtkomen, niet
    // als 75 (centen-vs-euro-verwarring is een klassieke betaalbug).
    expect(verzondenBedrag).toMatchObject({ cents: 7500 });
  });
});

test.describe("Doneerflow — sad paths", () => {
  test("doneren zonder bedrag in te vullen wordt geweigerd zonder dat er een netwerkverzoek gebeurt", async ({ page }) => {
    // Bewust het veld léég laten i.p.v. "0" invullen: het invoerveld heeft
    // min="1", dus bij een ingevulde waarde van "0" blokkeert de browser
    // zelf al de submit (native HTML5-validatie, vóórdat onze JS ooit
    // draait) — dat zou hier niets over interactions.ts zeggen. Een léég,
    // niet-verplicht veld ontsnapt aan die native check en bereikt wél de
    // eigen validatie in doneer() (Number("") || 0 → 0 → geweigerd).
    await page.goto("/");
    await sluitCookiebanner(page);

    let apiAangeroepen = false;
    await page.route("**/api/create-checkout", (route) => {
      apiAangeroepen = true;
      return route.continue();
    });

    await page.locator("[data-bedrag-eigen-form] button[type=submit]").click();

    await expect(page.locator("[data-doneer-status]")).toContainText(
      "Vul een bedrag van minimaal",
    );
    await expect(page.locator("[data-doneer-status]")).toHaveClass(/is-fout/);
    expect(apiAangeroepen).toBe(false);
  });

  test("een bedrag boven de € 100.000-grens wordt client-side geweigerd (verdediging in de diepte)", async ({ page }) => {
    // Het invoerveld heeft max="100000" als HTML5-constraint, maar
    // startBedragKiezen() in interactions.ts herhaalt die grens zelf in JS
    // (zie ook security.spec.ts, dat de HTML5-attributen zelf controleert).
    // Om de JS-validatie hier écht geïsoleerd te testen — dus ook voor het
    // geval iemand ooit het max-attribuut verwijdert of manipuleert —
    // wordt de HTML5-constraint bewust eerst weggehaald: anders blokkeert
    // de browser de submit al vóórdat interactions.ts ooit draait, en zou
    // deze test in werkelijkheid niets over de JS-laag bewijzen.
    await page.goto("/");
    await sluitCookiebanner(page);
    await page.locator("[data-bedrag-eigen]").evaluate((el) => el.removeAttribute("max"));

    let apiAangeroepen = false;
    await page.route("**/api/create-checkout", (route) => {
      apiAangeroepen = true;
      return route.continue();
    });

    await page.locator("[data-bedrag-eigen]").fill("999999");
    await page.locator("[data-bedrag-eigen-form] button[type=submit]").click();

    await expect(page.locator("[data-doneer-status]")).toContainText(
      "Vul een bedrag van minimaal",
    );
    expect(apiAangeroepen).toBe(false);
  });

  test("een lege API-respons (geen betaal-URL) toont de foutmelding en houdt het IBAN als terugval zichtbaar", async ({ page }) => {
    await page.route("**/api/create-checkout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}), // geen url-veld: precies wat interactions.ts als falen behandelt
      });
    });
    await page.goto("/");
    await sluitCookiebanner(page);

    await page.locator('[data-bedrag-chip][data-euro="50"]').click();

    await expect(page.locator("[data-doneer-status]")).toContainText(
      "Online doneren lukt op dit moment even niet",
    );
    await expect(page.locator("[data-doneer-status]")).toHaveClass(/is-fout/);
    // [data-iban] komt twee keer voor op de pagina (doneer-sectie + footer);
    // hier gaat het specifiek om de terugval in de doneer-sectie zelf.
    await expect(page.locator("#doneren [data-iban]")).toBeVisible();
    // De pagina mag niet zijn weggenavigeerd na een mislukte poging.
    await expect(page).toHaveURL(/\/$/);
  });

  test("een onbereikbare API (netwerkfout) toont dezelfde nette foutmelding, geen onafgehandelde crash", async ({ page }) => {
    await page.route("**/api/create-checkout", (route) => route.abort("failed"));
    await page.goto("/");
    await sluitCookiebanner(page);

    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.locator('[data-bedrag-chip][data-euro="10"]').click();

    await expect(page.locator("[data-doneer-status]")).toContainText(
      "Online doneren lukt op dit moment even niet",
    );
    expect(consoleErrors).toEqual([]);
  });

  test("na een mislukte poging kan een nieuwe poging weer gewoon lukken", async ({ page }) => {
    // Regressie-guard voor de "bezig"-vlag in startBedragKiezen(): die moet
    // na een fout weer op false gezet worden, anders blijft de knop
    // permanent "vergrendeld" na één netwerkfoutje.
    let pogingen = 0;
    await page.route("**/api/create-checkout", async (route) => {
      pogingen += 1;
      if (pogingen === 1) {
        await route.abort("failed");
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: MOCK_CHECKOUT_URL }),
      });
    });
    await page.route(`${MOCK_CHECKOUT_URL.split("/mock-sessie")[0]}/**`, (route) =>
      route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Mock</h1>" }),
    );

    await page.goto("/");
    await sluitCookiebanner(page);

    const chip = page.locator('[data-bedrag-chip][data-euro="10"]');
    await chip.click();
    await expect(page.locator("[data-doneer-status]")).toContainText(
      "Online doneren lukt op dit moment even niet",
    );

    await chip.click();
    await page.waitForURL(`${MOCK_CHECKOUT_URL}*`);
    expect(pogingen).toBe(2);
  });
});
