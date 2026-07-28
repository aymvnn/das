// Security- en privacygerichte regressietests. Focus op wat vanuit de
// browser daadwerkelijk verifieerbaar is voor een statische Vite-site met
// twee Vercel-serverless-functions: geen gelekte geheimen in de
// client-bundel, reverse-tabnabbing-preventie op externe links, en de
// privacy-by-default-belofte uit privacy.html (geen tracking zonder
// expliciete toestemming) die ook in consent.ts wordt afgedwongen.
import { test, expect } from "@playwright/test";

test.describe("Geen gelekte geheimen in de client", () => {
  test("geen Stripe secret key of vergelijkbaar geheim in HTML/JS die de browser ontvangt", async ({ page }) => {
    const geladenBronnen: string[] = [];
    page.on("response", async (response) => {
      const contentType = response.headers()["content-type"] ?? "";
      if (!contentType.includes("javascript") && !contentType.includes("text/html")) return;
      try {
        geladenBronnen.push(await response.text());
      } catch {
        // Body soms niet meer beschikbaar (bv. na een redirect) — negeren,
        // dat is geen lek, alleen een gemiste dubbele meting.
      }
    });

    await page.goto("/");
    await page.locator("[data-cookie-weigeren]").click();
    // De doneerknop triggert interactions.ts volledig, inclusief de
    // fetch-aanroep naar /api/create-checkout — ook die responscode moet
    // schoon zijn.
    await page.locator('[data-bedrag-chip][data-euro="10"]').click();

    expect(geladenBronnen.length, "er zou tenminste HTML/JS geladen moeten zijn om te controleren").toBeGreaterThan(0);

    const verdachtePatronen: RegExp[] = [
      /sk_live_[A-Za-z0-9]+/,
      /sk_test_[A-Za-z0-9]+/,
      /STRIPE_SECRET_KEY\s*[:=]\s*["'`][^"'`]+["'`]/,
    ];
    for (const bron of geladenBronnen) {
      for (const patroon of verdachtePatronen) {
        expect(bron, `verdacht patroon ${patroon} gevonden in een naar de browser gestuurde bron`).not.toMatch(
          patroon,
        );
      }
    }
  });
});

test.describe("Externe links — bescherming tegen reverse tabnabbing", () => {
  // Elke <a target="_blank"> zonder rel="noopener" geeft de geopende
  // pagina toegang tot window.opener, waarmee die de oorspronkelijke
  // (onze) pagina kan omleiden — een bekende phishingvector.
  for (const pad of ["/", "/privacy.html"] as const) {
    test(`alle target="_blank"-links op ${pad} hebben rel="noopener"`, async ({ page }) => {
      await page.goto(pad);
      const links = page.locator('a[target="_blank"]');
      const aantal = await links.count();
      expect(aantal, "verwacht minstens één target=_blank-link op deze pagina").toBeGreaterThan(0);

      for (let i = 0; i < aantal; i++) {
        const link = links.nth(i);
        const rel = (await link.getAttribute("rel")) ?? "";
        const href = await link.getAttribute("href");
        expect(rel, `link naar "${href}" mist rel="noopener"`).toMatch(/noopener/);
      }
    });
  }
});

test.describe("Netwerkverkeer — geen mixed content", () => {
  test("alle geladen resources komen via https binnen, nooit via onversleuteld http", async ({ page }) => {
    const onveiligeRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      // De preview-server zelf draait lokaal op http://localhost — dat is
      // de testomgeving, geen mixed-content-risico. Alles daarbuiten moet https zijn.
      if (url.startsWith("http://") && !url.startsWith("http://localhost")) {
        onveiligeRequests.push(url);
      }
    });

    await page.goto("/");
    await page.locator("[data-cookie-accepteren]").click();

    expect(onveiligeRequests).toEqual([]);
  });
});

test.describe("Cookietoestemming — privacy-by-default (geen tracking zonder toestemming)", () => {
  test("vóór elke keuze wordt Microsoft Clarity niet geladen en is er niets opgeslagen", async ({ page }) => {
    const clarityRequests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("clarity.ms")) clarityRequests.push(req.url());
    });

    await page.goto("/");
    await expect(page.locator("[data-cookie-banner]")).toBeVisible();

    expect(clarityRequests).toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem("analyticsToestemming"))).toBeNull();
    expect(await page.evaluate(() => "clarity" in window)).toBe(false);
  });

  test('"Weigeren" onthoudt de keuze in localStorage en laadt nooit Clarity', async ({ page }) => {
    const clarityRequests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("clarity.ms")) clarityRequests.push(req.url());
    });

    await page.goto("/");
    await page.locator("[data-cookie-weigeren]").click();

    await expect(page.locator("[data-cookie-banner]")).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem("analyticsToestemming"))).toBe("denied");
    expect(clarityRequests).toEqual([]);
  });

  test('"Accepteren" laadt Microsoft Clarity pas ná de klik, nooit ervoor', async ({ page }) => {
    const clarityRequests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("clarity.ms")) clarityRequests.push(req.url());
    });

    await page.goto("/");
    expect(clarityRequests, "Clarity mag nog niet geladen zijn vóór de klik").toEqual([]);

    await page.locator("[data-cookie-accepteren]").click();

    await expect.poll(() => clarityRequests.length, {
      message: "verwacht een Clarity-verzoek ná het accepteren van cookies",
    }).toBeGreaterThan(0);
    expect(await page.evaluate(() => localStorage.getItem("analyticsToestemming"))).toBe("granted");
  });

  test("een eerder gegeven toestemming blijft na een paginaherlaad geldig (geen banner meer)", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-cookie-accepteren]").click();
    await expect(page.locator("[data-cookie-banner]")).toBeHidden();

    await page.reload();

    await expect(page.locator("[data-cookie-banner]")).toBeHidden();
  });
});

test.describe("Invoervalidatie — verdediging in de diepte", () => {
  test("het bedragveld begrenst input al op HTML5-niveau (min 1, max 100000)", async ({ page }) => {
    // Naast de client-side JS-validatie (zie donation-flow.spec.ts) moet
    // ook de HTML5-constraint als eerste, snelste verdedigingslaag kloppen.
    // Als deze twee ooit uit sync raken, faalt bewust één van beide tests.
    await page.goto("/");
    const input = page.locator("[data-bedrag-eigen]");
    await expect(input).toHaveAttribute("min", "1");
    await expect(input).toHaveAttribute("max", "100000");
    await expect(input).toHaveAttribute("type", "number");
  });
});
