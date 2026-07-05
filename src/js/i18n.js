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
    "footer.noot": "Geen cookies, geen trackers, alleen druppels. ·",

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
    "footer.noot": "لا ملفات تعريف، لا متتبّعات، قطراتٌ فقط. ·",

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
