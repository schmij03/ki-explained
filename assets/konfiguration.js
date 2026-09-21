'use strict';
// Einzige Freischaltung: am 13.01.2027 auf true setzen und veröffentlichen.
window.kiExplainedKonfiguration = Object.freeze({ vertiefungSichtbar: true });
const vertiefungSichtbar = window.kiExplainedKonfiguration.vertiefungSichtbar;
document.documentElement.classList.add(vertiefungSichtbar ? 'vertiefung-offen' : 'vertiefung-gesperrt');
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-freischaltung]').forEach(el => { el.hidden = !vertiefungSichtbar; });
  if (!document.body.hasAttribute('data-vertiefung')) return;
  const main = document.querySelector('main');
  const notice = document.querySelector('.freischaltung');
  if (vertiefungSichtbar) notice.remove();
  else {
    // Vor Journal und Lernschritt-Navigation ausführen; keine versteckten Felder initialisieren.
    main.replaceChildren(notice);
    document.body.dataset.vertiefungGesperrt = 'true';
  }
});
