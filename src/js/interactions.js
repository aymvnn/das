// Interacties: IBAN kopiëren, FAQ-accordeon.
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
