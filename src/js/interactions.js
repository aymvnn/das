// Interacties: IBAN kopiëren, bedrag kiezen + doneren, FAQ-accordeon.
import { campagne } from "../../data/campagne.js";

/* --- IBAN kopiëren met bevestiging --- */
export function startIbanKopieren() {
  const knop = document.querySelector("[data-kopieer-iban]");
  if (!knop) return;
  const tekst = knop.querySelector(".kopieer-tekst");
  const ok = knop.querySelector(".kopieer-ok");

  knop.addEventListener("click", async () => {
    const iban = campagne.iban.replace(/\s+/g, " ").trim();
    try {
      await navigator.clipboard.writeText(iban);
    } catch {
      // Fallback voor oudere browsers
      const veld = document.createElement("textarea");
      veld.value = iban;
      veld.style.position = "fixed";
      veld.style.opacity = "0";
      document.body.append(veld);
      veld.select();
      document.execCommand("copy");
      veld.remove();
    }
    tekst.hidden = true;
    ok.hidden = false;
    knop.classList.add("is-gekopieerd");
    setTimeout(() => {
      tekst.hidden = false;
      ok.hidden = true;
      knop.classList.remove("is-gekopieerd");
    }, 2200);
  });
}

/* --- Bedrag kiezen + doneren onder "Doneren" ---
   Klik op een bedrag = dat bedrag oplichten (gekozen) en de doneerknop tonen.
   Klik op de knop:
     - Is er een vaste betaallink (campagne.idealLink)? Dan daarheen (Tier A).
     - Anders maken we via /api/create-checkout een Stripe Checkout-sessie en
       sturen we door naar iDEAL/creditcard (Tier B).
   Werkt online betalen (nog) niet, dan blijft overmaken via de IBAN mogelijk. --- */
export function startBedragKiezen() {
  const groep = document.querySelector("[data-bedrag-keuze]");
  if (!groep) return;
  const chips = [...groep.querySelectorAll("[data-bedrag-chip]")];
  if (!chips.length) return;

  const knop = document.querySelector("[data-ideal-knop]");
  const knopBedrag = knop?.querySelector("[data-ideal-bedrag]");
  const teamKeuze = document.querySelector("[data-team-keuze]");
  const link = (campagne.idealLink || "").trim();

  let gekozenEuro = 0;

  const kies = (chip) => {
    gekozenEuro = Number(chip.dataset.euro) || 0;
    chips.forEach((c) => {
      const actief = c === chip;
      c.classList.toggle("is-actief", actief);
      c.setAttribute("aria-pressed", actief ? "true" : "false");
    });
    if (!knop) return;
    knop.hidden = gekozenEuro <= 0;
    if (knopBedrag && gekozenEuro > 0) {
      knopBedrag.textContent = ` € ${gekozenEuro.toLocaleString("nl-NL")}`;
    }
  };
  chips.forEach((chip) => chip.addEventListener("click", () => kies(chip)));

  if (!knop) return;

  knop.addEventListener("click", async (e) => {
    e.preventDefault();
    if (gekozenEuro <= 0) return;

    // Tier A - vaste betaallink ingevuld in campagne.idealLink
    if (link) {
      const href = link
        .replace(/\{bedrag\}/g, String(gekozenEuro))
        .replace(/\{centen\}/g, String(gekozenEuro * 100));
      window.location.href = href;
      return;
    }

    // Tier B - Stripe Checkout via onze eigen API
    if (knop.dataset.bezig === "1") return;
    knop.dataset.bezig = "1";
    knop.setAttribute("aria-busy", "true");
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cents: gekozenEuro * 100,
          team: teamKeuze?.value || "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data && data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("geen betaal-URL");
    } catch {
      knop.dataset.bezig = "";
      knop.removeAttribute("aria-busy");
      alert(
        "Online doneren lukt op dit moment even niet. Je kunt je druppel ook overmaken via de IBAN hieronder - alvast bedankt.",
      );
    }
  });
}

/* --- FAQ: vloeiend open- en dichtvouwen ---
   Zonder JavaScript werkt <details> gewoon; dit voegt alleen de
   vloeiende beweging toe (grid-rows-techniek). --- */
export function startFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const body = item.querySelector(".faq-body");
    if (!body) return;
    const wrapper = document.createElement("div");
    wrapper.className = "faq-wrapper";
    body.replaceWith(wrapper);
    wrapper.append(body);

    const summary = item.querySelector("summary");
    summary.addEventListener("click", (e) => {
      if (item.open) {
        // dichtvouwen: eerst animeren, dan pas echt sluiten
        e.preventDefault();
        item.classList.remove("is-open");
        wrapper.addEventListener(
          "transitionend",
          () => {
            item.open = false;
          },
          { once: true },
        );
      } else {
        requestAnimationFrame(() => item.classList.add("is-open"));
      }
    });
  });
}
