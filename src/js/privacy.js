// Privacypagina: alleen stijlen, logo en maillink.
import "../css/tokens.css";
import "../css/base.css";
import "../css/sections.css";
import "../css/scenes.css";

import { campagne } from "../../data/campagne.js";
import { logoMarkup, VIEWBOX_W, VIEWBOX_H } from "./logo-paths.js";

const mini = document.querySelector("[data-logo-mini]");
if (mini) {
  mini.innerHTML = `<svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" aria-hidden="true">${logoMarkup()}</svg>`;
}
document.querySelectorAll("[data-mail-contact]").forEach((el) => {
  el.href = `mailto:${campagne.contactEmail}?subject=${encodeURIComponent("Privacy — Druppels van Sakīnah")}`;
  el.textContent = campagne.contactEmail;
});
