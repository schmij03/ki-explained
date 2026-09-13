// ki-explained – gemeinsame Funktionen: Menü, Quiz, Akkordeon, Fortschritt

document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
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

        if (istRichtig) {
          punkte++;
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
