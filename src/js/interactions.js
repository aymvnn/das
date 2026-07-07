// Interacties: IBAN kopiëren, doneren (één tik), QR naar de betaalpagina, FAQ,
// videovoorbeeld-carrousel.
import { campagne } from "../../data/campagne.js";
import { t, tf, taal } from "./i18n.js";

/* --- Taalgevoelige video-varianten (bv. story-1 heeft een Arabische inspreek-
   /tekstversie). Kaarten zonder -ar-attributen vallen gewoon terug op de
   standaardwaarde. --- */
function huidigeBron(kaart) {
  return taal() === "ar" && kaart.dataset.srcAr ? kaart.dataset.srcAr : kaart.dataset.src;
}
function huidigePoster(kaart) {
  return taal() === "ar" && kaart.dataset.posterAr ? kaart.dataset.posterAr : kaart.dataset.poster;
}
function huidigBestand(kaart) {
  return taal() === "ar" && kaart.dataset.bestandAr ? kaart.dataset.bestandAr : kaart.dataset.bestand;
}

/* Ververst de zichtbare kaart-posters na een taalwissel (bv. story-1-AR). */
export function ververVideoPosters() {
  document.querySelectorAll("[data-video-kaart]").forEach((kaart) => {
    const img = kaart.querySelector("img");
    if (img) img.src = huidigePoster(kaart);
  });
}

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
      meld(t("doneren.bedragFout"), true);
      eigenInput?.focus();
      return;
    }
    if (bezig) return;
    bezig = true;
    meld(t("doneren.bezig"));

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
      meld(t("doneren.foutMelding"), true);
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

/* --- Campagnevideo-carrousel: bekijken, delen via WhatsApp, downloaden ---
   Elke kaart draagt zijn eigen bron/poster/bestandsnaam/titel-sleutel in
   data-attributen. Tikken opent een story-achtige lightbox met de video; van
   daaruit kan direct gedeeld (Web Share met het echte bestand — de sharesheet
   biedt WhatsApp als optie — met een download+wa.me-terugval waar dat niet
   kan) of gedownload worden. De rail scrollt native (swipe/scrollbar); de
   pijlen zijn een extra, geen vervanging. --- */
export function startVideoCarrousel() {
  const rail = document.querySelector("[data-video-carrousel]");
  const lightbox = document.querySelector("[data-video-lightbox]");
  if (!rail || !lightbox) return;

  const kaarten = Array.from(rail.querySelectorAll("[data-video-kaart]"));
  if (!kaarten.length) return;

  ververVideoPosters(); // meteen de juiste taalvariant tonen (bv. bij direct laden in AR)

  const vorigeBtn = document.querySelector("[data-carrousel-prev]");
  const volgendeBtn = document.querySelector("[data-carrousel-next]");
  const scroll = (richting) => {
    const stap = (kaarten[0]?.offsetWidth || 150) + 16;
    rail.scrollBy({ left: richting * stap, behavior: "smooth" });
  };
  vorigeBtn?.addEventListener("click", () => scroll(-1));
  volgendeBtn?.addEventListener("click", () => scroll(1));

  const updatePijlen = () => {
    if (!vorigeBtn || !volgendeBtn) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth - 2;
    vorigeBtn.hidden = rail.scrollLeft <= 2;
    volgendeBtn.hidden = rail.scrollLeft >= maxScroll;
  };
  rail.addEventListener("scroll", updatePijlen, { passive: true });
  window.addEventListener("resize", updatePijlen);
  updatePijlen();

  const video = lightbox.querySelector("[data-video-lightbox-el]");
  const titelEl = lightbox.querySelector("[data-video-lightbox-titel]");
  const deelBtn = lightbox.querySelector("[data-video-lightbox-deel]");
  const downloadLink = lightbox.querySelector("[data-video-lightbox-download]");
  const sluitEls = lightbox.querySelectorAll("[data-video-lightbox-close]");
  const prevBtn = lightbox.querySelector("[data-video-lightbox-prev]");
  const nextBtn = lightbox.querySelector("[data-video-lightbox-next]");

  let huidige = 0;
  let laatstGefocust = null;

  async function deelVideo(src, bestandsnaam, titel) {
    const tekst = tf("js.deelVideoTekst", { titel, url: `${location.origin}${src}` });

    if (navigator.share && navigator.canShare) {
      try {
        const resp = await fetch(src);
        const blob = await resp.blob();
        const file = new File([blob], bestandsnaam, { type: blob.type || "video/mp4" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: tekst });
          return;
        }
      } catch (err) {
        if (err && err.name === "AbortError") return; // gebruiker annuleerde zelf
        // anders: val terug op onderstaande route (bv. desktop zonder file-share)
      }
    }

    const a = document.createElement("a");
    a.href = src;
    a.download = bestandsnaam;
    document.body.append(a);
    a.click();
    a.remove();
    window.open(`https://wa.me/?text=${encodeURIComponent(tekst)}`, "_blank", "noopener");
  }

  function laadKaart(index) {
    huidige = (index + kaarten.length) % kaarten.length;
    const kaart = kaarten[huidige];
    const src = huidigeBron(kaart);
    const bestand = huidigBestand(kaart);
    const titel = t(kaart.dataset.titelKey);

    video.pause();
    video.setAttribute("poster", huidigePoster(kaart));
    video.src = src;
    video.load();
    video.play().catch(() => {});

    titelEl.textContent = titel;
    downloadLink.href = src;
    downloadLink.setAttribute("download", bestand);
    deelBtn.onclick = () => deelVideo(src, bestand, titel);
  }

  function toetsen(e) {
    if (e.key === "Escape") {
      sluit();
      return;
    }
    if (e.key === "ArrowRight") {
      laadKaart(huidige + (document.documentElement.dir === "rtl" ? -1 : 1));
      return;
    }
    if (e.key === "ArrowLeft") {
      laadKaart(huidige + (document.documentElement.dir === "rtl" ? 1 : -1));
      return;
    }
    if (e.key === "Tab") {
      const lijst = Array.from(lightbox.querySelectorAll("button, a[href]")).filter(
        (el) => !el.hidden,
      );
      if (!lijst.length) return;
      const eerste = lijst[0];
      const laatste = lijst[lijst.length - 1];
      if (e.shiftKey && document.activeElement === eerste) {
        e.preventDefault();
        laatste.focus();
      } else if (!e.shiftKey && document.activeElement === laatste) {
        e.preventDefault();
        eerste.focus();
      }
    }
  }

  function open(index) {
    laatstGefocust = document.activeElement;
    laadKaart(index);
    lightbox.hidden = false;
    document.documentElement.classList.add("geen-scroll");
    sluitEls[0]?.focus();
    document.addEventListener("keydown", toetsen);
  }

  function sluit() {
    lightbox.hidden = true;
    video.pause();
    video.removeAttribute("src");
    video.load();
    document.documentElement.classList.remove("geen-scroll");
    document.removeEventListener("keydown", toetsen);
    laatstGefocust?.focus();
  }

  kaarten.forEach((kaart, i) => kaart.addEventListener("click", () => open(i)));
  sluitEls.forEach((el) => el.addEventListener("click", sluit));
  prevBtn?.addEventListener("click", () => laadKaart(huidige - 1));
  nextBtn?.addEventListener("click", () => laadKaart(huidige + 1));
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
