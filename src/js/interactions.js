// Interacties: IBAN kopiëren, doneren (één tik), QR naar de betaalpagina, FAQ.
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

/* --- Doneren in ÉÉN tik ---
   Klik op een bedrag (of vul een eigen bedrag in) en je gaat meteen naar de
   beveiligde betaalpagina:
     • Vaste betaallink in campagne.idealLink? Daarheen (met het bedrag erin).
     • Anders maken we via /api/create-checkout een Stripe Checkout-sessie en
       sturen we direct door naar iDEAL/creditcard.
   Lukt online betalen niet, dan wijst de melding naar de IBAN eronder. --- */
export function startBedragKiezen() {
  const groep = document.querySelector("[data-bedrag-keuze]");
  const eigenForm = document.querySelector("[data-bedrag-eigen-form]");
  const eigenInput = document.querySelector("[data-bedrag-eigen]");
  const status = document.querySelector("[data-doneer-status]");
  const link = (campagne.idealLink || "").trim();
  let bezig = false;

  const meld = (tekst, isFout = false) => {
    if (!status) return;
    status.textContent = tekst || "";
    status.hidden = !tekst;
    status.classList.toggle("is-fout", isFout);
  };

  async function doneer(euroRuw) {
    const euro = Math.round(Number(euroRuw) || 0);
    if (!(euro >= 1 && euro <= 100000)) {
      meld("Vul een bedrag van minimaal € 1 in.", true);
      eigenInput?.focus();
      return;
    }
    if (bezig) return;
    bezig = true;
    meld("Je wordt doorgestuurd naar de beveiligde betaalpagina…");

    // Tier A — vaste betaallink (bijv. een Stripe Payment Link met bedrag)
    if (link) {
      window.location.href = link
        .replace(/\{bedrag\}/g, String(euro))
        .replace(/\{centen\}/g, String(euro * 100));
      return;
    }

    // Tier B — Stripe Checkout via onze eigen API
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cents: euro * 100 }),
      });
      const data = await res.json().catch(() => ({}));
      if (data && data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("geen betaal-URL");
    } catch {
      bezig = false;
      meld(
        "Online doneren lukt nu even niet. Je kunt je druppel ook overmaken via de IBAN hieronder — alvast bedankt.",
        true,
      );
    }
  }

  if (groep) {
    groep.querySelectorAll("[data-bedrag-chip]").forEach((chip) => {
      chip.addEventListener("click", () => doneer(chip.dataset.euro));
    });
  }
  if (eigenForm) {
    eigenForm.addEventListener("submit", (e) => {
      e.preventDefault();
      doneer(eigenInput && eigenInput.value);
    });
  }
}

/* --- QR-code naar de betaalpagina (voor wie op de pc kijkt en met de
   telefoon wil betalen). Wijst naar de Stripe Payment Link als die is
   ingevuld, anders naar de doneer-sectie van de site (zelfde origin, dus
   werkt op elk domein). Lazy: de QR-generator wordt pas geladen als nodig. --- */
export async function startQrDoneren() {
  const el = document.querySelector("[data-qr-doneren]");
  if (!el) return;
  const doel = (campagne.stripePaymentLink || "").trim() || `${location.origin}/#doneren`;
  try {
    const QRCode = (await import("qrcode")).default;
    el.innerHTML = await QRCode.toString(doel, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#1f2c54", light: "#ffffff" },
    });
  } catch {
    const blok = el.closest(".qr-doneren");
    if (blok) blok.hidden = true;
  }
}

/* --- FAQ: vloeiend open- en dichtvouwen --- */
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
