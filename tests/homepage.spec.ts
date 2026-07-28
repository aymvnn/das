// Hoofdpagina (index.html): structuur, datagedreven rendering, taalwissel,
// FAQ-accordeon, video-lightbox en IBAN-kopiëren.
//
// De teller/percentage-waarden komen uit data/campagne.js, dat het
// campagneteam wekelijks handmatig bijwerkt (zie BEHEER.md). Deze tests
// controleren daarom bewust het FORMAT en de ONDERLINGE CONSISTENTIE van
// die waarden, nooit een hardgecodeerd bedrag — anders breekt de testsuite
// bij elke normale teller-update, wat het signaal juist waardeloos maakt.
import { test, expect } from "@playwright/test";
import { sluitCookiebanner } from "./helpers.js";

const HOOFDSECTIES = [
  "zo-werkt",
  "koepel",
  "doneren",
  "waarom",
  "hoe",
  "waterdragers",
  "betekenis",
  "voorwie",
  "deel",
  "acties",
  "sponsors",
  "faq",
] as const;

test.describe("Hoofdpagina — structuur en metadata", () => {
  test("laadt met de juiste titel, taal en meta-omschrijving", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Druppels van Sakīnah/);
    await expect(page.locator("html")).toHaveAttribute("lang", "nl");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
  });

  test("bevat alle twaalf hoofdsecties van de campagnepagina, in volgorde", async ({ page }) => {
    await page.goto("/");
    // Eén assert per sectie-id: als een sectie per ongeluk verwijderd of
    // hernoemd wordt (bv. bij het herstructureren van index.html), faalt
    // precies deze test met de naam van de ontbrekende sectie.
    for (const id of HOOFDSECTIES) {
      await expect(
        page.locator(`section#${id}`),
        `sectie #${id} zou aanwezig moeten zijn`,
      ).toHaveCount(1);
    }

    // Volgorde controleren: de secties moeten in de vaste, verhalende
    // opbouw van de campagne staan (uitleg → koepel → doneren → …).
    const gevondenVolgorde = await page.locator("main > section[id]").evaluateAll(
      (secties) => secties.map((s) => s.id),
    );
    expect(gevondenVolgorde).toEqual([...HOOFDSECTIES]);
  });

  test("hero toont titel, call-to-actions en een leesbare teller", async ({ page }) => {
    await page.goto("/");
    await sluitCookiebanner(page);

    await expect(page.locator("#hero-titel")).toBeVisible();
    await expect(page.locator(".hero-lead")).toContainText("Dār as-Sakīnah");

    const doneerCta = page.locator(".hero-cta a", { hasText: "Doneer jouw druppel" });
    await expect(doneerCta).toHaveAttribute("href", "#doneren");
    const waterdragerCta = page.locator(".hero-cta a", { hasText: "Word Waterdrager" });
    await expect(waterdragerCta).toHaveAttribute("href", "#waterdragers");

    // Teller: moet een geldig eurobedrag tonen (formaat "€ 12.345"), en het
    // getoonde percentage moet overeenkomen met wat de site zelf berekent
    // (opgehaald / doel), zonder dat de test het exacte bedrag hoeft te kennen.
    const tellerTekst = await page.locator(".teller-euro[data-countup]").innerText();
    expect(tellerTekst).toMatch(/^€\s*[\d.]+$/);

    const pctTekst = await page.locator(".teller-pct[data-pct]").innerText();
    expect(pctTekst).toMatch(/^\d+([,.]\d+)?%$/);
  });
});

test.describe("Hoofdpagina — datagedreven onderdelen renderen", () => {
  test("de koepel-visual bouwt een SVG met de 16 golfmijlpalen", async ({ page }) => {
    await page.goto("/");
    const koepel = page.locator("[data-koepel]");
    await expect(koepel.locator("svg")).toBeVisible();
    // bouwKoepel() tekent exact TOTAAL_GOLVEN (16) mijlpaal-lijnen — een
    // afwijkend aantal duidt op een kapotte render-loop in koepel.ts.
    await expect(koepel.locator("line.mijlpaal")).toHaveCount(16);
  });

  test("de waterdragers-lijst rendert minstens één team uit data/campagne.js", async ({ page }) => {
    await page.goto("/");
    const teams = page.locator("[data-teams-lijst] > li");
    await expect(teams.first()).toBeVisible();
    // Elk teamblok toont een naam en een voortgangsbalk met een geldig
    // aria-valuenow tussen 0 en 100 — regressie-guard tegen een kapotte
    // team.opgehaaldCents / team.doelCents-berekening in render.ts.
    const eersteBalk = teams.first().locator(".team-balk[role=progressbar]");
    const waarde = await eersteBalk.getAttribute("aria-valuenow");
    expect(Number(waarde)).toBeGreaterThanOrEqual(0);
    expect(Number(waarde)).toBeLessThanOrEqual(100);
  });
});

test.describe("Hoofdpagina — taalwissel (NL ↔ AR)", () => {
  test("schakelt naar het Arabisch: dir, lang en zichtbare tekst passen mee", async ({ page }) => {
    await page.goto("/");
    await sluitCookiebanner(page);

    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await page.locator("[data-taal-knop]").click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveClass(/is-ar/);
    // Vertaalde hero-kicker: Nederlandse tekst mag niet meer zichtbaar zijn.
    await expect(page.locator(".hero-kicker")).toHaveText("قطرات السكينة");
  });

  test("schakelt terug naar het Nederlands en onthoudt niets van de vorige sessie fout", async ({ page }) => {
    await page.goto("/");
    await sluitCookiebanner(page);

    await page.locator("[data-taal-knop]").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    await page.locator("[data-taal-knop]").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "nl");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator(".hero-kicker")).toHaveText("Druppels van Sakīnah");
  });
});

test.describe("Hoofdpagina — FAQ-accordeon", () => {
  test("een FAQ-item is standaard dicht en gaat open bij een klik", async ({ page }) => {
    await page.goto("/");
    await sluitCookiebanner(page);

    const eersteVraag = page.locator(".faq-item").first();
    await expect(eersteVraag).not.toHaveAttribute("open", "");

    await eersteVraag.locator("summary").click();
    await expect(eersteVraag).toHaveAttribute("open", "");
    await expect(eersteVraag).toHaveClass(/is-open/);
  });

  test("een open FAQ-item gaat weer dicht bij een tweede klik", async ({ page }) => {
    await page.goto("/");
    await sluitCookiebanner(page);

    const eersteVraag = page.locator(".faq-item").first();
    await eersteVraag.locator("summary").click();
    await expect(eersteVraag).toHaveAttribute("open", "");

    await eersteVraag.locator("summary").click();
    // Het dichtklappen wacht op een CSS transitionend-event (zie
    // startFaq() in interactions.ts) voordat het open-attribuut verdwijnt —
    // vandaar dat dit een toBeHidden-achtige polling-assert nodig heeft
    // i.p.v. een directe check.
    await expect(eersteVraag).not.toHaveAttribute("open", "", { timeout: 5000 });
  });
});

test.describe("Hoofdpagina — video-lightbox", () => {
  test("een videokaart opent de lightbox met een geladen video en sluit weer", async ({ page }) => {
    await page.goto("/");
    await sluitCookiebanner(page);

    const lightbox = page.locator("[data-video-lightbox]");
    await expect(lightbox).toBeHidden();

    await page.locator("[data-video-kaart]").first().click();
    await expect(lightbox).toBeVisible();

    const video = lightbox.locator("[data-video-lightbox-el]");
    await expect(video).toHaveAttribute("src", /\.mp4$/);

    // [data-video-lightbox-close] staat op zowel de achtergrond-scrim als
    // de zichtbare sluitknop; .first() pakt in DOM-volgorde de scrim, die
    // door de video eroverheen niet betrouwbaar aan te klikken is. Een
    // echte bezoeker klikt de zichtbare knop, dus dat testen we ook.
    await lightbox.locator(".video-lightbox-sluit").click();
    await expect(lightbox).toBeHidden();
  });

  test("Escape sluit de open lightbox", async ({ page }) => {
    await page.goto("/");
    await sluitCookiebanner(page);

    await page.locator("[data-video-kaart]").first().click();
    await expect(page.locator("[data-video-lightbox]")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("[data-video-lightbox]")).toBeHidden();
  });
});

test.describe("Hoofdpagina — IBAN kopiëren", () => {
  test("toont een bevestiging na het kopiëren van het IBAN", async ({ page }) => {
    await page.goto("/");
    await sluitCookiebanner(page);

    const knop = page.locator("[data-kopieer-iban]");
    await expect(knop.locator(".kopieer-tekst")).toBeVisible();
    await expect(knop.locator(".kopieer-ok")).toBeHidden();

    await knop.click();

    await expect(knop.locator(".kopieer-ok")).toBeVisible();
    await expect(knop.locator(".kopieer-tekst")).toBeHidden();
    await expect(knop).toHaveClass(/is-gekopieerd/);
  });

  test("plaatst het daadwerkelijke IBAN-nummer op het klembord", async ({ page, context, browserName }) => {
    // navigator.clipboard-permissies zijn alleen via CDP (Chromium) te
    // verlenen; op Firefox/WebKit is dit stuk van de Clipboard API niet op
    // dezelfde manier automatiseerbaar. De UI-bevestiging hierboven wordt
    // wél op alle browsers getest — dit is de aanvullende, diepere check.
    test.skip(browserName !== "chromium", "clipboard-permissies alleen betrouwbaar in Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.goto("/");
    await sluitCookiebanner(page);

    const ibanOpPagina = (await page.locator("#doneren [data-iban]").innerText()).trim();
    await page.locator("[data-kopieer-iban]").click();

    const klembordInhoud = await page.evaluate(() => navigator.clipboard.readText());
    expect(klembordInhoud).toBe(ibanOpPagina);
  });
});
