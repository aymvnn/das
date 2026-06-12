# Druppels van Sakīnah — campagnewebsite

Statische, Nederlandstalige campagnesite voor de aankoop van het
gebedshuis aan de Borndiep 2B (Capelle aan den IJssel) door
Stichting IV Het Trefpunt / Dār as-Sakīnah.

**Geen backend, geen database, geen tracking.** Alle campagnedata staat
in [`data/campagne.js`](data/campagne.js) — zie [`BEHEER.md`](BEHEER.md)
voor het bijwerken door het campagneteam.

## Lokaal draaien

```bash
npm install
npm run dev        # ontwikkelserver op http://localhost:5173
```

```bash
npm run build      # productie-build naar dist/
npm run preview    # de build lokaal bekijken
```

Deployen kan op elke statische host; de site verwacht te draaien op de
**root** van een domein (absolute paden naar `/assets/...`). Op Vercel:
project koppelen → framework "Vite" → klaar.

## Structuur

```
data/campagne.js        ← teller, teams, acties (enige beheerbestand)
index.html              ← de one-page campagnesite
privacy.html            ← privacyverklaring
src/css/                ← tokens, basis, secties, svg-scènes
src/js/                 ← modules (zie hieronder)
public/assets/          ← fonts, geoptimaliseerde foto's, video's
scripts/                ← eenmalige asset-hulpscripts (sharp)
```

Belangrijkste modules:

- `src/js/logo-paths.js` — de exacte SVG-paden uit het officiële logo
  (zelfde data als het Remotion-project `das-logo-video`).
- `src/js/hero-anim.js` — native SVG-port van de Remotion-logoanimatie
  (druppels → stijgend water → koepel), incl. rustfase met losse druppels.
- `src/js/koepel.js` — de koepel als voortgangsmeter: waterpeil =
  werkelijk percentage, 16 golfmijlpalen, levend wateroppervlak.
- `src/js/render.js` — vult alle datagedreven onderdelen uit
  `data/campagne.js` (teller, teams, acties, wa.me-links).
- `src/js/motion.js` — scroll-onthullingen, tellers, sticky knop,
  lazy video's, golf-overgangen.

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

Foto's opnieuw genereren vanuit de bronmap: `npm run assets`
(zie `scripts/optimize-images.mjs`).
