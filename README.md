# Druppels van Sakīnah — campagnewebsite

Statische, Nederlandstalige campagnesite voor de aankoop van het
gebedshuis aan de Borndiep 2B (Capelle aan den IJssel) door
Stichting IV Het Trefpunt / Dār as-Sakīnah.

**Statisch, geen database, geen tracking zonder toestemming.** Alle
campagnedata staat in [`data/campagne.js`](data/campagne.js) — zie
[`BEHEER.md`](BEHEER.md) voor het bijwerken door het campagneteam. Voor
doneren zijn er twee kleine Vercel serverless functions (`api/`, zie
[`docs/IDEAL-EN-TRACKER-KOPPELEN.md`](docs/IDEAL-EN-TRACKER-KOPPELEN.md));
er is geen eigen database.

## Lokaal draaien

```bash
yarn
yarn dev           # ontwikkelserver op http://localhost:5173
```

```bash
yarn build         # productie-build naar dist/
yarn preview       # de build lokaal bekijken
```

Deployen kan op elke statische host; de site verwacht te draaien op de
**root** van een domein (absolute paden naar `/assets/...`). Op Vercel:
project koppelen → framework "Vite" → klaar.

## Structuur

```
data/campagne.js        ← teller, teams, acties (enige beheerbestand)
data/campagne.types.ts  ← types voor campagne.js (dat zelf plain JS blijft, zie BEHEER.md)
index.html              ← de one-page campagnesite
privacy.html            ← privacyverklaring
present.html            ← /present, kioskscherm voor een staande tablet
src/css/                ← tokens, basis, secties, svg-scènes
src/js/                 ← modules in TypeScript (zie hieronder)
api/                    ← Vercel serverless functions (Stripe checkout + live totaal)
public/assets/          ← fonts, geoptimaliseerde foto's, video's
scripts/                ← eenmalige asset-hulpscripts (sharp)
tests/                  ← Playwright e2e-suite, zie docs/TESTING.md
docs/                   ← technische achtergronddocumenten
```

Belangrijkste modules:

- `src/js/logo-paths.ts` — de exacte SVG-paden uit het officiële logo
  (zelfde data als het Remotion-project `das-logo-video`).
- `src/js/hero-anim.ts` — native SVG-port van de Remotion-logoanimatie
  (druppels → stijgend water → koepel), incl. rustfase met losse druppels.
- `src/js/koepel.ts` — de koepel als voortgangsmeter: waterpeil =
  werkelijk percentage, 16 golfmijlpalen, levend wateroppervlak.
- `src/js/render.ts` — vult alle datagedreven onderdelen uit
  `data/campagne.js` (teller, teams, acties, wa.me-links).
- `src/js/motion.ts` — scroll-onthullingen, tellers, sticky knop,
  lazy video's, golf-overgangen.

## Testen en documentatie

```bash
yarn lint          # eslint .
yarn typecheck      # tsc --noEmit
yarn test:e2e        # Playwright e2e-suite (bouwt + start de site zelf)
```

Zie [`docs/TESTING.md`](docs/TESTING.md) voor wat de suite dekt en hoe
CI (`.github/workflows/ci.yml`) hem draait, en
[`docs/IDEAL-EN-TRACKER-KOPPELEN.md`](docs/IDEAL-EN-TRACKER-KOPPELEN.md)
voor de achtergrond bij de Stripe/iDEAL-integratie.

## Afspraken

- **Huisstijl:** officieel palet uit `Kleurpalet_HetTrefpunt.pdf`
  (Deep Teal `#00847E`, Soft Mint `#38B6AB`, Midnight Navy `#1F2C54`,
  Clean Ivory, Amber Gold als zeldzaam vieringsaccent). Merkfont
  Bergen Sans, zelf gehost als woff2.
- **Strategie:** de site vraagt nergens om grote bedragen; het hoogste
  genoemde bedrag is € 1.000 ("een hele druppel").
- **Toegankelijkheid:** `prefers-reduced-motion` zet alle beweging stil
  en toont de koepel statisch gevuld.
- **Openstaande punten:** zoek op `TODO` — IBAN, KvK, WhatsApp-nummer,
  e-mail, betaal-QR, iDEAL-knop, ANBI-FAQ-item en de religieuze citaten
  (verifiëren door de imam).

## Video's

- `public/assets/video/regen-footer.mp4` — voor de footer (1280×720,
  geknipt en gecomprimeerd uit `fotos-site/heavyrainvideo.mp4`).
- `logo-druppels-vierkant/story` — renders uit het Remotion-project
  (`das-logo-video`), gebruikt in de deel-sectie als downloadbare
  WhatsApp-statusvideo's.

Foto's opnieuw genereren vanuit de bronmap: `yarn assets`
(zie `scripts/optimize-images.mjs`).
