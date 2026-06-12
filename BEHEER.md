# Beheer van de campagnesite — voor het campagneteam

Je hoeft geen techneut te zijn om deze site bij te werken. Alles wat
verandert tijdens de campagne staat in **één bestand**:

> 📄 `data/campagne.js`

Open dat bestand in een teksteditor (Kladblok mag, maar gratis
[VS Code](https://code.visualstudio.com) is fijner) en je ziet bij elk
onderdeel uitleg in gewone taal.

---

## 1. De teller bijwerken (doe dit wekelijks)

Zoek in `data/campagne.js` deze twee regels:

```js
opgehaaldCents: 2200000, // € 22.000
laatsteUpdate: "12 juni 2026",
```

- **opgehaaldCents** = het opgehaalde bedrag **in centen**.
  Dus: € 31.500 → `3150000` (plak gewoon twee nullen achter het bedrag
  in euro's zonder punten: 31500 → 3150000).
- **laatsteUpdate** = de datum die bezoekers zien bij "Stand per …".

Sla op en publiceer (zie stap 5). De druppels, golven, het waterpeil in
de koepel en alle percentages rekenen zichzelf uit — daar hoef je niets
voor te doen.

### De overdrachtsdatum invullen (zodra die definitief is)

In `data/campagne.js` staat:

```js
overdrachtsdatum: "",
```

Zolang dit leeg is, zegt de site alleen "het aftellen is begonnen". Vul
je de datum voluit in — net als `laatsteUpdate`:

```js
overdrachtsdatum: "30 september 2026",
```

…dan verschijnt vanzelf **"nog X weken tot de overdracht"** op vier
plekken (bij de teller, in het verhaal en in twee FAQ-antwoorden). De
site rekent zelf om naar weken, en de laatste twee weken naar dagen.

Kan niet stuk: bij een typfout of een verstreken datum toont de site
gewoon weer de gewone tekst.

## 2. Een team toevoegen of bijwerken

Zoek het blok `teams: [ ... ]`. Elk team ziet er zo uit:

```js
{
  naam: "Team Al-Fajr",
  doelCents: 1000000,      // Golf — € 10.000
  opgehaaldCents: 415000,  // € 4.150
  beschrijving: "Acht vrienden die elkaar al kennen sinds de koranschool.",
  whatsappLink: "",
},
```

- **Nieuw team:** kopieer zo'n heel blok (van `{` t/m `},`), plak het
  eronder en pas de gegevens aan.
- **Doelbedragen:** Druppel `250000` · Stroom `500000` · Golf `1000000`
  · Bron `2500000`.
- **Team verwijderen:** haal het hele blok weg (inclusief de `},`).
- De volgorde in het bestand is de volgorde op de site — zet bijv. het
  best presterende team bovenaan.

## 3. Een actiefoto toevoegen

1. Zet de foto in de map `public/assets/img/acties/`.
   Gebruik een korte naam zonder spaties, bijv. `bakactie-mei.jpg`.
   (Het liefst eerst even verkleinen tot ±900 px breed via
   bijv. iloveimg.com/resize-image — dan blijft de site snel.)
2. Voeg in `data/campagne.js` bij `acties:` een blok toe:

```js
{
  titel: "Bakactie van de zusters",
  beschrijving: "Eén ochtend bakken, € 640 aan druppels.",
  foto: "assets/img/acties/bakactie-mei.jpg",
},
```

## 4. Het IBAN, WhatsApp-nummer of e-mailadres aanpassen

Bovenin `data/campagne.js` staan `iban`, `kvk`, `whatsappNummer`,
`contactEmail` en `siteUrl`. Pas ze aan en alle knoppen en teksten op
de site (ook de kopieerknop, de footer en de vooringevulde
WhatsApp-berichten) gebruiken meteen de nieuwe gegevens.

> ⚠️ Er staat nog één **placeholder** in: het WhatsApp-nummer
> (`31600000000`). Vervang dat vóór de lancering — en zoek in het
> project op `TODO` om niets te missen (o.a. de echte betaal-QR).

### Online doneren via iDEAL aanzetten

Onder "Doneren" kun je een bedrag aanklikken. Zolang `idealLink` in
`data/campagne.js` leeg is, licht het gekozen bedrag alleen op — er
wordt nog niets betaald. Plak je in `idealLink` een echte betaallink,
dan verschijnt de knop **"Doneer … via iDEAL"** vanzelf met het gekozen
bedrag. Zet in de link `{bedrag}` (euro's, bijv. 50) of `{centen}`
(5000) op de plek waar de betaalprovider het bedrag verwacht. Je hoeft
niets in de HTML aan te passen.

## 5. Publiceren

De site staat op Vercel en publiceert zichzelf bij elke wijziging op
GitHub:

1. Open GitHub Desktop (of de GitHub-website).
2. Je ziet je gewijzigde bestand(en) staan. Typ een korte omschrijving,
   bijv. *"teller bijgewerkt naar € 31.500"*.
3. Klik **Commit** en daarna **Push** (op de website: *Commit changes*).
4. Na ±1 minuut staat de nieuwe versie live. Klaar.

Liever zonder GitHub? Vraag de beheerder om `npm run build` te draaien
en de map `dist/` naar de host te uploaden — maar de GitHub-route is
makkelijker en veiliger.

## 6. Veelgemaakte foutjes

| Probleem | Oorzaak | Oplossing |
|---|---|---|
| Site doet het ineens niet meer | Een aanhalingsteken of komma te veel/te weinig in `campagne.js` | Maak de laatste wijziging ongedaan en probeer opnieuw, rustig aan |
| Teller toont raar bedrag | Bedrag in euro's i.p.v. centen ingevuld | Plak twee nullen achter het bedrag |
| Foto verschijnt niet | Bestandsnaam in `campagne.js` klopt niet precies (hoofdletters tellen mee!) | Controleer naam + map |
| Wijziging niet zichtbaar | Browser toont oude versie | Ververs hard: Ctrl+Shift+R (of wacht een minuut) |

Vragen? App de bouwer van de site — of kijk in `README.md` voor de
technische kant.
