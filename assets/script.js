// ki-explained – gemeinsame Funktionen: Menü, Quiz, Akkordeon, Fortschritt

/* Die Lernlandschaft-Erweiterung wird zentral geladen, damit alle bestehenden
   Seiten profitieren, ohne dass jedes Kapitel-Markup angepasst werden muss. */
(function ladeLernlandschaftStyles() {
  if (document.querySelector('link[data-lernlandschaft]')) return;

  var aktuellesScript = document.currentScript;
  if (!aktuellesScript || !aktuellesScript.src) return;

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('lernlandschaft.css', aktuellesScript.src).href;
  link.setAttribute('data-lernlandschaft', 'true');
  document.head.appendChild(link);
})();

document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initQuizFragen();
  initAkkordeon();
  markiereFortschritt();
  initEtappenNavigation();
  // The workshop homepage uses explicit self-assessment instead of page visits.
  initLesefortschritt();
  markiereAktiveNavigation();
});

/* ---------- Mobiles Menü ---------- */

function initMobileMenu() {
  var knopf = document.querySelector(".menu-knopf");
  var nav = document.querySelector(".hauptnav");
  if (!knopf || !nav) return;

  function setzeMenue(offen) {
    nav.classList.toggle("offen", offen);
    knopf.setAttribute("aria-expanded", offen ? "true" : "false");
    knopf.setAttribute("aria-label", offen ? "Menü schliessen" : "Menü öffnen");
  }

  knopf.addEventListener("click", function () {
    setzeMenue(!nav.classList.contains("offen"));
  });

  nav.addEventListener("click", function (ereignis) {
    if (ereignis.target.closest("a")) {
      setzeMenue(false);
    }
  });

  document.addEventListener("keydown", function (ereignis) {
    if (ereignis.key === "Escape" && nav.classList.contains("offen")) {
      setzeMenue(false);
      knopf.focus();
    }
  });
}

/* ---------- Fortschritt (nur lokal im Browser, keine Übertragung) ---------- */

function holeBesuchteKapitel() {
  try {
    var liste = JSON.parse(localStorage.getItem("kiExplainedBesucht") || "[]");
    return Array.isArray(liste) ? liste.map(String) : [];
  } catch (e) {
    return [];
  }
}

function speichereKapitelBesucht(kapitelId) {
  try {
    var liste = holeBesuchteKapitel();
    kapitelId = String(kapitelId);
    if (liste.indexOf(kapitelId) === -1) {
      liste.push(kapitelId);
      localStorage.setItem("kiExplainedBesucht", JSON.stringify(liste));
    }
  } catch (e) {
    /* localStorage evtl. nicht verfügbar – kein Problem, Fortschritt ist optional */
  }
}

function markiereFortschritt() {
  var kapitelId = document.body.getAttribute("data-kapitel");
  if (kapitelId) {
    speichereKapitelBesucht(kapitelId);
  }

  var liste = holeBesuchteKapitel();

  document.querySelectorAll("[data-kapitel-link]").forEach(function (el) {
    var id = el.getAttribute("data-kapitel-link");
    if (liste.indexOf(String(id)) !== -1) {
      el.classList.add("besucht");
    }
  });

  /* Auch die grossen Kapitelkarten auf der Startseite bekommen den Status. */
  document.querySelectorAll("a.kachel[href*='kapitel-']").forEach(function (el) {
    var treffer = el.getAttribute("href").match(/kapitel-(\d+)/);
    if (treffer && liste.indexOf(treffer[1]) !== -1) {
      el.classList.add("besucht");
    }
  });
}

function initLernstand() {
  var startseite = document.querySelector("main.breit");
  if (!startseite || document.body.hasAttribute("data-kapitel")) return;
  if (startseite.querySelector(".lernstand")) return;

  var einleitung = startseite.querySelector(".einleitungstext");
  if (!einleitung) return;

  var besucht = holeBesuchteKapitel().filter(function (id) {
    return ["1", "2", "3", "4"].indexOf(id) !== -1;
  });
  var anzahl = new Set(besucht).size;
  var prozent = Math.round((anzahl / 4) * 100);

  var text;
  if (anzahl === 0) {
    text = "Starte mit Kapitel 1 oder springe direkt zu dem Thema, das du wiederholen möchtest.";
  } else if (anzahl < 4) {
    text = "Dein Fortschritt wird nur lokal in diesem Browser gespeichert.";
  } else {
    text = "Alle vier Kapitel wurden besucht – jetzt eignet sich die Prüfungsvorbereitung.";
  }

  var box = document.createElement("div");
  box.className = "lernstand";
  box.setAttribute("role", "status");
  box.innerHTML =
    "<strong>Dein Lernstand</strong>" +
    "<span class=\"lernstand-text\">" + text + "</span>" +
    "<span class=\"lernstand-zahl\">" + anzahl + "/4</span>" +
    "<span class=\"lernstand-balken\" aria-hidden=\"true\"><span style=\"width:" + prozent + "%\"></span></span>";

  einleitung.insertAdjacentElement("afterend", box);
}

/* ---------- Aktive Navigation ---------- */

function markiereAktiveNavigation() {
  document.querySelectorAll(".hauptnav a.aktiv").forEach(function (link) {
    link.setAttribute("aria-current", "page");
  });
}

function initEtappenNavigation() {
  var links = Array.prototype.slice.call(document.querySelectorAll(".etappenleiste a[href^='#']"));
  if (!links.length) return;

  var eintraege = links.map(function (link) {
    var ziel = document.querySelector(link.getAttribute("href"));
    return ziel ? { link: link, ziel: ziel } : null;
  }).filter(Boolean);

  if (!eintraege.length) return;

  function aktiviere(link) {
    links.forEach(function (eintrag) {
      var aktiv = eintrag === link;
      eintrag.classList.toggle("aktiv", aktiv);
      if (aktiv) {
        eintrag.setAttribute("aria-current", "location");
      } else {
        eintrag.removeAttribute("aria-current");
      }
    });
  }

  aktiviere(eintraege[0].link);

  if ("IntersectionObserver" in window) {
    var beobachter = new IntersectionObserver(function (beobachtungen) {
      var sichtbar = beobachtungen
        .filter(function (beobachtung) { return beobachtung.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });

      if (!sichtbar.length) return;

      var eintrag = eintraege.find(function (item) {
        return item.ziel === sichtbar[0].target;
      });
      if (eintrag) aktiviere(eintrag.link);
    }, {
      rootMargin: "-18% 0px -68% 0px",
      threshold: 0
    });

    eintraege.forEach(function (eintrag) {
      beobachter.observe(eintrag.ziel);
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      aktiviere(link);
    });
  });
}

function initLesefortschritt() {
  if (!document.body.hasAttribute("data-kapitel")) return;

  var leiste = document.createElement("div");
  leiste.className = "lesefortschritt";
  leiste.setAttribute("aria-hidden", "true");
  leiste.innerHTML = "<span></span>";
  document.body.appendChild(leiste);

  var fuellung = leiste.firstElementChild;

  function aktualisieren() {
    var dokument = document.documentElement;
    var moeglich = dokument.scrollHeight - window.innerHeight;
    var anteil = moeglich > 0 ? Math.min(1, Math.max(0, window.scrollY / moeglich)) : 0;
    fuellung.style.width = (anteil * 100).toFixed(1) + "%";
  }

  aktualisieren();
  window.addEventListener("scroll", aktualisieren, { passive: true });
  window.addEventListener("resize", aktualisieren);
}

/* ---------- Selbsttest / Quiz ----------
   Erwartetes Markup pro Frage:
   <div class="frage" data-richtig="1">
     <p class="frage-text">…</p>
     <div class="antwort-liste">
       <button class="antwort-knopf">Option A</button>
       <button class="antwort-knopf">Option B</button>
     </div>
     <div class="rueckmeldung richtig">…</div>
     <div class="rueckmeldung falsch">…</div>
   </div>
   data-richtig ist der 1-basierte Index der richtigen Antwort.
*/

function initQuizFragen() {
  var fragen = document.querySelectorAll(".frage");
  var punkteContainer = document.querySelectorAll("[data-quiz-punkte]");
  var gesamtContainer = document.querySelectorAll("[data-quiz-gesamt]");
  var punkte = 0;

  gesamtContainer.forEach(function (el) {
    el.textContent = fragen.length;
  });

  fragen.forEach(function (frage) {
    var richtigIndex = parseInt(frage.getAttribute("data-richtig"), 10);
    var knoepfe = frage.querySelectorAll(".antwort-knopf");
    var rueckmeldungRichtig = frage.querySelector(".rueckmeldung.richtig");
    var rueckmeldungFalsch = frage.querySelector(".rueckmeldung.falsch");
    var beantwortet = false;
    [rueckmeldungRichtig, rueckmeldungFalsch].forEach(function (el) { if (el) el.setAttribute('role', 'status'); });
    var nochmal = document.createElement('button');
    nochmal.type = 'button'; nochmal.className = 'knopf sekundaer'; nochmal.textContent = 'Nochmals versuchen'; nochmal.hidden = true;
    frage.appendChild(nochmal);
    nochmal.addEventListener('click', function () {
      if (frage.dataset.punkt === '1') punkte--;
      delete frage.dataset.punkt; beantwortet = false;
      knoepfe.forEach(function (k) { k.disabled = false; k.classList.remove('richtig', 'falsch'); });
      [rueckmeldungRichtig, rueckmeldungFalsch].forEach(function (el) { if (el) el.classList.remove('zeigen'); });
      punkteContainer.forEach(function (el) { el.textContent = punkte; });
      nochmal.hidden = true; knoepfe[0].focus();
    });

    knoepfe.forEach(function (knopf, index) {
      knopf.addEventListener("click", function () {
        if (beantwortet) return;
        beantwortet = true; nochmal.hidden = false;

        var istRichtig = index + 1 === richtigIndex;

        knoepfe.forEach(function (k, i) {
          k.disabled = true;
          if (i + 1 === richtigIndex) {
            k.classList.add("richtig");
          } else if (k === knopf) {
            k.classList.add("falsch");
          }
        });

        if (istRichtig) {
          punkte++; frage.dataset.punkt = "1";
          if (rueckmeldungRichtig) rueckmeldungRichtig.classList.add("zeigen");
        } else {
          if (rueckmeldungFalsch) rueckmeldungFalsch.classList.add("zeigen");
        }

        punkteContainer.forEach(function (el) {
          el.textContent = punkte;
        });

        frage.dispatchEvent(new CustomEvent("frage-beantwortet", { detail: { istRichtig: istRichtig } }));
      });
    });
  });
}

/* ---------- Akkordeon (Karteikarten) ---------- */

function initAkkordeon() {
  document.querySelectorAll(".karteikarte-frage").forEach(function (knopf) {
    knopf.addEventListener("click", function () {
      var karte = knopf.closest(".karteikarte");
      var offen = karte.classList.toggle("offen");
      knopf.setAttribute("aria-expanded", offen ? "true" : "false");

      var antwort = karte.querySelector(".karteikarte-antwort");
      if (offen) {
        antwort.style.maxHeight = antwort.scrollHeight + "px";
      } else {
        antwort.style.maxHeight = "0";
      }
    });
  });
}
