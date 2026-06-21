/* ============================================================
   CAMPAGNEDATA — Druppels van Sakīnah
   ============================================================
   Dit is het ENIGE bestand dat je hoeft aan te passen om de
   site bij te werken. Alles op de site (teller, druppels,
   golven, waterpeil, teams, acties) wordt hieruit berekend.

   Spelregels:
   - Bedragen staan in CENTEN (dus € 22.000 = 2200000).
     Zo voorkomen we afrondingsfouten.
   - Tekst altijd tussen "aanhalingstekens".
   - Laat na elke regel met een waarde de komma staan.
   - Klaar? Opslaan, en publiceren zoals beschreven in BEHEER.md.
   ============================================================ */

export const campagne = {
  /* --- DE TELLER ----------------------------------------- */

  // Het einddoel. Verander dit niet zomaar: 400 druppels × € 1.000.
  doelCents: 40000000, // € 400.000

  // ✏️ WERK DIT BIJ — DONATIES BUITEN DE WEBSITE (bankoverschrijving, contant,
  // eerdere acties, kortom alles wat NIET via de iDEAL-knop op de site binnenkwam).
  // Vul hier het TOTAAL in centen in. Voorbeeld: € 20.000 → 2000000.
  // Dit wordt AUTOMATISCH OPGETELD bij de online donaties die de site live uit
  // Stripe ophaalt — de online iDEAL-donaties hoef je dus NIET zelf bij te houden.
  buitenStripeCents: 2000000, // € 20.000  (al buiten de site opgehaald: bankoverschrijving/contant/eerdere acties)

  // De totale stand wordt automatisch berekend: Stripe-donaties + buitenStripeCents.
  // Dit veld is alleen een terugval voor als de live koppeling even onbereikbaar is;
  // normaal hoef je het niet aan te raken (het wordt automatisch overschreven).
  opgehaaldCents: 0,

  // ✏️ WERK DIT BIJ: de datum die bij de teller staat ("Stand per …").
  laatsteUpdate: "21 juni 2026",

  // ✏️ De overdrachtsdatum: de dag dat het pand bij de notaris van ons wordt.
  // Schrijf 'm voluit, net als laatsteUpdate: "30 september 2026".
  // Zolang dit leeg is (""), zegt de site alleen "het aftellen is begonnen".
  // Vul je de datum in, dan verschijnt vanzelf "nog X weken tot de overdracht"
  // bij de teller, in het verhaal en in de veelgestelde vragen.
  // Typfout of datum voorbij? De site toont dan gewoon weer de gewone tekst.
  overdrachtsdatum: "",

  /* --- BETAALGEGEVENS ------------------------------------ */

  iban: "NL77 RABO 0170 9862 92",
  tnv: "Stichting IV Het Trefpunt",
  kvk: "99465655", // KvK-nummer (wordt in de footer getoond)
  // Wat mensen bij hun overschrijving zetten:
  kenmerk: "Druppel", // + eventueel teamnaam, bijv. "Druppel — Team Al-Fajr"

  // De online betaal-/iDEAL-link. Leeg ("") = er gebeurt nog niets bij het
  // klikken op een bedrag, behalve dat het bedrag oplicht (alleen visueel).
  // ✏️ Zodra de betaallink (bijv. Mollie/bunq) klaar is: plak 'm hier en de
  // "Doneer via iDEAL"-knop verschijnt vanzelf met het gekozen bedrag.
  // Zet {bedrag} waar de euro's moeten (50) of {centen} waar centen moeten
  // (5000), bijv. "https://betaal.link/pay?amount={bedrag}". Heeft jouw link
  // geen plek voor een bedrag nodig? Plak dan gewoon de kale link.
  idealLink: "",

  /* --- CONTACT -------------------------------------------- */

  // TODO: vervang door het echte campagne-WhatsAppnummer
  // (internationaal formaat, zonder + of spaties: 31612345678).
  whatsappNummer: "31600000000",

  // Het e-mailadres van de stichting (bevestigd). Hierheen gaan o.a. de
  // vertrouwelijke duʿā'-verzoeken en de grotere-gift-aanvragen.
  contactEmail: "info@trefpunt-capelle.nl",

  // De website-URL (gebruikt in de WhatsApp-deeltekst en de share-tags).
  siteUrl: "https://dasactie.nl",

  // De WhatsApp-community waar de gemeenschap samenkomt (uitnodigingslink).
  // Alle algemene "via WhatsApp"-knoppen op de site verwijzen hierheen.
  whatsappCommunity: "https://chat.whatsapp.com/HOZSyUVUcfCASXlPDPdwHz?s=sh&p=a&ilr=1&amv=0",

  // Sociale kanalen (laat een veld leeg "" om dat icoon te verbergen).
  social: {
    instagram: "https://instagram.com/hettrefpunt.darassakinah",
    tiktok: "https://www.tiktok.com/@trefpunt.dar.assa",
    facebook: "https://www.facebook.com/profile.php?id=61587113072523",
  },

  /* --- WATERDRAGERS (TEAMS) -------------------------------
     Per team: naam, doelCents, opgehaaldCents, beschrijving.
     ✏️ opgehaaldCents = wat dit team tot nu toe ophaalde, IN CENTEN
        (€ 4.150 → 415000). Vul dit per team HANDMATIG bij; de teamstanden
        lopen niet automatisch mee met de online donaties.
     De doelniveaus heten:
       Druppel  € 2.500   →   250000
       Stroom   € 5.000   →   500000
       Golf     € 10.000  →  1000000
       Bron     € 25.000  →  2500000
     Nieuw team erbij? Kopieer een blok { ... }, (komma ertussen!)
     en pas de gegevens aan. Team weghalen: verwijder het hele blok.
     whatsappLink is optioneel: een uitnodigingslink van de
     team-groepsapp ("https://chat.whatsapp.com/...") of leeg "".
  --------------------------------------------------------- */
  teams: [
    {
      naam: "Ondernemers van de Terp",
      doelCents: 2500000, // Bron — € 25.000
      opgehaaldCents: 0, // € 0
      beschrijving: "Winkeliers en zzp'ers rond winkelcentrum de Terp leggen samen een bron aan.",
      whatsappLink: "",
    },
    {
      naam: "Team Al-Fajr",
      doelCents: 1000000, // Golf — € 10.000
      opgehaaldCents: 0, // € 0
      beschrijving: "Acht vrienden die elkaar al kennen sinds de koranschool. Nu bouwen ze samen verder.",
      whatsappLink: "",
    },
    {
      naam: "Jongeren Dār as-Sakīnah",
      doelCents: 1000000, // Golf — € 10.000
      opgehaaldCents: 0, // € 0
      beschrijving: "De jongste generatie organiseert carwashes en een FIFA-toernooi. Onze toekomst, hun thuis.",
      whatsappLink: "",
    },
    {
      naam: "De Buurvaders van Schollevaar",
      doelCents: 250000, // Druppel — € 2.500
      opgehaaldCents: 0, // € 0
      beschrijving: "Vaders uit de wijk Schollevaar, klaar om samen hun druppel te dragen.",
      whatsappLink: "",
    },
    {
      naam: "Familie El Amrani & co",
      doelCents: 250000, // Druppel — € 2.500
      opgehaaldCents: 0, // € 0
      beschrijving: "Drie generaties, één familie-app, één doel. Opa doet de duʿā', de kleinkinderen de actie.",
      whatsappLink: "",
    },
    {
      naam: "Zusters van de Zondagochtend",
      doelCents: 500000, // Stroom — € 5.000
      opgehaaldCents: 0, // € 0
      beschrijving: "De zusters van de zondagse halaqa bakken, breien en verkopen voor het huis van rust.",
      whatsappLink: "",
    },
    {
      naam: "Koranschool-ouders",
      doelCents: 500000, // Stroom — € 5.000
      opgehaaldCents: 0, // € 0
      beschrijving: "Onze kinderen leren hier hun eerste soera's. Wij zorgen dat dat zo blijft.",
      whatsappLink: "",
    },
    {
      naam: "Team Eerste Golf",
      doelCents: 250000, // Druppel — € 2.500
      opgehaaldCents: 0, // € 0
      beschrijving: "Net opgericht in de groepsapp. Klaar voor de eerste druppels. Doe met ze mee!",
      whatsappLink: "",
    },
  ],

  /* --- ACTIES VAN TEAMS ------------------------------------
     Fotokaarten op de site. Nieuwe actie: zet de foto in
     public/assets/img/acties/ en voeg hieronder een blok toe.
  --------------------------------------------------------- */
  acties: [
    {
      titel: "De grote klusdag",
      beschrijving: "Vrijwilligers legden in één weekend de complete ondervloer van de gebedszaal. Eigen handen, eigen huis.",
      foto: "assets/img/acties/klusweekend.webp",
    },
    {
      titel: "Tapijtdag: de zaal kleurt blauw",
      beschrijving: "Baan voor baan rolden vaders en zonen het nieuwe gebedstapijt uit. Aan het eind van de dag stond er een gebedszaal.",
      foto: "assets/img/acties/tapijtdag.webp",
    },
    {
      titel: "Het eerste gebed",
      beschrijving: "Zacht licht, nieuw tapijt, en de eerste rakaʿāt in onze eigen zaal. Hier doen we het allemaal voor.",
      foto: "assets/img/acties/eerste-gebed.webp",
    },
  ],
};

/* --- AFGELEIDE WAARDEN (niet aanpassen) -------------------
   Deze functies berekenen alles wat de site toont.
----------------------------------------------------------- */

export const DRUPPEL_CENTS = 100000; // € 1.000 per druppel
export const GOLF_CENTS = 2500000; // € 25.000 per golf
export const TOTAAL_DRUPPELS = Math.round(campagne.doelCents / DRUPPEL_CENTS); // 400
export const TOTAAL_GOLVEN = Math.round(campagne.doelCents / GOLF_CENTS); // 16

export const druppelsGevallen = () =>
  Math.min(TOTAAL_DRUPPELS, Math.floor(campagne.opgehaaldCents / DRUPPEL_CENTS));

export const golvenBehaald = () =>
  Math.min(TOTAAL_GOLVEN, Math.floor(campagne.opgehaaldCents / GOLF_CENTS));

export const percentage = () =>
  Math.min(100, (campagne.opgehaaldCents / campagne.doelCents) * 100);
