// Interacties: IBAN kopiëren, doneren (één tik), QR naar de betaalpagina, FAQ,
// videovoorbeeld-carrousel.
import { campagne } from "../../data/campagne.js";
import { t, tf, taal } from "./i18n.js";

/* --- Taalgevoelige video-varianten (bv. story-1 heeft een Arabische inspreek-
   /tekstversie). Kaarten zonder -ar-attributen vallen gewoon terug op de
   standaardwaarde. --- */
function huidigeBron(kaart: HTMLElement): string | undefined {
  return taal() === "ar" && kaart.dataset.srcAr ? kaart.dataset.srcAr : kaart.dataset.src;
}
function huidigePoster(kaart: HTMLElement): string | undefined {
  return taal() === "ar" && kaart.dataset.posterAr ? kaart.dataset.posterAr : kaart.dataset.poster;
}
function huidigBestand(kaart: HTMLElement): string | undefined {
  return taal() === "ar" && kaart.dataset.bestandAr ? kaart.dataset.bestandAr : kaart.dataset.bestand;
}

/* Ververst de zichtbare kaart-posters na een taalwissel (bv. story-1-AR). */
export function ververVideoPosters(): void {
  document.querySelectorAll<HTMLElement>("[data-video-kaart]").forEach((kaart) => {
    const img: HTMLImageElement | null = kaart.querySelector("img");
    if (img) img.src = huidigePoster(kaart) ?? "";
  });
}

/* --- IBAN kopiëren met bevestiging --- */
export function startIbanKopieren(): void {
  const knop: HTMLElement | null = document.querySelector<HTMLElement>("[data-kopieer-iban]");
  if (!knop) return;
  const tekst: HTMLElement | null = knop.querySelector<HTMLElement>(".kopieer-tekst");
  const ok: HTMLElement | null = knop.querySelector<HTMLElement>(".kopieer-ok");
  if (!tekst || !ok) return;

  knop.addEventListener("click", async () => {
    const iban: string = campagne.iban.replace(/\s+/g, " ").trim();
    try {
      await navigator.clipboard.writeText(iban);
    } catch {
      const veld: HTMLTextAreaElement = document.createElement("textarea");
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

interface CheckoutResponse {
  url?: string;
  error?: string;
}

/* --- Doneren in ÉÉN tik ---
   Klik op een bedrag (of vul een eigen bedrag in) en je gaat meteen naar de
   beveiligde betaalpagina:
     • Vaste betaallink in campagne.idealLink? Daarheen (met het bedrag erin).
     • Anders maken we via /api/create-checkout een Stripe Checkout-sessie en
       sturen we direct door naar iDEAL/creditcard.
   Lukt online betalen niet, dan wijst de melding naar de IBAN eronder. --- */
export function startBedragKiezen(): void {
  const groep: HTMLElement | null = document.querySelector<HTMLElement>("[data-bedrag-keuze]");
  const eigenForm: HTMLFormElement | null = document.querySelector<HTMLFormElement>("[data-bedrag-eigen-form]");
  const eigenInput: HTMLInputElement | null = document.querySelector<HTMLInputElement>("[data-bedrag-eigen]");
  const status: HTMLElement | null = document.querySelector<HTMLElement>("[data-doneer-status]");
  const link: string = (campagne.idealLink || "").trim();
  let bezig: boolean = false;

  const meld = (tekst: string, isFout: boolean = false): void => {
    if (!status) return;
    status.textContent = tekst || "";
    status.hidden = !tekst;
    status.classList.toggle("is-fout", isFout);
  };

  async function doneer(euroRuw: string | undefined): Promise<void> {
    const euro: number = Math.round(Number(euroRuw) || 0);
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
      const res: Response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cents: euro * 100 }),
      });
      const data: CheckoutResponse = await res.json().catch(() => ({}));
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
    groep.querySelectorAll<HTMLElement>("[data-bedrag-chip]").forEach((chip) => {
      chip.addEventListener("click", () => doneer(chip.dataset.euro));
    });
  }
  if (eigenForm) {
    eigenForm.addEventListener("submit", (e) => {
      e.preventDefault();
      doneer(eigenInput?.value);
    });
  }
}

/* --- QR-code naar de betaalpagina (voor wie op de pc kijkt en met de
   telefoon wil betalen). Wijst naar de Stripe Payment Link als die is
   ingevuld, anders naar de doneer-sectie van de site (zelfde origin, dus
   werkt op elk domein). Lazy: de QR-generator wordt pas geladen als nodig. --- */
export async function startQrDoneren(): Promise<void> {
  const el: HTMLElement | null = document.querySelector<HTMLElement>("[data-qr-doneren]");
  if (!el) return;
  const doel: string = (campagne.stripePaymentLink || "").trim() || `${location.origin}/#doneren`;
  try {
    const QRCode = (await import("qrcode")).default;
    el.innerHTML = await QRCode.toString(doel, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#1f2c54", light: "#ffffff" },
    });
  } catch {
    const blok: HTMLElement | null = el.closest<HTMLElement>(".qr-doneren");
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
export function startVideoCarrousel(): void {
  const rail: HTMLElement | null = document.querySelector<HTMLElement>("[data-video-carrousel]");
  const lightbox: HTMLElement | null = document.querySelector<HTMLElement>("[data-video-lightbox]");
  if (!rail || !lightbox) return;

  const kaarten: HTMLElement[] = Array.from(rail.querySelectorAll<HTMLElement>("[data-video-kaart]"));
  if (!kaarten.length) return;

  ververVideoPosters(); // meteen de juiste taalvariant tonen (bv. bij direct laden in AR)

  const vorigeBtn: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("[data-carrousel-prev]");
  const volgendeBtn: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("[data-carrousel-next]");
  const scroll = (richting: number): void => {
    const stap: number = (kaarten[0]?.offsetWidth || 150) + 16;
    rail.scrollBy({ left: richting * stap, behavior: "smooth" });
  };
  vorigeBtn?.addEventListener("click", () => scroll(-1));
  volgendeBtn?.addEventListener("click", () => scroll(1));

  const updatePijlen = (): void => {
    if (!vorigeBtn || !volgendeBtn) return;
    const maxScroll: number = rail.scrollWidth - rail.clientWidth - 2;
    vorigeBtn.hidden = rail.scrollLeft <= 2;
    volgendeBtn.hidden = rail.scrollLeft >= maxScroll;
  };
  rail.addEventListener("scroll", updatePijlen, { passive: true });
  window.addEventListener("resize", updatePijlen);
  updatePijlen();

  const video: HTMLVideoElement | null = lightbox.querySelector<HTMLVideoElement>("[data-video-lightbox-el]");
  const titelEl: HTMLElement | null = lightbox.querySelector<HTMLElement>("[data-video-lightbox-titel]");
  const deelBtn: HTMLButtonElement | null = lightbox.querySelector<HTMLButtonElement>("[data-video-lightbox-deel]");
  const downloadLink: HTMLAnchorElement | null = lightbox.querySelector<HTMLAnchorElement>(
    "[data-video-lightbox-download]",
  );
  const sluitEls: NodeListOf<HTMLElement> = lightbox.querySelectorAll<HTMLElement>("[data-video-lightbox-close]");
  const prevBtn: HTMLButtonElement | null = lightbox.querySelector<HTMLButtonElement>("[data-video-lightbox-prev]");
  const nextBtn: HTMLButtonElement | null = lightbox.querySelector<HTMLButtonElement>("[data-video-lightbox-next]");
  if (!video || !titelEl || !deelBtn || !downloadLink) return;
  // Hernoemd naar niet-nullable bindingen: TS narrowt de guard hierboven niet
  // door in de geneste function-declarations verderop (laadKaart, toetsen, …).
  const lightboxEl: HTMLElement = lightbox;
  const videoEl: HTMLVideoElement = video;
  const titelElement: HTMLElement = titelEl;
  const deelKnop: HTMLButtonElement = deelBtn;
  const downloadEl: HTMLAnchorElement = downloadLink;

  let huidige: number = 0;
  let laatstGefocust: HTMLElement | null = null;

  async function deelVideo(src: string, bestandsnaam: string, titel: string): Promise<void> {
    const tekst: string = tf("js.deelVideoTekst", { titel, url: `${location.origin}${src}` });

    if (navigator.share && navigator.canShare) {
      try {
        const resp: Response = await fetch(src);
        const blob: Blob = await resp.blob();
        const file: File = new File([blob], bestandsnaam, { type: blob.type || "video/mp4" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: tekst });
          return;
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return; // gebruiker annuleerde zelf
        // anders: val terug op onderstaande route (bv. desktop zonder file-share)
      }
    }

    const a: HTMLAnchorElement = document.createElement("a");
    a.href = src;
    a.download = bestandsnaam;
    document.body.append(a);
    a.click();
    a.remove();
    window.open(`https://wa.me/?text=${encodeURIComponent(tekst)}`, "_blank", "noopener");
  }

  function laadKaart(index: number): void {
    huidige = (index + kaarten.length) % kaarten.length;
    const kaart: HTMLElement | undefined = kaarten[huidige];
    if (!kaart) return;
    const src: string = huidigeBron(kaart) ?? "";
    const bestand: string = huidigBestand(kaart) ?? "";
    const titel: string = t(kaart.dataset.titelKey ?? "");

    videoEl.pause();
    videoEl.setAttribute("poster", huidigePoster(kaart) ?? "");
    videoEl.src = src;
    videoEl.load();
    videoEl.play().catch(() => {});

    titelElement.textContent = titel;
    downloadEl.href = src;
    downloadEl.setAttribute("download", bestand);
    deelKnop.onclick = () => deelVideo(src, bestand, titel);
  }

  function toetsen(e: KeyboardEvent): void {
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
      const lijst: HTMLElement[] = Array.from(
        lightboxEl.querySelectorAll<HTMLElement>("button, a[href]"),
      ).filter((el) => !el.hidden);
      if (!lijst.length) return;
      const eerste: HTMLElement | undefined = lijst[0];
      const laatste: HTMLElement | undefined = lijst[lijst.length - 1];
      if (!eerste || !laatste) return;
      if (e.shiftKey && document.activeElement === eerste) {
        e.preventDefault();
        laatste.focus();
      } else if (!e.shiftKey && document.activeElement === laatste) {
        e.preventDefault();
        eerste.focus();
      }
    }
  }

  function open(index: number): void {
    const actief: Element | null = document.activeElement;
    laatstGefocust = actief instanceof HTMLElement ? actief : null;
    laadKaart(index);
    lightboxEl.hidden = false;
    document.documentElement.classList.add("geen-scroll");
    sluitEls[0]?.focus();
    document.addEventListener("keydown", toetsen);
  }

  function sluit(): void {
    lightboxEl.hidden = true;
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();
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
export function startFaq(): void {
  document.querySelectorAll<HTMLDetailsElement>(".faq-item").forEach((item) => {
    const body: HTMLElement | null = item.querySelector<HTMLElement>(".faq-body");
    if (!body) return;
    const wrapper: HTMLDivElement = document.createElement("div");
    wrapper.className = "faq-wrapper";
    body.replaceWith(wrapper);
    wrapper.append(body);

    const summary: HTMLElement | null = item.querySelector<HTMLElement>("summary");
    if (!summary) return;
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
