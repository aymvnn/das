// Gedeelde hulpfuncties voor de tests.
import type { Page } from "@playwright/test";

/**
 * Sluit de cookiebanner af zodra die verschijnt. Elke test start met een
 * schone browsercontext (geen localStorage), dus de banner verschijnt bij
 * elk paginabezoek totdat er een keuze is gemaakt. Tests die niet zelf de
 * cookiebanner testen, roepen dit meteen na `page.goto()` aan zodat de
 * banner niet per ongeluk andere interacties blokkeert.
 *
 * Standaard "weigeren": houdt de testomgeving privacy-neutraal (geen
 * Microsoft Clarity-script) tenzij een test bewust "accepteren" kiest.
 */
export async function sluitCookiebanner(
  page: Page,
  keuze: "accepteren" | "weigeren" = "weigeren",
): Promise<void> {
  const knop = page.locator(
    keuze === "accepteren" ? "[data-cookie-accepteren]" : "[data-cookie-weigeren]",
  );
  await knop.click();
}
