// Types voor data/campagne.js — dat bestand blijft zelf plain JS (met Dutch
// comments), want het campagneteam bewerkt het rechtstreeks in Kladblok/VS
// Code (zie BEHEER.md). Deze types worden er via een JSDoc @type-annotatie
// aan gekoppeld, zodat tsc het bestand toch controleert.

// De index signature laat render.ts een taalvariant-veld opzoeken via een
// samengestelde sleutel (bv. "naam" + "_ar"), zonder een cast/`any` nodig
// te hebben — zie `veld()` in src/js/render.ts.
export interface Team {
  naam: string;
  naam_ar?: string;
  doelCents: number;
  opgehaaldCents: number;
  beschrijving: string;
  beschrijving_ar?: string;
  whatsappLink: string;
  [key: string]: string | number | undefined;
}

export interface Actie {
  titel: string;
  titel_ar?: string;
  beschrijving: string;
  beschrijving_ar?: string;
  foto: string;
  [key: string]: string | undefined;
}

export interface Social {
  instagram: string;
  tiktok: string;
  facebook: string;
}

export interface Campagne {
  doelCents: number;
  buitenStripeCents: number;
  opgehaaldCents: number;
  laatsteUpdate: string;
  overdrachtsdatum: string;
  iban: string;
  tnv: string;
  kvk: string;
  kenmerk: string;
  idealLink: string;
  stripePaymentLink: string;
  whatsappNummer: string;
  contactEmail: string;
  siteUrl: string;
  whatsappCommunity: string;
  social: Social;
  teams: Team[];
  acties: Actie[];
}
