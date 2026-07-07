// Tweetalig: Nederlands (nl) + Arabisch (ar, RTL).
// De Arabische teksten zijn Modern Standaard-Arabisch (فصحى) en dienen vóór
// livegang door een moedertaalspreker/imam te worden nagekeken.
//
// Gebruik in de HTML:
//   data-i18n="sleutel"          -> zet textContent
//   data-i18n-html="sleutel"     -> zet innerHTML (mag opmaak/spans bevatten)
//   data-i18n-attr="attr:sleutel;attr2:sleutel2" -> zet attributen (aria-label, placeholder…)
// In JS: t("sleutel"). Dynamische zinnen: interpolatie in JS met t()-sjablonen.

const T = {
  nl: {
    // --- UI / algemeen ---
    "ui.naarInhoud": "Direct naar inhoud",
    "ui.taalKnop": "AR", // wat de knop toont in NL-modus (schakel naar Arabisch)
    "ui.taalKnopLabel": "Schakel naar het Arabisch",

    // --- Navigatie ---
    "nav.waarom": "Waarom",
    "nav.waterdragers": "Waterdragers",
    "nav.acties": "Acties",
    "nav.vragen": "Vragen",
    "cta.doneer": "Doneer jouw druppel",
    "cta.doneerKort": "Doneer",
    "cta.doneerExtra": " jouw druppel",

    // --- Hero ---
    "hero.kicker": "Druppels van Sakīnah",
    "hero.descriptor": "Onze moskee in Capelle aan den IJssel",
    "hero.titel": "Samen vullen we<br />het huis van rust",
    "hero.lead":
      'Wij, vaders, moeders, kinderen en grootouders van Dār as-Sakīnah in Capelle aan den IJssel, kopen ons eigen gebedshuis. Niet alleen met grote gevers, maar juist ook met honderden kleine druppels. <strong>Jij doet al mee vanaf €&nbsp;10.</strong>',
    "teller.van": "van",
    "teller.aftellen": "De koopovereenkomst is getekend.",
    "teller.live": "Live stand ·",
    "teller.liveLink": "elke online gift telt direct mee",
    "hero.cta.doneer": "Doneer een druppel",
    "hero.cta.waterdrager": "Word Waterdrager",
    "hero.subline": "Eén druppel, eindeloze kringen.",
    "hero.scroll": "Scroll naar beneden",

    // --- Zo werkt een druppel ---
    "uitleg.kicker": "In het kort",
    "uitleg.titel": "Zo werkt een druppel",
    "uitleg.stap1": "<strong>Eén druppel is €&nbsp;1.000.</strong> Jij doet al mee vanaf €&nbsp;10.",
    "uitleg.stap2": "<strong>400 druppels</strong> vullen samen de koepel.",
    "uitleg.stap3": "<strong>Is de koepel vol, dan is het huis van ons.</strong> Voorgoed.",
    "uitleg.gloss":
      "En <strong>Waterdragers</strong>? Dat zijn teams van vrienden, familie of buren die samen één druppel of meer ophalen.",
    "uitleg.tegaan": 'Nog <strong data-druppels-tegaan>…</strong> druppels te gaan tot het huis van ons is.',

    // --- Koepel ---
    "koepel.kicker": "De stand van het water",
    "koepel.titel": "Druppel voor druppel<br />vult de koepel zich",
    "koepel.intro":
      "Elke €&nbsp;1.000 is één druppel. Elke €&nbsp;25.000 vormt samen een golf. Zestien golven, en het huis is voorgoed van ons allemaal.",
    "koepel.captionPre": "Het water staat op",
    "koepel.landing":
      "En als de koepel vol is? Dan is dit geen campagne meer, maar gewoon ons adres: het vrijdaggebed dat elke week groeit en steeds meer mensen trekt, de koranschool waar kinderen hun eerste soera's leren, de halaqa van de zusters, de jongeren met hun toernooien, allemaal onder een dak dat voorgoed van ons allemaal is.",

    // --- Doneren ---
    "doneren.kicker": "Doneren",
    "doneren.titel": "Doneer jouw druppel",
    "doneren.intro":
      "Kies een bedrag en je gaat direct naar de beveiligde betaalpagina: iDEAL, creditcard of Apple Pay. Eén tik.",
    "doneren.chip1000": "€&nbsp;1.000 · een hele druppel",
    "doneren.anderLabel": "Of een ander bedrag",
    "doneren.anderPlaceholder": "bijv. 75",
    "doneren.anderKnop": "Doneer",
    "doneren.veilig": "Veilig betalen via Stripe — wij zien je kaartgegevens nooit.",
    "doneren.qr": "Kijk je op de computer? <strong>Scan met je telefoon</strong> en rond je gift onderweg af.",
    "doneren.grootPre": "Een grotere gift in gedachten?",
    "doneren.grootMail": "Mail",
    "doneren.grootPost": "ons gerust persoonlijk. Dat regelen we discreet.",
    "doneren.kaartTitel": "Liever zelf overmaken?",
    "doneren.kaartUitleg":
      'Maak over op onderstaand rekeningnummer en zet bij de omschrijving <strong>„Druppel"</strong>. Doe je mee met een team? Zet er dan je teamnaam bij. Dat mag, maar het hoeft niet.',
    "doneren.namens":
      "Je kunt jouw druppel ook geven namens iemand anders: je ouders, je kind, of iemand die er niet meer is. Sadaqah jāriyah telt ook voor hen door.",
    "doneren.ibanLabel": "IBAN",
    "doneren.tnvPre": "t.n.v.",
    "doneren.kopieerIban": "Kopieer IBAN",
    "doneren.gekopieerd": "Gekopieerd ✓",
    "dua.titel": "Liever (ook) een duʿā'-verzoek?",
    "dua.tekst":
      "Wil je dat er voor jou of een naaste duʿā' wordt gedaan? Stuur je verzoek mee. Het komt vertrouwelijk bij de imam terecht en wordt nooit gedeeld.",
    "dua.knop": "Stuur een vertrouwelijk duʿā'-verzoek",

    // --- Sticky / bedankt ---
    "sticky.doneer": "Doneer een druppel",
    "bedankt.tekst": "Bārak Allāhoe fīk — je druppel is binnen. Moge Allah het van je aannemen.",
    "doneren.foutMelding":
      "Online doneren lukt op dit moment even niet. Je kunt je druppel ook overmaken via de IBAN hieronder - alvast bedankt.",
    "doneren.bezig": "Je wordt doorgestuurd naar de beveiligde betaalpagina…",
    "doneren.bedragFout": "Vul een bedrag van minimaal € 1 in.",

    // --- Footer ---
    "footer.claim": "Elke druppel telt.<br />Samen vullen we het huis van rust.",
    "footer.stichting": "Stichting",
    "footer.doneren": "Doneren",
    "footer.contact": "Contact",
    "footer.ovv": 'o.v.v. „Druppel" + je teamnaam',
    "footer.email": "E-mail de stichting",
    "footer.whatsapp": "WhatsApp-community",
    "footer.privacy": "Privacy",
    "footer.volgOns": "Volg ons",
    "footer.noot": "Geen cookies, geen advertenties, alleen druppels. ·",

    // --- Waarom ---
    "waarom.kicker": "Waarom dit, waarom nu",
    "waarom.titel": "Een thuis dat we al jaren dragen.<br />Nu kunnen we het kopen",
    "waarom.beat1.titel": "Samen opgebouwd",
    "waarom.beat1.nr": "1",
    "waarom.beat1.tekst":
      "Met eigen handen maakten we van dit gebouw een thuis. Vrijwilligers sloopten, schilderden en legden vloeren. Vaders en zonen rolden baan voor baan het gebedstapijt uit. En elke vrijdag is de zaal voller dan de week ervoor: het vrijdaggebed groeit gestaag en trekt steeds meer mensen.",
    "waarom.beat1.cap": "Eén klusdag in maart: van kale vloer tot gebedszaal, door de gemeenschap zelf.",
    "waarom.beat1.alt1": "De lege zaal met de eerste tapijtbanen klaar om uit te rollen",
    "waarom.beat1.alt2": "Een vrijwilliger rolt een baan gebedstapijt uit in de zaal",
    "waarom.beat1.alt3": "De gebedszaal met het volledig gelegde blauw-met-terracotta tapijt",
    "waarom.beat2.titel": "De kans van een generatie",
    "waarom.beat2.nr": "2",
    "waarom.beat2.tekst":
      'Nu kunnen we het pand aan de Borndiep 2B <em>kopen</em>. De koopovereenkomst is op 21 mei 2026 getekend. <span data-overdracht-zin>Het aftellen is begonnen</span>. Wat rest is de koopsom: die brengen we nu samen bijeen, druppel voor druppel, zodat het geld er bij de overdracht klaarstaat. Vanaf die dag is het huis van ons. Voorgoed, voor onze kinderen en voor de generaties daarna. Een huis van rust dat niemand ons meer kan afnemen.',
    "waarom.beat2.pandcap": "<strong>Borndiep 2B</strong> · Capelle aan den IJssel · het huis van rust, aan het water.",
    "waarom.beat2.altwater": "Het pand aan de Borndiep 2B weerspiegeld in het water, terwijl de regen druppelringen op het oppervlak maakt",
    "waarom.beat2.altlente": "Het pand in het voorjaar, met bloeiende tulpen op het terras aan het water",
    "waarom.beat2.altdaken": "De karakteristieke terracotta daken van het pand, van bovenaf gezien",
    "waarom.beat3.titel": "Transparantie staat voorop",
    "waarom.beat3.nr": "3",
    "waarom.beat3.tekst":
      "We halen €&nbsp;400.000 op. Dat dekt de volledige aankoop, niet meer en niet minder. Elke euro gaat naar het pand: niets naar salarissen, niets naar lopende kosten.",
    "waarom.beat3.alt": "De vernieuwde gebedszaal met blauw tapijt in warm licht",
    "waarom.opbouw.koopsom": "Koopsom Borndiep 2B",
    "waarom.opbouw.overdracht": "Overdrachtsbelasting",
    "waarom.opbouw.notaris": "Notaris &amp; kadaster",
    "waarom.opbouw.samen": "Samen",
    "waarom.voetnoot": "Na afloop publiceren we een volledige financiële verantwoording.",

    // --- Hoe het werkt ---
    "hoe.kicker": "Hoe het werkt",
    "hoe.titel": "Van groepsapp tot golf,<br />in vier stappen",
    "hoe.stap1.titel": "Vorm je team",
    "hoe.stap1.tekst": "Vrienden, familie, je straat, je werk: vanaf twee mensen ben je een team van Waterdragers.",
    "hoe.stap2.titel": "Kies jullie doel",
    "hoe.stap2.tekst": "Druppel (€&nbsp;2.500), Stroom (€&nbsp;5.000), Golf (€&nbsp;10.000) of Bron (€&nbsp;25.000). Kies wat past. Bijstellen mag altijd.",
    "hoe.stap3.titel": "Doneer met je teamnaam",
    "hoe.stap3.tekst": "Wie meedoet, kan de teamnaam bij de overschrijving zetten. Zo komen jullie druppels samen op deze pagina. Het mag, het hoeft niet.",
    "hoe.stap4.titel": "Doneer, volg en vier",
    "hoe.stap4.tekst": "Zie jullie balk stijgen, vier elke mijlpaal in de groepsapp en zie jullie druppels samen de koepel vullen.",
    "hoe.geenTeam": "<strong>Geen team?</strong> Doneer gewoon jouw druppel. Meedoen kan al vanaf €&nbsp;10.",
    "hoe.geenTeamKnop": "Doneer direct",

    // --- Waterdragers / teams ---
    "teams.kicker": "De teams",
    "teams.titel": "Waterdragers",
    "teams.intro": "Teams die zelfstandig een bedrag bij elkaar brengen, ieder met een eigen doel, allemaal voor hetzelfde huis.",
    "teams.legendaLabel": "De vier teamdoelen",
    "teams.startTitel": "Start jouw team",
    "teams.startTekst": "Stuur ons een appje met je teamnaam en jullie doel. Wij zetten je team binnen een dag op deze pagina. Aanmelden gaat gewoon via WhatsApp, zonder formulieren.",
    "teams.startKnop": "Start jouw team via WhatsApp",
    "niveau.druppel": "Druppel",
    "niveau.stroom": "Stroom",
    "niveau.golf": "Golf",
    "niveau.bron": "Bron",

    // --- Betekenis ---
    "betekenis.kicker": "De betekenis",
    "betekenis.titel": "De rust die neerdaalt",
    "betekenis.tekst":
      "<em>Sakīnah</em> is de rust die Allah laat neerdalen in de harten van de gelovigen, een kalmte die je niet kunt kopen of afdwingen, alleen ontvangen. Ons gebedshuis draagt die belofte in zijn naam: Dār as-Sakīnah, het huis van rust.",
    "betekenis.cap": "De rust van dit huis, voor wie na ons komt.",
    "betekenis.alt": "Rijen gebedstapijt in blauw en zand vullen de lichte, ruime gebedszaal",
    "betekenis.citaat1": "„Hij is het Die de sakīnah deed neerdalen in de harten van de gelovigen, zodat zij geloof toevoegen aan hun geloof.\"",
    "betekenis.citaat1.bron": "Koran, Soera Al-Fath 48:4",
    "betekenis.citaat2": "„Er komt geen volk samen in één van de huizen van Allah, het Boek van Allah reciterend en het samen bestuderend, of de sakīnah daalt op hen neer, de barmhartigheid omhult hen en de engelen omringen hen.\"",
    "betekenis.citaat2.bron": "Overgeleverd in Sahih Muslim 2699",
    "betekenis.oermodel.titel": "De put van ʿUthmān",
    "betekenis.oermodel.tekst":
      "Toen de moslims in Medina dorst leden, kocht ʿUthmān ibn ʿAffān de put van Rūma en schonk hem aan de gemeenschap. Veertien eeuwen later bestaat zijn waqf nog steeds. Uit die ene gift groeiden palmgaarden, en tot op de dag van vandaag loopt zijn beloning door. Eén keer geven, eindeloos doortellen: dat is <em>sadaqah jāriyah</em>.",
    "betekenis.slot": "Eén druppel, eindeloze kringen: bij elk gebed dat hier wordt verricht, ontvang jij beloning.",

    // --- Voor wie ---
    "voorwie.kicker": "Jouw druppel",
    "voorwie.titel": "Voor wie geef jij jouw druppel?",
    "voorwie.regel1": "<strong>Voor je ouders</strong>, dat hun gebed hier een vaste plek houdt.",
    "voorwie.regel2": "<strong>Voor je kinderen</strong>, dat ze hun eerste soera leren in een zaal die van ons is.",
    "voorwie.regel3": "<strong>Voor wie hier straks zelf vader of moeder is</strong>, en een kind aan de hand mee naar binnen neemt.",
    "voorwie.regel4": "<strong>Voor jezelf</strong>, voor elke keer dat je hier op adem komt.",
    "voorwie.cap": "Het vrijdaggebed aan de Borndiep, elke week voller.",
    "voorwie.alt": "Rijen biddende mannen op het blauwe gebedstapijt, van achteren gezien",
    "voorwie.slot": "Denk aan één naam. Geef voor diegene jouw druppel.",

    // --- Deel de druppel ---
    "deel.kicker": "Deel de druppel",
    "deel.titel": "Eén bericht kan een golf in beweging zetten",
    "deel.tekst": "De meeste druppels beginnen met een berichtje in een groepsapp. Deel de campagne, of zet de druppelvideo op je WhatsApp-status.",
    "deel.knop": "Deel via WhatsApp",
    "deel.download916": "Download statusvideo (9:16)",
    "deel.download11": "Download vierkante video (1:1)",

    // --- Acties ---
    "acties.kicker": "Uit de gemeenschap",
    "acties.titel": "Tot nu…",
    "acties.oproep.pre": "Organiseer je eigen actie, zoals een bakactie, sponsorloop, carwash of charity-iftar, en",
    "acties.oproep.link": "stuur je foto's via WhatsApp",
    "acties.oproep.post": ". De mooiste acties krijgen een plek op deze pagina.",

    // --- Sponsors ---
    "sponsors.kicker": "Voor bedrijven",
    "sponsors.titel": "Onderneem mee",
    "sponsors.tekst": "Ook als bedrijf kun je Waterdrager zijn: vorm een bedrijfsteam met je collega's of draag bij in natura: materiaal, vakwerk of diensten voor het pand. We denken graag mee over wat bij jouw zaak past.",
    "sponsors.knopApp": "App met ons",
    "sponsors.knopMail": "Mail de stichting",

    // --- FAQ ---
    "faq.kicker": "Veelgestelde vragen",
    "faq.titel": "Eerlijke antwoorden",
    "faq.q1": "Waar is het geld precies voor?",
    "faq.a1": "Uitsluitend voor de aankoop van het pand aan de Borndiep 2B in Capelle aan den IJssel: de koopsom plus de bijbehorende overdrachtskosten. Er gaat niets naar salarissen of lopende kosten.",
    "faq.q2": "Hoe is de € 400.000 opgebouwd?",
    "faq.a2": "Koopsom €&nbsp;358.422, overdrachtsbelasting circa €&nbsp;37.276 en notaris- en kadasterkosten circa €&nbsp;4.302. Samen €&nbsp;400.000. Na afloop publiceren we een volledige financiële verantwoording.",
    "faq.q3": "Waarom nu doneren en niet later?",
    "faq.a3": 'Omdat het aftellen al loopt: de koopovereenkomst is op 21 mei 2026 getekend en bij de overdracht moet de volledige koopsom klaarstaan. <span data-overdracht-zin>De definitieve overdrachtsdatum lees je hier als eerste</span>. Hoe eerder jouw druppel binnen is, hoe rustiger de gemeenschap naar die dag toe leeft, zonder eindsprint.',
    "faq.q4": "Zijn donaties anoniem?",
    "faq.a4": "Ja. Wij publiceren nooit wie wat gaf: geen namen, geen bedragen. Op de site zie je alleen totalen en teamtotalen. In stilte geven is islamitisch gezien zelfs aanbevolen.",
    "faq.q5": "Kan ik zonder team doneren?",
    "faq.a5": "Zeker, de meeste druppels komen van losse gevers. Maak gewoon over met de omschrijving „Druppel\". Een team is leuk, geen voorwaarde.",
    "faq.q6": "Kan ik gespreid doneren?",
    "faq.a6": "Ja. Je kunt zelf een periodieke overschrijving instellen in je bankapp, bijvoorbeeld €&nbsp;25 per maand. Zet er „Druppel\" bij, dan telt elke termijn gewoon mee.",
    "faq.q7": "Wat gebeurt er als het doel later of eerder wordt gehaald?",
    "faq.a7": "Elke euro is en blijft geoormerkt voor de aankoop van het pand. Gaat het sneller dan gepland: prachtig, dan ronden we eerder af. Duurt het langer: dan blijft je bijdrage veilig staan voor precies dit doel. Na afloop leggen we openbaar verantwoording af.",
    "faq.q8": "Hoe lang loopt de campagne?",
    "faq.a8": 'Tot de koepel vol is, en de tijd dringt: de koopovereenkomst is al getekend, dus bij de overdracht bij de notaris moet de volledige koopsom klaarstaan. <span data-overdracht-zin>Zodra er een definitieve overdrachtsdatum is, lees je dat hier als eerste</span>. Elke week telt, want hoe meer druppels er nú binnenkomen, hoe dichter die dag bij is. Online donaties tellen direct mee op de teller; giften die buiten de site binnenkomen tellen we er periodiek bij op. Elke vrijdag delen we bovendien een update via WhatsApp en in de moskee.',
    "faq.q9": "Hoe dien ik een duʿā'-verzoek in?",
    "faq.a9": "Via de knop in de doneer-sectie stuur je je verzoek per e-mail. Het komt vertrouwelijk bij de imam terecht en wordt met niemand anders gedeeld. Een verzoek insturen kan ook zonder donatie.",
    "faq.q10": "Ik heb een andere vraag. Waar kan ik terecht?",
    "faq.a10.pre": "App ons gerust via de knoppen op deze pagina, of mail naar",
    "faq.a10.link": "de stichting",
    "faq.a10.post": ". We antwoorden meestal binnen een dag.",

    // --- Privacy (aparte pagina) ---
    "privacy.docTitle": "Privacy · Druppels van Sakīnah",
    "privacy.kicker": "Privacy",
    "privacy.h1": "Kort en eerlijk",
    "privacy.p1": "Deze website is gebouwd om je te informeren en niets meer. We volgen je niet en verzamelen geen persoonsgegevens over je.",
    "privacy.h2a": "Privacyvriendelijk, zonder cookies",
    "privacy.p2": "Deze site plaatst geen cookies en toont geen advertenties. Om te zien hoevéél mensen de campagne bezoeken, gebruiken we alleen cookieloze, privacyvriendelijke bezoekersstatistieken (Vercel Web Analytics): die tellen paginaweergaven zonder je te volgen tussen websites, zonder persoonsgegevens op te slaan en zonder een profiel van je te maken. Lettertypen, beelden en video's laden vanaf onze eigen server; we laden niets van advertentie- of socialmediabedrijven.",
    "privacy.h2b": "Wat we wél (even) verwerken",
    "privacy.li1": "<strong>Als je ons appt of mailt:</strong> dan zien we natuurlijk je nummer of e-mailadres en je bericht. Dat gebruiken we alleen om je te antwoorden en bewaren we niet langer dan nodig.",
    "privacy.li2": "<strong>Als je doneert per bankoverschrijving:</strong> dan staat je naam op ons bankafschrift, zoals bij elke overboeking. We publiceren nooit wie wat gaf en delen donateursgegevens met niemand.",
    "privacy.li3": "<strong>Duʿā'-verzoeken:</strong> komen vertrouwelijk bij de imam terecht en worden met niemand anders gedeeld.",
    "privacy.h2c": "Hosting",
    "privacy.p3": "De server die deze pagina's aflevert, verwerkt, zoals elke webserver, tijdelijk technische gegevens zoals je IP-adres om de pagina te kunnen tonen. Wij gebruiken die gegevens niet en bouwen er geen profielen mee.",
    "privacy.h2d": "Vragen?",
    "privacy.vragenPre": "Mail ons via",
    "privacy.vragenPost": ". We antwoorden meestal binnen een dag.",
    "privacy.terug": "← Terug naar de campagne",

    // --- Dynamische zinnen (JS) ---
    "js.druppelsZin": "{druppels} van de {totaal} druppels gevuld",
    "js.golfInZicht": "de eerste golf (€ 25.000) is in zicht",
    "js.golf1Binnen": "golf 1 is binnen, op weg naar golf 2",
    "js.golvenBinnen": "{golven} van de {totaal} golven zijn binnen",
    "js.aftellenBegonnen": "Het aftellen is begonnen",
    "js.nogWeken": "nog {n} weken tot de overdracht",
    "js.nogDagen": "nog {n} dagen tot de overdracht",
    "js.nog1Dag": "nog 1 dag tot de overdracht",
    "js.vandaagOverdracht": "vandaag is de overdracht",
    "js.team.doelBehaald": "Doel behaald ✓",
    "js.team.ariaVoortgang": "Voortgang {naam}: {op} van {doel}",
    "js.team.ariaLegenda": "Voortgang {naam}: {op} van {doel}",
    "js.deelTekst":
      "Salaam! 💧 Wij kopen samen ons gebedshuis in Capelle, druppel voor druppel. Meedoen kan al vanaf € 10. Kijk en doe mee: {url}",
  },

  ar: {
    // --- UI / algemeen ---
    "ui.naarInhoud": "انتقل مباشرة إلى المحتوى",
    "ui.taalKnop": "NL", // في الوضع العربي: زر التبديل إلى الهولندية
    "ui.taalKnopLabel": "التبديل إلى الهولندية",

    // --- Navigatie ---
    "nav.waarom": "لماذا",
    "nav.waterdragers": "حاملو الماء",
    "nav.acties": "الأنشطة",
    "nav.vragen": "الأسئلة",
    "cta.doneer": "تبرّع بقطرتك",
    "cta.doneerKort": "تبرّع",
    "cta.doneerExtra": " بقطرتك",

    // --- Hero ---
    "hero.kicker": "قطرات السكينة",
    "hero.descriptor": "مسجدنا في كابيله آن دن آيسل",
    "hero.titel": "معًا نملأ<br />بيت السكينة",
    "hero.lead":
      'نحن، آباءُ وأمهاتُ وأبناءُ وأجدادُ «دار السكينة» في كابيله آن دن آيسل، نشتري بيت عبادتنا الخاص. ليس بالمتبرعين الكبار وحدهم، بل قبل كل شيء بمئات القطرات الصغيرة. <strong>تُشارك بدءًا من €&nbsp;10.</strong>',
    "teller.van": "من",
    "teller.aftellen": "لقد وُقِّع عقد الشراء.",
    "teller.live": "الحصيلة مباشرةً ·",
    "teller.liveLink": "كل تبرّع عبر الإنترنت يُحتسب فورًا",
    "hero.cta.doneer": "تبرّع بقطرة",
    "hero.cta.waterdrager": "كن حامل ماء",
    "hero.subline": "قطرةٌ واحدة، دوائرُ لا تنتهي.",
    "hero.scroll": "انزل للأسفل",

    // --- Zo werkt een druppel ---
    "uitleg.kicker": "باختصار",
    "uitleg.titel": "هكذا تعمل القطرة",
    "uitleg.stap1": "<strong>القطرة الواحدة هي €&nbsp;1.000.</strong> وتُشارك بدءًا من €&nbsp;10.",
    "uitleg.stap2": "<strong>٤٠٠ قطرة</strong> تملأ القبة معًا.",
    "uitleg.stap3": "<strong>وحين تمتلئ القبة، يصبح البيت لنا.</strong> إلى الأبد.",
    "uitleg.gloss":
      "و«حاملو الماء»؟ هم فرقٌ من الأصدقاء أو الأهل أو الجيران يجمعون معًا قطرةً واحدة أو أكثر.",
    "uitleg.tegaan": 'بقيت <strong data-druppels-tegaan>…</strong> قطرة حتى يصبح البيت لنا.',

    // --- Koepel ---
    "koepel.kicker": "منسوب الماء",
    "koepel.titel": "قطرةً بعد قطرة<br />تمتلئ القبة",
    "koepel.intro":
      "كل €&nbsp;1.000 قطرةٌ واحدة. وكل €&nbsp;25.000 تُشكّل معًا موجة. ستّ عشرة موجة، ويصبح البيت لنا جميعًا إلى الأبد.",
    "koepel.captionPre": "بلغ منسوب الماء",
    "koepel.landing":
      "وحين تمتلئ القبة؟ لن تكون حملةً بعد ذلك، بل ببساطة عنواننا: صلاة الجمعة التي تكبر كل أسبوع وتجذب المزيد من الناس، ومدرسة القرآن حيث يتعلّم الأطفال أوّل سُوَرهم، وحلقة الأخوات، والشباب ببطولاتهم، جميعهم تحت سقفٍ صار لنا جميعًا إلى الأبد.",

    // --- Doneren ---
    "doneren.kicker": "التبرّع",
    "doneren.titel": "تبرّع بقطرتك",
    "doneren.intro":
      "اختر مبلغًا وتنتقل مباشرةً إلى صفحة الدفع الآمنة: iDEAL أو بطاقة ائتمان أو Apple Pay. بنقرة واحدة.",
    "doneren.chip1000": "€&nbsp;1.000 · قطرةٌ كاملة",
    "doneren.anderLabel": "أو مبلغ آخر",
    "doneren.anderPlaceholder": "مثلًا 75",
    "doneren.anderKnop": "تبرّع",
    "doneren.veilig": "دفعٌ آمن عبر Stripe — لا نرى بيانات بطاقتك أبدًا.",
    "doneren.qr": "أتتصفّح على الحاسوب؟ <strong>امسح الرمز بهاتفك</strong> وأتمّ تبرّعك وأنت في الطريق.",
    "doneren.grootPre": "أتفكّر في تبرّعٍ أكبر؟",
    "doneren.grootMail": "راسِلنا",
    "doneren.grootPost": "على البريد بكل ارتياح. نتولّى الأمر بسرّية.",
    "doneren.kaartTitel": "تفضّل التحويل بنفسك؟",
    "doneren.kaartUitleg":
      'حوِّل إلى رقم الحساب أدناه واكتب في خانة البيان <strong>«Druppel»</strong>. أتُشارك ضمن فريق؟ فأضِف اسم فريقك. جائزٌ، لكنه غير إلزامي.',
    "doneren.namens":
      "يمكنك أيضًا أن تتبرّع بقطرتك باسم شخصٍ آخر: والديك، أو ولدك، أو من فارق الحياة. صدقةٌ جاريةٌ تجري لهم أيضًا.",
    "doneren.ibanLabel": "IBAN",
    "doneren.tnvPre": "باسم",
    "doneren.kopieerIban": "انسخ الـ IBAN",
    "doneren.gekopieerd": "تم النسخ ✓",
    "dua.titel": "أتحبّ (أيضًا) طلب دعاء؟",
    "dua.tekst":
      "أتودّ أن يُدعى لك أو لعزيزٍ عليك؟ أرسِل طلبك معنا. يصل بسرّيةٍ إلى الإمام ولا يُشارَك أبدًا.",
    "dua.knop": "أرسِل طلب دعاءٍ سرّيًّا",

    // --- Sticky / bedankt ---
    "sticky.doneer": "تبرّع بقطرة",
    "bedankt.tekst": "بارك الله فيك — وصلت قطرتك. تقبّل الله منك.",
    "doneren.foutMelding":
      "تعذّر التبرّع عبر الإنترنت في هذه اللحظة. يمكنك أيضًا تحويل قطرتك عبر الـ IBAN أدناه — شكرًا لك سلفًا.",
    "doneren.bezig": "يجري تحويلك إلى صفحة الدفع الآمنة…",
    "doneren.bedragFout": "أدخِل مبلغًا لا يقلّ عن €&nbsp;1.",

    // --- Footer ---
    "footer.claim": "كل قطرةٍ تُحتسب.<br />معًا نملأ بيت السكينة.",
    "footer.stichting": "المؤسسة",
    "footer.doneren": "التبرّع",
    "footer.contact": "التواصل",
    "footer.ovv": 'مع ذكر «Druppel» + اسم فريقك',
    "footer.email": "راسِل المؤسسة",
    "footer.whatsapp": "مجتمع واتساب",
    "footer.privacy": "الخصوصية",
    "footer.volgOns": "تابِعنا",
    "footer.noot": "لا ملفات تعريف، لا إعلانات، قطراتٌ فقط. ·",

    // --- Waarom ---
    "waarom.kicker": "لماذا الآن، ولماذا هذا",
    "waarom.titel": "بيتٌ نحمله منذ سنين.<br />والآن نستطيع أن نمتلكه",
    "waarom.beat1.titel": "بنيناه معًا",
    "waarom.beat1.nr": "١",
    "waarom.beat1.tekst":
      "بأيدينا حوّلنا هذا المبنى إلى بيت. هدَم المتطوّعون وطلَوا وفرَشوا الأرضيات. وبسَط الآباء والأبناء سجّاد الصلاة شُقّةً بعد شُقّة. وفي كل جمعة تكون القاعة أكثر امتلاءً من التي سبقتها: فصلاة الجمعة تنمو باطّراد وتجذب المزيد من الناس.",
    "waarom.beat1.cap": "يومُ عملٍ واحد في مارس: من أرضٍ عارية إلى قاعة صلاة، بأيدي الجماعة نفسها.",
    "waarom.beat1.alt1": "القاعة الفارغة وأولى شُقق السجّاد جاهزة للبسط",
    "waarom.beat1.alt2": "متطوّع يبسط شُقّة من سجّاد الصلاة في القاعة",
    "waarom.beat1.alt3": "قاعة الصلاة وقد اكتمل فرشها بالسجّاد الأزرق والطّوبي",
    "waarom.beat2.titel": "فرصة جيلٍ بأكمله",
    "waarom.beat2.nr": "٢",
    "waarom.beat2.tekst":
      'الآن نستطيع أن <em>نشتري</em> العقار في Borndiep 2B. وُقِّع عقد الشراء في ٢١ مايو ٢٠٢٦. <span data-overdracht-zin>بدأ العدّ التنازلي</span>. وما بقي هو ثمن الشراء: نجمعه الآن معًا، قطرةً بعد قطرة، ليكون المبلغ جاهزًا عند نقل الملكية. ومن ذلك اليوم يصبح البيت لنا. إلى الأبد، لأبنائنا وللأجيال من بعدهم. بيتُ سكينةٍ لا يستطيع أحدٌ أن ينتزعه منّا بعد اليوم.',
    "waarom.beat2.pandcap": "<strong>Borndiep 2B</strong> · كابيله آن دن آيسل · بيت السكينة، على ضفّة الماء.",
    "waarom.beat2.altwater": "العقار في Borndiep 2B منعكسًا في الماء، والمطر يرسم حلقاتٍ من القطرات على سطحه",
    "waarom.beat2.altlente": "العقار في الربيع، وأزهار التوليب متفتّحة على الشُّرفة المطلّة على الماء",
    "waarom.beat2.altdaken": "أسطح العقار الطّوبيّة المميّزة، مرئيّةً من الأعلى",
    "waarom.beat3.titel": "الشفافية أوّلًا",
    "waarom.beat3.nr": "٣",
    "waarom.beat3.tekst":
      "نجمع €&nbsp;400.000. يغطّي هذا المبلغ كامل الشراء، لا أكثر ولا أقل. كل يورو يذهب إلى العقار: لا شيء للرواتب، ولا شيء للمصاريف الجارية.",
    "waarom.beat3.alt": "قاعة الصلاة المجدَّدة بسجّادها الأزرق في ضوءٍ دافئ",
    "waarom.opbouw.koopsom": "ثمن شراء Borndiep 2B",
    "waarom.opbouw.overdracht": "ضريبة نقل الملكية",
    "waarom.opbouw.notaris": "الموثّق والسجلّ العقاري",
    "waarom.opbouw.samen": "المجموع",
    "waarom.voetnoot": "بعد انتهاء الحملة ننشر كشفًا ماليًّا كاملًا.",

    // --- Hoe het werkt ---
    "hoe.kicker": "كيف تسير الأمور",
    "hoe.titel": "من مجموعة الدردشة إلى موجة،<br />في أربع خطوات",
    "hoe.stap1.titel": "كوِّن فريقك",
    "hoe.stap1.tekst": "أصدقاء، أهل، سكّان شارعك، زملاء عملك: من شخصَين فصاعدًا تصيرون فريقًا من «حاملي الماء».",
    "hoe.stap2.titel": "اختاروا هدفكم",
    "hoe.stap2.tekst": "قطرة (€&nbsp;2.500)، أو جدول (€&nbsp;5.000)، أو موجة (€&nbsp;10.000)، أو نبع (€&nbsp;25.000). اختاروا ما يناسبكم. والتعديل جائزٌ دائمًا.",
    "hoe.stap3.titel": "تبرّعوا باسم فريقكم",
    "hoe.stap3.tekst": "من يشارك يمكنه أن يذكر اسم الفريق عند التحويل، فتجتمع قطراتكم معًا على هذه الصفحة. جائزٌ، وغير إلزامي.",
    "hoe.stap4.titel": "تبرّعوا، وتابِعوا، واحتفلوا",
    "hoe.stap4.tekst": "شاهدوا شريطكم يرتفع، واحتفلوا بكل مرحلةٍ في مجموعة الدردشة، وشاهدوا قطراتكم تملأ القبة معًا.",
    "hoe.geenTeam": "<strong>لا فريق لديك؟</strong> تبرّع بقطرتك ببساطة. المشاركة تبدأ من €&nbsp;10.",
    "hoe.geenTeamKnop": "تبرّع مباشرةً",

    // --- Waterdragers / teams ---
    "teams.kicker": "الفِرَق",
    "teams.titel": "حاملو الماء",
    "teams.intro": "فِرَقٌ تجمع مبلغًا بنفسها، لكلٍّ منها هدفه الخاص، وكلّها من أجل البيت ذاته.",
    "teams.legendaLabel": "أهداف الفِرَق الأربعة",
    "teams.startTitel": "ابدأ فريقك",
    "teams.startTekst": "أرسِل لنا رسالةً باسم فريقك وهدفكم، ونُدرج فريقك على هذه الصفحة خلال يوم. التسجيل يتمّ عبر واتساب ببساطة، دون استمارات.",
    "teams.startKnop": "ابدأ فريقك عبر واتساب",
    "niveau.druppel": "قطرة",
    "niveau.stroom": "جدول",
    "niveau.golf": "موجة",
    "niveau.bron": "نبع",

    // --- Betekenis ---
    "betekenis.kicker": "المعنى",
    "betekenis.titel": "السكينة التي تنزل",
    "betekenis.tekst":
      "<em>السكينة</em> هي الطمأنينة التي يُنزِلها الله في قلوب المؤمنين، سكونٌ لا يُشترى ولا يُنتزَع، بل يُوهَب وهبًا. وبيت عبادتنا يحمل هذا الوعد في اسمه: دار السكينة، بيت الطمأنينة.",
    "betekenis.cap": "سكينة هذا البيت، لمن يأتي بعدنا.",
    "betekenis.alt": "صفوف من سجاد الصلاة بالألوان الأزرق والرملي تملأ قاعة الصلاة الفسيحة والمضيئة",
    "betekenis.citaat1": "﴿هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَّعَ إِيمَانِهِمْ﴾",
    "betekenis.citaat1.bron": "القرآن الكريم، سورة الفتح ٤٨:٤",
    "betekenis.citaat2": "«ما اجتمع قومٌ في بيتٍ من بيوت الله يتلون كتاب الله ويتدارسونه بينهم إلّا نزلت عليهم السكينة، وغشِيتهم الرحمة، وحفّتهم الملائكة، وذكرهم الله فيمن عنده.»",
    "betekenis.citaat2.bron": "رواه مسلم ٢٦٩٩",
    "betekenis.oermodel.titel": "بئر عثمان",
    "betekenis.oermodel.tekst":
      "لمّا عطِش المسلمون في المدينة، اشترى عثمان بن عفّان بئر رُومة ووقفها على الجماعة. وبعد أربعة عشر قرنًا لا يزال وقفه قائمًا. من تلك العطيّة الواحدة نبتت بساتين النخيل، وإلى يومنا هذا يجري أجره. عطاءٌ مرّةً واحدة، وثوابٌ لا ينقطع: تلك هي <em>الصدقة الجارية</em>.",
    "betekenis.slot": "قطرةٌ واحدة، ودوائرُ لا تنتهي: مع كل صلاةٍ تُقام هنا، ينالك أجرها.",

    // --- Voor wie ---
    "voorwie.kicker": "قطرتك",
    "voorwie.titel": "لِمن تُهدي قطرتك؟",
    "voorwie.regel1": "<strong>لوالديك</strong>، ليبقى لصلاتهما هنا مكانٌ ثابت.",
    "voorwie.regel2": "<strong>لأبنائك</strong>، ليتعلّموا أوّل سُوَرهم في قاعةٍ هي مِلكُنا.",
    "voorwie.regel3": "<strong>لمن سيصير هنا أبًا أو أمًّا يومًا</strong>، ويأخذ طفلًا بيده إلى الداخل.",
    "voorwie.regel4": "<strong>لنفسك</strong>، عن كل مرّةٍ تلتقط فيها أنفاسك هنا.",
    "voorwie.cap": "صلاة الجمعة في Borndiep، أكثر امتلاءً كل أسبوع.",
    "voorwie.alt": "صفوفٌ من المصلّين على سجّاد الصلاة الأزرق، مرئيّةً من الخلف",
    "voorwie.slot": "تذكّر اسمًا واحدًا. وأهدِ قطرتك لأجله.",

    // --- Deel de druppel ---
    "deel.kicker": "انشُر القطرة",
    "deel.titel": "رسالةٌ واحدة قد تُحرّك موجة",
    "deel.tekst": "معظم القطرات تبدأ برسالةٍ في مجموعة دردشة. انشُر الحملة، أو ضَع فيديو القطرة على حالتك في واتساب.",
    "deel.knop": "انشُر عبر واتساب",
    "deel.download916": "حمِّل فيديو الحالة (٩:١٦)",
    "deel.download11": "حمِّل الفيديو المربّع (١:١)",

    // --- Acties ---
    "acties.kicker": "من قلب الجماعة",
    "acties.titel": "حتى الآن…",
    "acties.oproep.pre": "نظّم نشاطك الخاص، كبيعِ مخبوزات، أو سباقٍ خيري، أو غسيل سيّارات، أو إفطارٍ خيري، ثم",
    "acties.oproep.link": "أرسِل صورك عبر واتساب",
    "acties.oproep.post": ". أجمل الأنشطة تنال مكانًا على هذه الصفحة.",

    // --- Sponsors ---
    "sponsors.kicker": "للشركات",
    "sponsors.titel": "شارِك بمؤسّستك",
    "sponsors.tekst": "بصفتك شركةً أيضًا يمكنك أن تكون «حامل ماء»: كوِّن فريق عملٍ مع زملائك، أو ساهِم عينًا: بموادّ، أو حِرَفٍ، أو خدماتٍ للعقار. يسعدنا أن نبحث معك ما يناسب نشاطك.",
    "sponsors.knopApp": "راسِلنا على واتساب",
    "sponsors.knopMail": "راسِل المؤسسة",

    // --- FAQ ---
    "faq.kicker": "الأسئلة الشائعة",
    "faq.titel": "إجاباتٌ صادقة",
    "faq.q1": "فيمَ يُصرف المال بالضبط؟",
    "faq.a1": "حصريًّا في شراء العقار الواقع في Borndiep 2B بكابيله آن دن آيسل: ثمن الشراء إضافةً إلى رسوم نقل الملكية المرتبطة به. لا يذهب شيءٌ إلى رواتب أو مصاريف جارية.",
    "faq.q2": "كيف يتكوّن مبلغ الـ €&nbsp;400.000؟",
    "faq.a2": "ثمن الشراء €&nbsp;358.422، وضريبة نقل الملكية نحو €&nbsp;37.276، ورسوم الموثّق والسجلّ العقاري نحو €&nbsp;4.302. المجموع €&nbsp;400.000. وبعد انتهاء الحملة ننشر كشفًا ماليًّا كاملًا.",
    "faq.q3": "لماذا التبرّع الآن لا لاحقًا؟",
    "faq.a3": 'لأنّ العدّ التنازلي قد بدأ فعلًا: وُقِّع عقد الشراء في ٢١ مايو ٢٠٢٦، وعند نقل الملكية يجب أن يكون كامل الثمن جاهزًا. <span data-overdracht-zin>وموعد نقل الملكية النهائي تقرؤه هنا أوّلًا</span>. وكلّما وصلت قطرتك أبكر، عاشت الجماعة أيّامها نحو ذلك اليوم أكثر طمأنينة، دون سباقٍ في اللحظات الأخيرة.',
    "faq.q4": "هل التبرّعات مجهولة؟",
    "faq.a4": "نعم. لا ننشر أبدًا مَن تبرّع بماذا: لا أسماء ولا مبالغ. على الموقع ترى المجاميع ومجاميع الفِرَق فقط. والعطاء في السرّ مستحبٌّ شرعًا.",
    "faq.q5": "هل أستطيع التبرّع دون فريق؟",
    "faq.a5": "بالتأكيد، فأكثر القطرات من متبرّعين أفراد. حوِّل ببساطة مع ذكر «Druppel» في البيان. الفريق أمرٌ ممتع، لا شرط.",
    "faq.q6": "هل أستطيع التبرّع على أقساط؟",
    "faq.a6": "نعم. يمكنك ضبط تحويلٍ دوريّ بنفسك في تطبيق مصرفك، مثلًا €&nbsp;25 شهريًّا. اكتب معه «Druppel»، فيُحتسب كل قسطٍ ضمن الحصيلة.",
    "faq.q7": "ماذا يحدث إن تحقّق الهدف متأخّرًا أو مبكّرًا؟",
    "faq.a7": "كل يورو مخصَّصٌ ويبقى مخصَّصًا لشراء العقار. إن سار الأمر أسرع من المتوقّع: فذلك رائع، ونُنجز مبكّرًا. وإن طال: تبقى مساهمتك محفوظةً لهذا الهدف بعينه. وبعد الانتهاء نُقدّم كشفًا علنيًّا.",
    "faq.q8": "كم تستمرّ الحملة؟",
    "faq.a8": 'حتى تمتلئ القبة، والوقت يضيق: فعقد الشراء وُقِّع سلفًا، وعند نقل الملكية لدى الموثّق يجب أن يكون كامل الثمن جاهزًا. <span data-overdracht-zin>وحالما يتحدّد موعد نقل الملكية النهائي، تقرؤه هنا أوّلًا</span>. كل أسبوعٍ مهمّ، فكلّما وصلت قطراتٌ أكثر الآن، اقترب ذلك اليوم. التبرّعات عبر الإنترنت تُحتسب فورًا على العدّاد؛ والتبرّعات الواردة خارج الموقع نضيفها دوريًّا. وكل جمعةٍ نشارك تحديثًا عبر واتساب وفي المسجد.',
    "faq.q9": "كيف أُقدّم طلب دعاء؟",
    "faq.a9": "عبر الزرّ في قسم التبرّع تُرسل طلبك بالبريد الإلكتروني. يصل بسرّيةٍ إلى الإمام ولا يُشارَك مع أحدٍ سواه. ويمكن إرسال الطلب حتى دون تبرّع.",
    "faq.q10": "لديّ سؤالٌ آخر. أين أتوجّه؟",
    "faq.a10.pre": "راسِلنا على واتساب عبر الأزرار في هذه الصفحة، أو بالبريد إلى",
    "faq.a10.link": "المؤسسة",
    "faq.a10.post": ". نردّ عادةً خلال يوم.",

    // --- Privacy (aparte pagina) ---
    "privacy.docTitle": "الخصوصية · قطرات السكينة",
    "privacy.kicker": "الخصوصية",
    "privacy.h1": "بإيجازٍ وصِدق",
    "privacy.p1": "بُني هذا الموقع ليُعلِمك، لا أكثر. نحن لا نتعقّبك، ولا نجمع عنك بياناتٍ شخصية.",
    "privacy.h2a": "خصوصيةٌ محترمة، دون ملفات تعريف",
    "privacy.p2": "لا يضع هذا الموقع ملفات تعريف ولا يعرض إعلانات. ولمعرفة عدد زوّار الحملة فقط، نستخدم إحصاءات زياراتٍ محترمةً للخصوصية وخاليةً من ملفات التعريف (Vercel Web Analytics): تَعُدّ مشاهدات الصفحات دون تعقّبك عبر المواقع، ودون تخزين بياناتٍ شخصية، ودون إنشاء ملفٍّ تعريفيّ عنك. أمّا الخطوط والصور ومقاطع الفيديو فتُحمَّل من خادمنا الخاص؛ ولا نُحمّل شيئًا من شركات الإعلان أو التواصل الاجتماعي.",
    "privacy.h2b": "ما الذي نعالجه (مؤقّتًا) فعلًا",
    "privacy.li1": "<strong>إن راسلتنا على واتساب أو بالبريد:</strong> فسنرى بالطبع رقمك أو بريدك الإلكتروني ورسالتك. نستخدم ذلك فقط للردّ عليك، ولا نحتفظ به أطول من اللازم.",
    "privacy.li2": "<strong>إن تبرّعت بتحويلٍ مصرفي:</strong> فسيظهر اسمك في كشف حسابنا، كما في أيّ تحويل. لكنّنا لا ننشر أبدًا مَن تبرّع بماذا، ولا نشارك بيانات المتبرّعين مع أحد.",
    "privacy.li3": "<strong>طلبات الدعاء:</strong> تصل بسرّيةٍ إلى الإمام ولا تُشارَك مع أحدٍ سواه.",
    "privacy.h2c": "الاستضافة",
    "privacy.p3": "الخادم الذي يقدّم هذه الصفحات يعالج مؤقّتًا، كأيّ خادم ويب، بياناتٍ تقنيةً مثل عنوان IP الخاص بك لعرض الصفحة. ونحن لا نستخدم تلك البيانات ولا نبني بها أيّ ملفّات تعريفية.",
    "privacy.h2d": "أسئلة؟",
    "privacy.vragenPre": "راسِلنا على",
    "privacy.vragenPost": ". نردّ عادةً خلال يوم.",
    "privacy.terug": "→ العودة إلى الحملة",

    // --- Dynamische zinnen (JS) ---
    "js.druppelsZin": "امتلأت {druppels} من أصل {totaal} قطرة",
    "js.golfInZicht": "الموجة الأولى (€ 25.000) باتت قريبة",
    "js.golf1Binnen": "تحقّقت الموجة الأولى، وفي الطريق إلى الثانية",
    "js.golvenBinnen": "تحقّقت {golven} من أصل {totaal} موجة",
    "js.aftellenBegonnen": "بدأ العدّ التنازلي",
    "js.nogWeken": "بقي {n} أسبوعًا حتى نقل الملكية",
    "js.nogDagen": "بقي {n} يومًا حتى نقل الملكية",
    "js.nog1Dag": "بقي يومٌ واحد حتى نقل الملكية",
    "js.vandaagOverdracht": "اليوم موعد نقل الملكية",
    "js.team.doelBehaald": "تحقّق الهدف ✓",
    "js.team.ariaVoortgang": "تقدّم {naam}: {op} من {doel}",
    "js.team.ariaLegenda": "تقدّم {naam}: {op} من {doel}",
    "js.deelTekst":
      "سلام! 💧 نشتري معًا بيت عبادتنا في كابيله، قطرةً بعد قطرة. المشاركة تبدأ من €10. شاهِد وشارِك: {url}",
  },
};

let _taal = "nl";
let _onWissel = null;
let _fontGeladen = false;

export function taal() {
  return _taal;
}

export function t(sleutel) {
  const v = T[_taal] && T[_taal][sleutel];
  if (v != null) return v;
  return T.nl[sleutel] != null ? T.nl[sleutel] : sleutel;
}

/** Interpoleer {naam}-plekhouders in een vertaalde string. */
export function tf(sleutel, waarden) {
  return t(sleutel).replace(/\{(\w+)\}/g, (m, k) => (waarden[k] != null ? waarden[k] : m));
}

function pasTekstToe(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.getAttribute("data-i18n-attr")
      .split(";")
      .forEach((paar) => {
        const idx = paar.indexOf(":");
        if (idx === -1) return;
        const attr = paar.slice(0, idx).trim();
        const sleutel = paar.slice(idx + 1).trim();
        if (attr && sleutel) el.setAttribute(attr, t(sleutel));
      });
  });
}

async function laadArabischeFont() {
  if (_fontGeladen) return;
  _fontGeladen = true;
  try {
    await Promise.all([
      import("@fontsource/cairo/arabic-400.css"),
      import("@fontsource/cairo/arabic-600.css"),
      import("@fontsource/cairo/arabic-700.css"),
    ]);
  } catch {
    /* font is optioneel; systeem-Arabisch valt in */
  }
}

function zetDocument() {
  const html = document.documentElement;
  html.lang = _taal;
  html.dir = _taal === "ar" ? "rtl" : "ltr";
  html.classList.toggle("is-ar", _taal === "ar");
}

export async function zetTaal(lang) {
  _taal = lang === "ar" ? "ar" : "nl";
  try {
    localStorage.setItem("taal", _taal);
  } catch {
    /* private mode */
  }
  zetDocument();
  if (_taal === "ar") await laadArabischeFont();
  pasTekstToe();
  if (_onWissel) _onWissel();
}

/** Bij het laden: bewaarde keuze toepassen en de statische teksten zetten. */
export function initI18n(onWissel) {
  _onWissel = onWissel;
  let opgeslagen = null;
  try {
    opgeslagen = localStorage.getItem("taal");
  } catch {
    /* private mode */
  }
  _taal = opgeslagen === "ar" ? "ar" : "nl";
  zetDocument();
  if (_taal === "ar") laadArabischeFont();
  pasTekstToe();
}
