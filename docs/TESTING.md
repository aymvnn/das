# Testen: lint, typecheck en de Playwright e2e-suite

> Doel: overzicht van hoe deze site getest wordt en hoe je dat lokaal en in CI draait.
> Bijgewerkt: juli 2026. Stack: TypeScript (strict) + ESLint, Playwright voor
> browser-e2e, GitHub Actions voor CI.

---

## Snel starten

```bash
yarn lint          # eslint .
yarn typecheck      # tsc --noEmit
yarn test:e2e        # de volledige Playwright-suite, alle browsers/devices
yarn test:e2e:ui    # dezelfde suite, met Playwright's interactieve UI-runner
```

`yarn test:e2e` bouwt de site eerst (`yarn build`) en start daarna `yarn preview` erbovenop
(zie `webServer` in `playwright.config.ts`) — je hoeft zelf niets te starten.

De eerste keer moeten de browsers zelf nog gedownload worden:

```bash
yarn playwright install
```

---

## Wat de suite dekt

Alle tests staan in `tests/` (config: `playwright.config.ts`, `testDir: "./tests"`):

| Bestand | Dekt |
|---|---|
| `tests/homepage.spec.ts` | Structuur van alle 12 secties, teller/koepel/team-rendering, NL↔AR-taalwissel, FAQ-accordeon, video-lightbox, IBAN kopiëren |
| `tests/donation-flow.spec.ts` | De doneerflow: happy path (vast/eigen bedrag → Stripe-checkout) én sad paths (leeg bedrag, bedrag boven de grens, lege/foutieve API-respons, onbereikbare API, retry na fout) |
| `tests/privacy.spec.ts` | Inhoud, taalwissel, mailto-link, "cookie-instellingen wijzigen" |
| `tests/present.spec.ts` | Kioskscherm (`/present.html`): structuur, en het sad-path-gedrag als `/api/total` onbereikbaar is |
| `tests/security.spec.ts` | `rel="noopener"` op externe links, geen gelekte secrets in de client-bundel, cookie-consent-gated Microsoft Clarity, https-only netwerkverkeer, HTML5-validatie verdediging in de diepte |
| `tests/helpers.ts` | Gedeelde hulpfuncties (bv. `sluitCookiebanner()`) |

**Browsers/devices:** chromium, firefox, webkit (desktop) + `mobile-chrome` (Pixel 7) en
`mobile-safari` (iPhone 14) — vijf projecten, dezelfde tests op elk.

**Bekende, bewust openstaande zaak:** `tests/homepage.spec.ts` heeft één `test.fixme()` voor
het 400-druppels-raster (`[data-druppelraster]`) — de bijbehorende HTML-container bestaat
niet meer in `index.html`, terwijl de renderlogica (`render.ts`/`motion.ts`) en CSS
(`sections.css`) nog wel volledig aanwezig zijn. Zie de comment bij die test.

---

## Hoe de doneerflow getest wordt zonder echte Stripe-sleutel

`tests/donation-flow.spec.ts` gebruikt Playwright's `page.route()` om `/api/create-checkout`
te onderscheppen en een nepantwoord terug te geven (geslaagde sessie-URL, foutmelding, of een
afgebroken verzoek). Zo test de suite het **echte frontend-contract** (`fetch()`-aanroep,
foutafhandeling, redirect) deterministisch, zonder dat er een Stripe-sleutel of de Vercel
serverless-runtime nodig is. Bewuste scope-keuze: dit test de frontend grondig, niet de
serverless functions zelf (`api/create-checkout.ts`, `api/total.ts`) — die zijn klein genoeg
om bij wijziging handmatig te verifiëren, en `vercel dev` erbij optuigen voor CI zou een
losse, zwaardere set-up vergen (Stripe test-keys in CI-secrets e.d.) voor weinig extra dekking.

De happy-path-tests mocken ook de bestemming (`checkout.stripe.com/**`) zodat de browser niet
echt het internet op hoeft.

---

## Determinisme: reduced motion en `page.clock`

- `playwright.config.ts` zet `contextOptions.reducedMotion: "reduce"`. De site respecteert
  `prefers-reduced-motion` door reveal-/koepel-/hero-animaties meteen naar hun eindstand te
  zetten (zie `src/js/motion.ts`, `koepel.ts`, `hero-anim.ts`) — dat maakt asserts op de
  eindstand voorspelbaar i.p.v. afhankelijk van animatietiming.
- Voor tijdgebaseerd gedrag (bv. de 25s-poll-interval van het kioskscherm) gebruiken tests
  Playwright's `page.clock` om tijd te simuleren, in plaats van er echt op te wachten — zie
  `tests/present.spec.ts`.

---

## CI

`.github/workflows/ci.yml` draait op elke push naar `main` en op elke (niet-draft) pull
request, met twee jobs:

1. **`lint-and-typecheck`** — `yarn lint` + `yarn typecheck`.
2. **`e2e`** — draait pas als job 1 slaagt (`needs:`), installeert Playwright-browsers (met
   caching op `~/.cache/ms-playwright`), en draait `yarn test:e2e`. Bij een falende run wordt
   het HTML-rapport als artifact geüpload.

Draft-PR's slaan CI over (`if: … draft == false`); zodra een draft op "ready for review"
gezet wordt, draait CI alsnog (`ready_for_review` staat expliciet in de trigger-`types`).

---

## Iets aan de site veranderd? Waar op letten

- Nieuwe `data-*`-attributen die uniek horen te zijn: controleer of ze dat ook zijn.
  `[data-iban]` en `[data-countup]`-achtige selectors komen bv. op meerdere plekken op de
  pagina voor (doneer-sectie + footer) — scope de locator (`#doneren [data-iban]`) of gebruik
  bewust `.first()`.
- Een `<input min max>` blokkeert formulier-submit via de native HTML5-validatie vóórdat JS
  ooit draait, voor waarden die buiten die grenzen vallen. Wil je de JS-validatie zelf
  isoleren testen (verdediging in de diepte), haal dan eerst het attribuut weg
  (`el.removeAttribute("max")`) vóór je invult en verstuurt.
