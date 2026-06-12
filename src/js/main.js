// Druppels van Sakīnah — hoofdmodule
import "../css/tokens.css";
import "../css/base.css";
import "../css/sections.css";
import "../css/scenes.css";

import { renderAlles } from "./render.js";
import { startHeroAnimatie } from "./hero-anim.js";
import { bouwKoepel } from "./koepel.js";
import {
  startReveals,
  startTeller,
  startTeamBalken,
  startDruppelraster,
  startHeader,
  startStickyCta,
  startLazyVideos,
  plaatsGolfDividers,
} from "./motion.js";
import { startIbanKopieren, startBedragKiezen, startFaq } from "./interactions.js";

// 1. Data de pagina in
renderAlles();
plaatsGolfDividers();

// 2. De twee SVG-scènes
startHeroAnimatie();
bouwKoepel();

// 3. Choreografie & interactie
startReveals();
startTeller();
startTeamBalken();
startDruppelraster();
startHeader();
startStickyCta();
startLazyVideos();
startIbanKopieren();
startBedragKiezen();
startFaq();
