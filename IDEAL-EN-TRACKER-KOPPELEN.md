# iDEAL-doneerknop live zetten + de teller automatisch koppelen

> Doel: van handmatige IBAN-overschrijving naar **één tik betalen via iDEAL**, en een
> **teller die zichzelf bijwerkt**. Onderzocht/bijgewerkt: juni 2026.
> Stack: statische site (Vite + vanilla JS), hosting op Vercel, bankrekening bij de Rabobank.
> **We hebben al een Stripe-account.**

---

## Conclusie (kort)

**Gebruik jullie bestaande Stripe-account.** Omdat het account er al is en geverifieerd is,
is dit nu zowel de **snelste** route als een **perfecte match met onze stack** (statische
JS-site + Vercel serverless). Stripe betaalt uit op een **Nederlandse bankrekening**, dus op
onze **Rabo-IBAN** — we blijven gewoon bij de Rabobank.

> **Eén ding vooraf checken:** is het Stripe-account geregistreerd op **Nederland** en op naam
> van de **stichting** (niet privé), met onze **Rabo-IBAN als uitbetaalrekening**? Dat is nodig
> voor iDEAL + een nette boekhouding/ANBI. Zo niet: in Stripe het land/entiteit + payout-IBAN
> goedzetten, of een Stripe-account onder de stichting gebruiken.

Mollie blijft een prima alternatief (NL-standaard), maar vereist een **nieuw** account +
verificatie. Rabo OnlineKassa = de "alles via de Rabobank"-optie, maar trager en minder passend
(PHP/Java-SDK, bankcontract, maandkosten). Beide onderaan kort toegelicht.

---

## Waarom Stripe nu de beste keuze is

- **Geen onboarding-wachttijd:** het account bestaat al en is geverifieerd.
- **Past op de stack:** uitstekende **Node.js-SDK** (Stripe SDK v17, API 2026-01-28) + REST +
  **webhooks** → sluit naadloos aan op **Vercel serverless functions** (JavaScript).
- **Donatie-vriendelijk zonder code:** Stripe **Payment Links** kennen een stand
  **"klant kiest zelf het bedrag"** (pay-what-you-want), met iDEAL aan — ideaal voor doneren.
- **Je houdt de Rabobank:** uitbetaling naar onze Rabo-IBAN.
- **iDEAL | Wero:** Stripe ondersteunt de iDEAL→Wero-overgang (loopt 2026–2028) automatisch.
- **Kosten:** iDEAL ± **€ 0,29** per transactie (vlak tarief).

---

## Eerst even goedzetten in het Stripe-dashboard (eenmalig)

1. **Land/valuta:** account op **Nederland**, valuta **EUR**.
2. **Payment methods:** zet **iDEAL** (iDEAL | Wero) aan.
3. **Payout:** uitbetaalrekening = onze **Rabo-IBAN** (NL77 RABO 0170 9862 92), t.n.v. de stichting.
4. **API-keys:** noteer de **test**- en **live**-keys + het **webhook signing secret**
   (komt later bij Tier B).

---

## Twee snelheden — doe ze achter elkaar

### Tier A — vandaag live, zonder code
1. Stripe-dashboard → **Payment Links** → **New** → kies **"Customers choose what to pay"**
   (klant kiest bedrag; eventueel een minimum instellen) → zorg dat **iDEAL** aanstaat.
2. Kopieer de link en plak die in `data/campagne.js` bij `idealLink: "..."`.
   De iDEAL-knop verschijnt dan vanzelf (wiring zit al in `src/js/interactions.js`).
   → Doneren werkt direct via een Stripe-pagina. De **teller blijft nog handmatig** (BEHEER.md).

> NB: bij Tier A kiest de donateur het bedrag op de Stripe-pagina; de bedrag-chips op de site
> zijn dan vooral visueel. In Tier B koppelen we het gekozen chip-bedrag wél door.

### Tier B — volledig automatisch (aanbevolen einddoel)
Een kleine **Vercel serverless-functie** (Node, Stripe-SDK) + webhook, zodat de teller én de
teamtelling zichzelf bijwerken:

```
Donateur kiest € 50 (+ optioneel teamnaam)
      │
      ▼
/api/create-checkout  →  Stripe Checkout (iDEAL|Wero)  →  betalen bij eigen bank
      │                                                      │  geld → onze Rabo-IBAN
      ▼                                                      ▼
  Bedankt-scherm                          Stripe-webhook (checkout.session.completed)
                                              → telt bedrag op bij totaal
                                              → telt bij het juiste team (metadata)
      │
      ▼
Site haalt /api/total op → teller + koepel-dome stijgen vanzelf
```

De **teamnaam reist mee als Stripe-metadata** op de Checkout Session — niet als een woordje dat
de donateur in een bankomschrijving moet typen (en vaak vergeet). Dat lost de zwakke teamtelling op.

---

## Wat moet JÍJ doen (kan ik/Claude niet — account & sleutels)

1. De **dashboard-checks** hierboven doen (land NL, EUR, iDEAL aan, payout = Rabo-IBAN).
2. **API-keys + webhook secret** ophalen (eerst `sk_test_...`, later `sk_live_...`).
3. Die als **omgevingsvariabelen in Vercel** zetten — **nooit** in de code/Git.

> Ik kan en mag **geen accounts/keys aanmaken of invoeren**. Dat doe jij; daarna doet Claude
> Code de techniek.

---

## De prompt voor Claude Code (kopieer–plak, Tier B met Stripe)

```text
Context: "Druppels van Sakinah" campagnesite (Vite + vanilla JS, statisch, in /druppels-site).
Teller-data in data/campagne.js (centen). Er is al een verborgen iDEAL-knop (data-ideal-knop)
+ wiring in src/js/interactions.js die verschijnt zodra campagne.idealLink gevuld is. Hosting: Vercel.
Uitbetaalrekening: Rabobank (NL77 RABO 0170 9862 92, Stichting IV Het Trefpunt, KvK 99465655).
Betaaldienst: ons BESTAANDE Stripe-account (Node-SDK), iDEAL|Wero, EUR. Keys + webhook-secret
staan in Vercel-omgevingsvariabelen.

Bouw, met de Stripe Node-SDK en de keys uit Vercel-env (nooit in de repo):
1) Serverless API (Vercel functions, Node):
   - POST /api/create-checkout: maakt een Stripe Checkout Session aan met payment_method_types
     ['ideal','card'], mode 'payment', het gekozen bedrag (centen, EUR), success/cancel-URL, en
     metadata { team, kenmerk }; retourneert de session-URL.
   - POST /api/webhook: verifieert de Stripe-signature (constructEvent met raw body + secret),
     en telt bij 'checkout.session.completed' (betaald) het bedrag op bij het totaal én bij het
     juiste team (uit metadata). Opslag in Vercel KV.
   - GET /api/total: geeft totaal + per-team totalen als JSON terug (met caching).
   - Een /bedankt-scherm na terugkeer (toont bedrag + dua-regel).
2) Frontend-koppeling:
   - Laat de bedrag-chips + "Doneer via iDEAL"-knop /api/create-checkout aanroepen met bedrag
     (+ teamnaam) en doorsturen naar de Stripe Checkout.
   - Laat de site bij het laden /api/total ophalen en daarmee de teller, de koepel-dome en de
     teambalken voeden, met campagne.js als fallback als de API onbereikbaar is.
   - Houd een nette "liever zelf overmaken via IBAN"-fallback zichtbaar.
3) Eerst TEST-keys (gebruik Stripe testmodus + iDEAL-testbetaling), korte test/handleiding,
   BEHEER.md bijwerken. Verifieer dat een testbetaling het totaal echt laat stijgen.
   Stel vragen als iets ontbreekt (welke teams, welk Vercel-project, success-URL).
```

---

## Alternatieven (voor de volledigheid)

**Mollie** — NL-standaard, officiële Node-SDK, ± € 0,32/iDEAL, geen vaste kosten, stort op
Rabo-IBAN. Even goed qua stack-fit, maar je moet een **nieuw account aanmaken + verifiëren**;
omdat Stripe er al is, is Stripe sneller.

**Rabo OnlineKassa / Rabo Smart Pay API** — "OmniKassa" heet nu zo. REST + webhooks, maar
officiële SDK's zijn **PHP/Java (geen Node)**, vereist een **Rabo-zakelijkcontract** en heeft
**maandkosten** (6 mnd gratis-actie). Alles-in-huis bij de Rabobank, maar trager live en minder
passend bij onze JS/Vercel-stack.

---

## Kaders die overeind blijven

- **Eén echte betaallink eerst** (Tier A) — niet wachten tot alles af is.
- **Geen verzonnen cijfers.** Tot de automatische teller live is, volgt het getal in
  `campagne.js` het échte banksaldo (zie BEHEER.md).
- **Keys nooit in de code** — altijd via Vercel-omgevingsvariabelen.
- **Privacy blijft:** alleen totalen tonen, nooit namen/bedragen van individuele gevers (ikhlās).

---

### Bronnen (geraadpleegd juni 2026)
- Stripe iDEAL | Wero — docs.stripe.com/payments/ideal
- Stripe Payment Links / pay-what-you-want — docs.stripe.com/payment-links · docs.stripe.com/payments/checkout/pay-what-you-want
- Stripe Checkout Sessions + webhooks — docs.stripe.com/api/checkout/sessions · docs.stripe.com/webhooks/handling-payment-events
- Stripe donaties — support.stripe.com/questions/how-to-accept-donations-through-stripe
- Mollie iDEAL / pricing — mollie.com/payments/ideal · mollie.com/pricing
- Rabo Smart Pay API / OnlineKassa — rabobank.nl/.../rabo-smart-pay-api · developer.rabobank.nl
