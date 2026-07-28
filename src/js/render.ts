// Vult alle datagedreven onderdelen vanuit data/campagne.js.
import {
  campagne,
  TOTAAL_DRUPPELS,
  TOTAAL_GOLVEN,
  GOLF_CENTS,
  druppelsGevallen,
  golvenBehaald,
  percentage,
} from "../../data/campagne.js";
import type { Team, Actie } from "../../data/campagne.types.js";
import { euro, pctTekst } from "./utils.js";
import { t, tf, taal } from "./i18n.js";
import { plaatsLogo } from "./logo-paths.js";

const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);
const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] => [
  ...root.querySelectorAll<T>(sel),
];

// Kies het veld in de actieve taal; val terug op het Nederlands als de
// _ar-variant leeg of afwezig is.
const veld = (obj: Team | Actie, sleutel: string): string => {
  if (taal() === "ar") {
    const ar: string | number | undefined = obj[`${sleutel}_ar`];
    if (ar != null && String(ar).trim() !== "") return String(ar);
  }
  const waarde: string | number | undefined = obj[sleutel];
  return waarde != null ? String(waarde) : "";
};

// Kleine HTML-escaper voor datagedreven tekst die via innerHTML wordt gezet.
const esc = (s: unknown): string =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const VINKJE =
  '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.8 6.2 4.6 9l5.6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function renderAlles(): void {
  renderTeller();
  renderOverdracht();
  renderGolvenLijst();
  renderTeams();
  renderActies();
  renderContactLinks();
  renderLogos();
  qsa("[data-jaar]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
}

/* --- Teller & samenvattende zinnen --- */
export function renderTeller(): void {
  const druppels: number = druppelsGevallen();
  const golven: number = golvenBehaald();
  const pct: number = percentage();

  qsa("[data-doel]").forEach((el) => (el.textContent = euro(campagne.doelCents)));
  qsa("[data-pct]").forEach((el) => (el.textContent = pctTekst(pct)));
  qsa("[data-pct-lang]").forEach((el) => (el.textContent = pctTekst(pct)));

  const druppelZin: string = tf("js.druppelsZin", { druppels, totaal: TOTAAL_DRUPPELS });
  qsa("[data-druppels-zin]").forEach((el) => (el.textContent = druppelZin));
  qsa("[data-druppels-tegaan]").forEach(
    (el) => (el.textContent = String(TOTAAL_DRUPPELS - druppels)),
  );

  const golfZin: string =
    golven === 0
      ? t("js.golfInZicht")
      : golven === 1
        ? t("js.golf1Binnen")
        : tf("js.golvenBinnen", { golven, totaal: TOTAAL_GOLVEN });
  qsa("[data-golven-zin]").forEach((el) => (el.textContent = golfZin));

  qsa("[data-iban]").forEach((el) => (el.textContent = campagne.iban));
  qsa("[data-tnv]").forEach((el) => (el.textContent = campagne.tnv));
  qsa("[data-kvk]").forEach((el) => (el.textContent = campagne.kvk));
}

/* --- Aftellen naar de overdracht ---
   Leeg veld, typfout of verstreken datum = stille fallback: de
   teksten die al in de HTML staan blijven gewoon staan. --- */
const MAANDEN: string[] = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

function parseNlDatum(str: string): Date | null {
  const m: RegExpMatchArray | null = String(str || "").trim().toLowerCase().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (!m) return null;
  const [, dagStr, maandStr, jaarStr] = m;
  if (!dagStr || !maandStr || !jaarStr) return null;
  const maand: number = MAANDEN.indexOf(maandStr);
  if (maand === -1) return null;
  const d: Date = new Date(Number(jaarStr), maand, Number(dagStr));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function renderOverdracht(): void {
  const datum: Date | null = parseNlDatum(campagne.overdrachtsdatum);
  if (!datum) return;
  const vandaag: Date = new Date();
  vandaag.setHours(0, 0, 0, 0);
  const dagen: number = Math.ceil((datum.getTime() - vandaag.getTime()) / 86400000);
  if (dagen < 0) return;
  const zin: string =
    dagen === 0 ? t("js.vandaagOverdracht")
    : dagen === 1 ? t("js.nog1Dag")
    : dagen < 14 ? tf("js.nogDagen", { n: dagen })
    : tf("js.nogWeken", { n: Math.round(dagen / 7) });
  qsa("[data-overdracht-zin]").forEach((el) => (el.textContent = zin));
}

/* --- De 16 golf-mijlpalen --- */
function renderGolvenLijst(): void {
  const lijst: HTMLElement | null = qs("[data-golven-lijst]");
  if (!lijst) return;
  const behaald: number = golvenBehaald();

  for (let i = 1; i <= TOTAAL_GOLVEN; i++) {
    const li: HTMLLIElement = document.createElement("li");
    const status: string =
      i <= behaald ? "is-behaald" : i === behaald + 1 ? "is-volgende" : "is-toekomst";
    li.className = `golf-item ${status}`;
    li.dataset.golf = String(i);
    const bedrag: string = euro(GOLF_CENTS * i);
    const label: string =
      i <= behaald
        ? `Golf ${i}: ${bedrag} · binnen`
        : i === behaald + 1
          ? `Golf ${i}: ${bedrag} · de volgende`
          : `Golf ${i}: ${bedrag}`;
    li.setAttribute("aria-label", label);
    li.innerHTML = `
      <span class="golf-status" aria-hidden="true">${i <= behaald ? VINKJE : ""}</span>
      <span class="golf-naam">Golf ${i}</span>
      <span class="golf-bedrag">${bedrag}</span>`;
    li.title = i <= behaald ? `Golf ${i}: ${bedrag} ✓` : `Golf ${i}: ${bedrag}`;
    lijst.append(li);
  }
}

/* --- Waterdragers-teams --- */
const NIVEAUS: Array<[number, string]> = [
  [250000, "niveau.druppel"],
  [500000, "niveau.stroom"],
  [1000000, "niveau.golf"],
  [2500000, "niveau.bron"],
];
const niveauNaam = (doelCents: number): string => {
  for (const [cents, sleutel] of NIVEAUS) if (doelCents <= cents) return t(sleutel);
  return t("niveau.bron");
};

export function renderTeams(): void {
  const lijst: HTMLElement | null = qs("[data-teams-lijst]");
  if (!lijst) return;
  lijst.textContent = ""; // idempotent: opnieuw opbouwen bij taalwissel

  campagne.teams.forEach((team, i) => {
    const pct: number = Math.min(100, (team.opgehaaldCents / team.doelCents) * 100);
    const behaald: boolean = team.opgehaaldCents >= team.doelCents;
    const naam: string = veld(team, "naam");
    const beschrijving: string = veld(team, "beschrijving");
    const ariaVoortgang: string = tf("js.team.ariaVoortgang", {
      naam,
      op: euro(team.opgehaaldCents),
      doel: euro(team.doelCents),
    });
    const li: HTMLLIElement = document.createElement("li");
    li.className = `team-rij${behaald ? " is-behaald" : ""}`;
    li.setAttribute("data-reveal", "");
    li.style.setProperty("--i", String(i % 4));
    li.innerHTML = `
      <div class="team-kop">
        <h3 class="team-naam">${esc(naam)}</h3>
        <span class="team-niveau${behaald ? " is-behaald" : ""}">${
          behaald ? esc(t("js.team.doelBehaald")) : esc(niveauNaam(team.doelCents))
        }</span>
      </div>
      <p class="team-beschrijving">${esc(beschrijving)}</p>
      <div class="team-voortgang">
        <div class="team-balk" role="progressbar"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"
             aria-label="${esc(ariaVoortgang)}">
          <div class="team-balk-vulling" data-balk-pct="${pct}"></div>
        </div>
        <p class="team-cijfers"><strong>${euro(team.opgehaaldCents)}</strong> / ${euro(team.doelCents)}</p>
      </div>`;
    lijst.append(li);
  });
}

/* --- Acties --- */
export function renderActies(): void {
  const lijst: HTMLElement | null = qs("[data-acties-lijst]");
  if (!lijst) return;
  lijst.textContent = ""; // idempotent: opnieuw opbouwen bij taalwissel
  campagne.acties.forEach((actie, i) => {
    const titel: string = veld(actie, "titel");
    const beschrijving: string = veld(actie, "beschrijving");
    const li: HTMLLIElement = document.createElement("li");
    li.className = "actie-kaart";
    li.setAttribute("data-reveal", "");
    li.style.setProperty("--i", String(i));
    li.innerHTML = `
      <img src="/${esc(actie.foto)}" alt="${esc(titel)}" loading="lazy" width="900" height="675" />
      <h3>${esc(titel)}</h3>
      <p>${esc(beschrijving)}</p>`;
    lijst.append(li);
  });
}

/* --- WhatsApp- en maillinks met vooringevulde teksten --- */
function renderContactLinks(): void {
  const set = (sel: string, href: string): void =>
    qsa<HTMLAnchorElement>(sel).forEach((el) => (el.href = href));
  const mail = (onderwerp: string): string =>
    `mailto:${campagne.contactEmail}?subject=${encodeURIComponent(onderwerp)}`;

  // Algemene "via WhatsApp"-acties verwijzen naar de WhatsApp-community.
  // Geen community-link ingevuld? Dan valt het terug op e-mail.
  const community: string = (campagne.whatsappCommunity || "").trim();
  const samen: string = community || mail("Druppels van Sakīnah");
  set("[data-wa-team]", samen);
  set("[data-wa-actie]", samen);
  set("[data-wa-bedrijf]", samen);
  set("[data-wa-contact]", samen);

  // Vertrouwelijk / discreet → per e-mail, NIET via de openbare community.
  set("[data-wa-dua]", mail("Duʿā'-verzoek (vertrouwelijk)"));
  set("[data-mail-groot]", mail("Grotere bijdrage — Druppels van Sakīnah"));

  // Delen: geen nummer — opent de kies-een-chat-lijst van WhatsApp zelf
  const deelTekst: string = tf("js.deelTekst", { url: campagne.siteUrl });
  set("[data-wa-deel]", `https://wa.me/?text=${encodeURIComponent(deelTekst)}`);

  set("[data-mail-contact]", mail("Druppels van Sakīnah"));
  set("[data-mail-bedrijf]", mail("Bedrijfsbijdrage — Druppels van Sakīnah"));

  // Sociale kanalen: vul de href, of verberg het icoon als er geen link is.
  const setSocial = (sel: string, url: string): void =>
    qsa<HTMLAnchorElement>(sel).forEach((el) => {
      if (url) el.href = url;
      else el.hidden = true;
    });
  setSocial("[data-social-instagram]", campagne.social.instagram);
  setSocial("[data-social-tiktok]", campagne.social.tiktok);
  setSocial("[data-social-facebook]", campagne.social.facebook);
}

/* --- Logo's (header, footer) --- */
function renderLogos(): void {
  plaatsLogo("[data-logo-mini]");
  plaatsLogo("[data-logo-footer]");
}
