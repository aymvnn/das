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
import { euro, pctTekst, svgEl } from "./utils.js";
import { logoMarkup, VIEWBOX_W, VIEWBOX_H, DROP_PATH } from "./logo-paths.js";

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

const VINKJE =
  '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.8 6.2 4.6 9l5.6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function renderAlles() {
  renderTeller();
  renderOverdracht();
  renderGolvenLijst();
  renderDruppelraster();
  renderTeams();
  renderActies();
  renderContactLinks();
  renderLogos();
  qsa("[data-jaar]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* --- Teller & samenvattende zinnen --- */
function renderTeller() {
  const druppels = druppelsGevallen();
  const golven = golvenBehaald();
  const pct = percentage();

  qsa("[data-doel]").forEach((el) => (el.textContent = euro(campagne.doelCents)));
  qsa("[data-laatste-update]").forEach((el) => (el.textContent = campagne.laatsteUpdate));
  qsa("[data-pct]").forEach((el) => (el.textContent = pctTekst(pct)));
  qsa("[data-pct-lang]").forEach((el) => (el.textContent = pctTekst(pct)));

  const druppelZin = `${druppels} van de ${TOTAAL_DRUPPELS} druppels gevuld`;
  qsa("[data-druppels-zin]").forEach((el) => (el.textContent = druppelZin));
  qsa("[data-druppels-zin-2]").forEach(
    (el) => (el.textContent = `${druppels} druppels gevuld, ${TOTAAL_DRUPPELS - druppels} te gaan`),
  );
  qsa("[data-druppels-tegaan]").forEach(
    (el) => (el.textContent = TOTAAL_DRUPPELS - druppels),
  );

  const golfZin =
    golven === 0
      ? `de eerste golf (€ 25.000) is in zicht`
      : golven === 1
        ? `golf 1 is binnen, op weg naar golf 2`
        : `${golven} van de ${TOTAAL_GOLVEN} golven zijn binnen`;
  qsa("[data-golven-zin]").forEach((el) => (el.textContent = golfZin));

  qsa("[data-iban]").forEach((el) => (el.textContent = campagne.iban));
  qsa("[data-tnv]").forEach((el) => (el.textContent = campagne.tnv));
  qsa("[data-kvk]").forEach((el) => (el.textContent = campagne.kvk));
}

/* --- Aftellen naar de overdracht ---
   Leeg veld, typfout of verstreken datum = stille fallback: de
   teksten die al in de HTML staan blijven gewoon staan. --- */
const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"];

function parseNlDatum(str) {
  const m = String(str || "").trim().toLowerCase().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (!m) return null;
  const maand = MAANDEN.indexOf(m[2]);
  if (maand === -1) return null;
  const d = new Date(Number(m[3]), maand, Number(m[1]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function renderOverdracht() {
  const datum = parseNlDatum(campagne.overdrachtsdatum);
  if (!datum) return;
  const vandaag = new Date();
  vandaag.setHours(0, 0, 0, 0);
  const dagen = Math.ceil((datum - vandaag) / 86400000);
  if (dagen < 0) return;
  const zin =
    dagen === 0 ? "vandaag is de overdracht"
    : dagen === 1 ? "nog 1 dag tot de overdracht"
    : dagen < 14 ? `nog ${dagen} dagen tot de overdracht`
    : `nog ${Math.round(dagen / 7)} weken tot de overdracht`;
  qsa("[data-overdracht-zin]").forEach((el) => (el.textContent = zin));
}

/* --- De 16 golf-mijlpalen --- */
function renderGolvenLijst() {
  const lijst = qs("[data-golven-lijst]");
  if (!lijst) return;
  const behaald = golvenBehaald();

  for (let i = 1; i <= TOTAAL_GOLVEN; i++) {
    const li = document.createElement("li");
    const status =
      i <= behaald ? "is-behaald" : i === behaald + 1 ? "is-volgende" : "is-toekomst";
    li.className = `golf-item ${status}`;
    li.dataset.golf = i;
    const bedrag = euro(GOLF_CENTS * i);
    const label =
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

/* --- Druppelraster: 400 druppels, 1 per € 1.000 --- */
function renderDruppelraster() {
  const raster = qs("[data-druppelraster]");
  if (!raster) return;
  const gevuld = druppelsGevallen();

  const frag = document.createDocumentFragment();
  for (let i = 0; i < TOTAAL_DRUPPELS; i++) {
    const svg = svgEl("svg", { viewBox: "0 0 10 13.4", class: "rasterdruppel" });
    svg.style.setProperty("--di", i % 100);
    const pad = svgEl("path", {
      d: "M5 .8C6.9 3.4 8.55 5.8 8.55 8.35A3.55 3.55 0 0 1 5 11.9 3.55 3.55 0 0 1 1.45 8.35C1.45 5.8 3.1 3.4 5 .8Z",
    });
    svg.append(pad);
    if (i === TOTAAL_DRUPPELS - gevuld - 1 && gevuld < TOTAAL_DRUPPELS) {
      svg.classList.add("is-volgende");
      const titel = svgEl("title");
      titel.textContent = "De volgende druppel: die van jou?";
      svg.prepend(titel);
    }
    frag.append(svg);
  }
  raster.append(frag);
  raster.dataset.gevuld = gevuld;
}

/* --- Waterdragers-teams --- */
const NIVEAUS = [
  [250000, "Druppel"],
  [500000, "Stroom"],
  [1000000, "Golf"],
  [2500000, "Bron"],
];
const niveauNaam = (doelCents) => {
  for (const [cents, naam] of NIVEAUS) if (doelCents <= cents) return naam;
  return "Bron";
};

function renderTeams() {
  const lijst = qs("[data-teams-lijst]");
  if (!lijst) return;

  campagne.teams.forEach((team, i) => {
    const pct = Math.min(100, (team.opgehaaldCents / team.doelCents) * 100);
    const behaald = team.opgehaaldCents >= team.doelCents;
    const li = document.createElement("li");
    li.className = `team-rij${behaald ? " is-behaald" : ""}`;
    li.setAttribute("data-reveal", "");
    li.style.setProperty("--i", i % 4);
    li.innerHTML = `
      <div class="team-kop">
        <h3 class="team-naam">${team.naam}</h3>
        <span class="team-niveau${behaald ? " is-behaald" : ""}">${
          behaald ? "Doel behaald ✓" : niveauNaam(team.doelCents)
        }</span>
      </div>
      <p class="team-beschrijving">${team.beschrijving}</p>
      <div class="team-voortgang">
        <div class="team-balk" role="progressbar"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"
             aria-label="Voortgang ${team.naam}: ${euro(team.opgehaaldCents)} van ${euro(team.doelCents)}">
          <div class="team-balk-vulling" data-balk-pct="${pct}"></div>
        </div>
        <p class="team-cijfers"><strong>${euro(team.opgehaaldCents)}</strong> / ${euro(team.doelCents)}</p>
      </div>`;
    lijst.append(li);
  });
}

/* --- Acties --- */
function renderActies() {
  const lijst = qs("[data-acties-lijst]");
  if (!lijst) return;
  campagne.acties.forEach((actie, i) => {
    const li = document.createElement("li");
    li.className = "actie-kaart";
    li.setAttribute("data-reveal", "");
    li.style.setProperty("--i", i);
    li.innerHTML = `
      <img src="/${actie.foto}" alt="${actie.titel}" loading="lazy" width="900" height="675" />
      <h3>${actie.titel}</h3>
      <p>${actie.beschrijving}</p>`;
    lijst.append(li);
  });
}

/* --- WhatsApp- en maillinks met vooringevulde teksten --- */
function renderContactLinks() {
  const nr = campagne.whatsappNummer;
  const wa = (tekst) => `https://wa.me/${nr}?text=${encodeURIComponent(tekst)}`;
  const set = (sel, href) => qsa(sel).forEach((el) => (el.href = href));

  set(
    "[data-wa-team]",
    wa(
      "Salaam! Ik wil een Waterdragers-team starten voor Druppels van Sakīnah. 🌊\nTeamnaam: …\nOns doel: Druppel € 2.500 / Stroom € 5.000 / Golf € 10.000 / Bron € 25.000",
    ),
  );
  set(
    "[data-wa-dua]",
    wa("Salaam. Ik heb een duʿā'-verzoek voor de imam (vertrouwelijk): …"),
  );
  set(
    "[data-wa-actie]",
    wa("Salaam! Ons team heeft een actie gehouden voor Druppels van Sakīnah. Hierbij de foto's en een korte beschrijving: …"),
  );
  set(
    "[data-wa-bedrijf]",
    wa("Salaam! Ik wil met mijn bedrijf bijdragen aan Druppels van Sakīnah (bedrijfsteam of in natura). Kunnen we even schakelen?"),
  );
  set("[data-wa-contact]", wa("Salaam! Ik heb een vraag over Druppels van Sakīnah: …"));
  set(
    "[data-wa-groot]",
    wa("Salaam. Ik wil graag in vertrouwen een grotere bijdrage bespreken voor Druppels van Sakīnah."),
  );
  set(
    "[data-mail-groot]",
    `mailto:${campagne.contactEmail}?subject=${encodeURIComponent("Grotere bijdrage — Druppels van Sakīnah")}`,
  );

  // Delen: geen nummer — opent de kies-een-chat-lijst van WhatsApp zelf
  const deelTekst = `Salaam! 💧 Wij kopen samen ons gebedshuis in Capelle, druppel voor druppel. Meedoen kan al vanaf € 10. Kijk en doe mee: ${campagne.siteUrl}`;
  set("[data-wa-deel]", `https://wa.me/?text=${encodeURIComponent(deelTekst)}`);

  const mailOnderwerp = encodeURIComponent("Druppels van Sakīnah");
  set("[data-mail-contact]", `mailto:${campagne.contactEmail}?subject=${mailOnderwerp}`);
  set(
    "[data-mail-bedrijf]",
    `mailto:${campagne.contactEmail}?subject=${encodeURIComponent("Bedrijfsbijdrage — Druppels van Sakīnah")}`,
  );
}

/* --- Logo's (header, footer) --- */
function renderLogos() {
  const mini = qs("[data-logo-mini]");
  if (mini) {
    mini.innerHTML = `<svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" aria-hidden="true">${logoMarkup({ idPrefix: "mini" })}</svg>`;
  }
  const voet = qs("[data-logo-footer]");
  if (voet) {
    voet.innerHTML = `<svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" aria-hidden="true">${logoMarkup({ idPrefix: "voet" })}</svg>`;
  }
}

export { DROP_PATH };
