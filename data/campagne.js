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

  // Alleen voor je eigen administratie: de teller op de site is nu live en
  // toont geen "Stand per …"-datum meer.
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

  // OPTIONEEL: een vaste Stripe Payment Link (https://buy.stripe.com/...) met
  // "klant kiest zelf het bedrag". Vul je deze in, dan wijst de QR-code op de
  // site er rechtstreeks naartoe (scannen = direct in de Stripe-betaalpagina).
  // Leeg laten = de QR opent de doneer-sectie van de site, waar één tik je
  // alsnog meteen naar Stripe brengt.
  stripePaymentLink: "",

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
  // ✏️ TWEETALIG: naam_ar en beschrijving_ar zijn de Arabische teksten die in de
  //    AR-modus getoond worden. Laat je ze leeg (""), dan valt de site terug op
  //    het Nederlands. (Arabisch = Modern Standaard-Arabisch; imam/moedertaal-check.)
  teams: [
    {
      naam: "Ondernemers van de Terp",
      naam_ar: "أصحاب المتاجر في دي تِرب",
      doelCents: 2500000, // Bron — € 25.000
      opgehaaldCents: 0, // € 0
      beschrijving: "Winkeliers en zzp'ers rond winkelcentrum de Terp leggen samen een bron aan.",
      beschrijving_ar: "تجّارٌ وأصحاب أعمالٍ حرّة حول مركز دي تِرب التجاري يجمعون معًا نبعًا.",
      whatsappLink: "",
    },
    {
      naam: "Team Al-Fajr",
      naam_ar: "فريق الفجر",
      doelCents: 1000000, // Golf — € 10.000
      opgehaaldCents: 0, // € 0
      beschrijving: "Acht vrienden die elkaar al kennen sinds de koranschool. Nu bouwen ze samen verder.",
      beschrijving_ar: "ثمانية أصدقاء تعارفوا منذ مدرسة القرآن. والآن يبنون معًا ما هو أبعد.",
      whatsappLink: "",
    },
    {
      naam: "Jongeren Dār as-Sakīnah",
      naam_ar: "شباب دار السكينة",
      doelCents: 1000000, // Golf — € 10.000
      opgehaaldCents: 0, // € 0
      beschrijving: "De jongste generatie organiseert carwashes en een FIFA-toernooi. Onze toekomst, hun thuis.",
      beschrijving_ar: "الجيل الأصغر ينظّم غسيل سيّاراتٍ وبطولة FIFA. مستقبلنا، وبيتهم.",
      whatsappLink: "",
    },
    {
      naam: "De Buurvaders van Schollevaar",
      naam_ar: "آباء حيّ سخولافار",
      doelCents: 250000, // Druppel — € 2.500
      opgehaaldCents: 0, // € 0
      beschrijving: "Vaders uit de wijk Schollevaar, klaar om samen hun druppel te dragen.",
      beschrijving_ar: "آباءٌ من حيّ سخولافار، مستعدّون لحمل قطرتهم معًا.",
      whatsappLink: "",
    },
    {
      naam: "Familie El Amrani & co",
      naam_ar: "عائلة العمراني ومَن معهم",
      doelCents: 250000, // Druppel — € 2.500
      opgehaaldCents: 0, // € 0
      beschrijving: "Drie generaties, één familie-app, één doel. Opa doet de duʿā', de kleinkinderen de actie.",
      beschrijving_ar: "ثلاثة أجيال، مجموعة عائليّة واحدة، وهدفٌ واحد. الجدّ يدعو، والأحفاد ينظّمون.",
      whatsappLink: "",
    },
    {
      naam: "Zusters van de Zondagochtend",
      naam_ar: "أخوات صباح الأحد",
      doelCents: 500000, // Stroom — € 5.000
      opgehaaldCents: 0, // € 0
      beschrijving: "De zusters van de zondagse halaqa bakken, breien en verkopen voor het huis van rust.",
      beschrijving_ar: "أخوات حلقة الأحد يخبِزن ويحُكْن ويبِعن من أجل بيت السكينة.",
      whatsappLink: "",
    },
    {
      naam: "Koranschool-ouders",
      naam_ar: "أولياء أمور مدرسة القرآن",
      doelCents: 500000, // Stroom — € 5.000
      opgehaaldCents: 0, // € 0
      beschrijving: "Onze kinderen leren hier hun eerste soera's. Wij zorgen dat dat zo blijft.",
      beschrijving_ar: "أبناؤنا يتعلّمون هنا أوّل سُوَرهم. ونحن نحرص أن يبقى الأمر كذلك.",
      whatsappLink: "",
    },
    {
      naam: "Team Eerste Golf",
      naam_ar: "فريق الموجة الأولى",
      doelCents: 250000, // Druppel — € 2.500
      opgehaaldCents: 0, // € 0
      beschrijving: "Net opgericht in de groepsapp. Klaar voor de eerste druppels. Doe met ze mee!",
      beschrijving_ar: "تأسّس للتوّ في مجموعة الدردشة. جاهزٌ للقطرات الأولى. شارِكهم!",
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
      titel_ar: "يوم العمل الكبير",
      beschrijving: "Vrijwilligers legden in één weekend de complete ondervloer van de gebedszaal. Eigen handen, eigen huis.",
      beschrijving_ar: "في عطلة أسبوعٍ واحدة فرَش المتطوّعون كامل الأرضية التحتيّة لقاعة الصلاة. أيدينا، وبيتنا.",
      foto: "assets/img/acties/klusweekend.webp",
    },
    {
      titel: "Tapijtdag: de zaal kleurt blauw",
      titel_ar: "يوم السجّاد: القاعة تكتسي بالأزرق",
      beschrijving: "Baan voor baan rolden vaders en zonen het nieuwe gebedstapijt uit. Aan het eind van de dag stond er een gebedszaal.",
      beschrijving_ar: "شُقّةً بعد شُقّة بسَط الآباء والأبناء سجّاد الصلاة الجديد. وفي آخر اليوم صارت هناك قاعة صلاة.",
      foto: "assets/img/acties/tapijtdag.webp",
    },
    {
      titel: "Het eerste gebed",
      titel_ar: "الصلاة الأولى",
      beschrijving: "Zacht licht, nieuw tapijt, en de eerste rakaʿāt in onze eigen zaal. Hier doen we het allemaal voor.",
      beschrijving_ar: "ضوءٌ خافت، وسجّادٌ جديد، وأوّل ركعاتٍ في قاعتنا الخاصّة. من أجل هذا نفعل كل شيء.",
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
