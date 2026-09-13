// ki-explained – gemeinsame Funktionen: Menü, Etappen-Navigation, Quiz,
// Akkordeon, Fortschritt

document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initEtappenWizard();
  initQuizFragen();
  initAkkordeon();
  markiereFortschritt();
});

/* ---------- Mobiles Menü ---------- */

function initMobileMenu() {
  var knopf = document.querySelector(".menu-knopf");
  var nav = document.querySelector(".hauptnav");
  if (!knopf || !nav) return;

  knopf.addEventListener("click", function () {
    var offen = nav.classList.toggle("offen");
    knopf.setAttribute("aria-expanded", offen ? "true" : "false");
  });
}

/* ---------- Fortschritt (nur lokal im Browser, keine Übertragung) ---------- */

function speichereKapitelBesucht(kapitelId) {
  try {
    var liste = JSON.parse(localStorage.getItem("kiExplainedBesucht") || "[]");
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

  try {
    var liste = JSON.parse(localStorage.getItem("kiExplainedBesucht") || "[]");
    document.querySelectorAll("[data-kapitel-link]").forEach(function (el) {
      var id = el.getAttribute("data-kapitel-link");
      if (liste.indexOf(id) !== -1) {
        el.classList.add("besucht");
      }
    });
  } catch (e) {
    /* ignorieren */
  }
}

/* ---------- Etappen-Wizard ----------
   Zeigt pro Kapitel jeweils nur eine ".etappe-inhalt"-Sektion an, damit
   man nicht durch die ganze Seite scrollen muss. Erwartetes Markup:
   <nav class="etappenleiste">
     <a class="etappe-punkt" href="#anker-1">…</a>
     <a class="etappe-punkt" href="#anker-2">…</a>
   </nav>
   <div class="etappe-inhalt">…Etappe 1…</div>
   <div class="etappe-inhalt">…Etappe 2…</div>
   Ohne JavaScript bleiben alle Etappen sichtbar (die Seite scrollt dann
   einfach länger, aber es geht nichts verloren).
*/

function initEtappenWizard() {
  document.querySelectorAll(".etappenleiste").forEach(function (leiste) {
    var eltern = leiste.parentElement;
    var etappen = Array.prototype.filter.call(eltern.children, function (el) {
      return el.classList && el.classList.contains("etappe-inhalt");
    });
    if (etappen.length === 0) return;

    var links = leiste.querySelectorAll(".etappe-punkt");

    var navLeiste = document.createElement("div");
    navLeiste.className = "etappen-schritt-nav";
    var zurueckKnopf = document.createElement("button");
    zurueckKnopf.type = "button";
    zurueckKnopf.className = "knopf sekundaer";
    zurueckKnopf.textContent = "← Zurück";
    var weiterKnopf = document.createElement("button");
    weiterKnopf.type = "button";
    weiterKnopf.className = "knopf";
    weiterKnopf.textContent = "Weiter →";
    navLeiste.appendChild(zurueckKnopf);
    navLeiste.appendChild(weiterKnopf);
    etappen[etappen.length - 1].insertAdjacentElement("afterend", navLeiste);

    var aktuell = 0;

    function zeigeEtappe(index, hochscrollen) {
      if (index < 0 || index >= etappen.length) return;
      aktuell = index;

      etappen.forEach(function (el, i) {
        el.classList.toggle("versteckt", i !== index);
      });
      links.forEach(function (link, i) {
        link.classList.toggle("aktiv", i === index);
        if (i === index) {
          link.setAttribute("aria-current", "step");
        } else {
          link.removeAttribute("aria-current");
        }
      });

      zurueckKnopf.classList.toggle("versteckt", aktuell === 0);
      weiterKnopf.classList.toggle("versteckt", aktuell === etappen.length - 1);

      if (hochscrollen) {
        etappen[index].scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    links.forEach(function (link, i) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        zeigeEtappe(i, true);
      });
    });

    zurueckKnopf.addEventListener("click", function () { zeigeEtappe(aktuell - 1, true); });
    weiterKnopf.addEventListener("click", function () { zeigeEtappe(aktuell + 1, true); });

    var startIndex = 0;
    if (location.hash) {
      var zielElement = document.getElementById(location.hash.substring(1));
      var wrapper = zielElement ? zielElement.closest(".etappe-inhalt") : null;
      var position = wrapper ? etappen.indexOf(wrapper) : -1;
      if (position !== -1) startIndex = position;
    }

    zeigeEtappe(startIndex, false);
  });
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
   Die Fragen werden nacheinander angezeigt statt alle auf einmal.
*/

function initQuizFragen() {
  var fragen = Array.prototype.slice.call(document.querySelectorAll(".frage"));
  if (fragen.length === 0) return;

  var punkteContainer = document.querySelectorAll("[data-quiz-punkte]");
  var gesamtContainer = document.querySelectorAll("[data-quiz-gesamt]");
  var punkte = 0;

  gesamtContainer.forEach(function (el) {
    el.textContent = fragen.length;
  });

  var vorhandenesErgebnis = document.querySelector(".quiz-ergebnis");
  if (vorhandenesErgebnis) {
    vorhandenesErgebnis.classList.add("versteckt");
  }

  var fortschritt = document.createElement("p");
  fortschritt.className = "uebung-fortschritt";
  fragen[0].parentElement.insertBefore(fortschritt, fragen[0]);

  function zeigeFrage(index) {
    fragen.forEach(function (f, i) {
      f.classList.toggle("versteckt", i !== index);
    });
    fortschritt.textContent = "Frage " + (index + 1) + " von " + fragen.length;
  }

  function zeigeAbschluss() {
    fragen.forEach(function (f) { f.classList.add("versteckt"); });
    fortschritt.classList.add("versteckt");

    if (vorhandenesErgebnis) {
      vorhandenesErgebnis.classList.remove("versteckt");
      return;
    }

    var ergebnisBox = document.createElement("div");
    ergebnisBox.className = "quiz-ergebnis";
    ergebnisBox.innerHTML =
      '<p style="margin-bottom:0.6rem">Ihr habt</p>' +
      '<span class="punktzahl">' + punkte + ' / ' + fragen.length + '</span>' +
      '<p style="margin-top:0.9rem; margin-bottom:0">richtig beantwortet. Diese Übung dient der eigenen Selbstkontrolle und hat keinen Einfluss auf eure Note.</p>';
    fragen[fragen.length - 1].insertAdjacentElement("afterend", ergebnisBox);
  }

  fragen.forEach(function (frage, position) {
    var richtigIndex = parseInt(frage.getAttribute("data-richtig"), 10);
    var knoepfe = frage.querySelectorAll(".antwort-knopf");
    var rueckmeldungRichtig = frage.querySelector(".rueckmeldung.richtig");
    var rueckmeldungFalsch = frage.querySelector(".rueckmeldung.falsch");
    var beantwortet = false;

    knoepfe.forEach(function (knopf, index) {
      knopf.addEventListener("click", function () {
        if (beantwortet) return;
        beantwortet = true;

        var istRichtig = index + 1 === richtigIndex;

        knoepfe.forEach(function (k, i) {
          k.disabled = true;
          if (i + 1 === richtigIndex) {
            k.classList.add("richtig");
          } else if (k === knopf) {
            k.classList.add("falsch");
          }
        });

        var aktiveRueckmeldung = istRichtig ? rueckmeldungRichtig : rueckmeldungFalsch;
        if (istRichtig) punkte++;

        if (aktiveRueckmeldung) {
          aktiveRueckmeldung.classList.add("zeigen");

          var weiterKnopf = document.createElement("button");
          weiterKnopf.type = "button";
          weiterKnopf.className = "knopf sekundaer";
          weiterKnopf.style.marginTop = "0.8rem";
          weiterKnopf.textContent = position + 1 < fragen.length ? "Nächste Frage" : "Ergebnis anzeigen";
          weiterKnopf.addEventListener("click", function () {
            if (position + 1 < fragen.length) {
              zeigeFrage(position + 1);
            } else {
              zeigeAbschluss();
            }
          });
          aktiveRueckmeldung.appendChild(weiterKnopf);
        }

        punkteContainer.forEach(function (el) {
          el.textContent = punkte;
        });

        frage.dispatchEvent(new CustomEvent("frage-beantwortet", { detail: { istRichtig: istRichtig } }));
      });
    });
  });

  zeigeFrage(0);
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
