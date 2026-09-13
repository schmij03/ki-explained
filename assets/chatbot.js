// ki-explained – einfacher regelbasierter Beispiel-Chatbot (Kapitel 2)
// Rein clientseitige Simulation nach dem klassischen Schlüsselwort-Prinzip
// (wie beim ELIZA-Bot von 1966). Keine echte KI, keine Verbindung zu einem
// Server oder einer KI-API.

(function () {
  var reflexionen = {
    "ich": "du", "mich": "dich", "mir": "dir",
    "mein": "dein", "meine": "deine", "meinen": "deinen", "meiner": "deiner",
    "bin": "bist", "war": "warst", "habe": "hast", "hatte": "hattest",
    "du": "ich", "dich": "mich", "dir": "mir",
    "dein": "mein", "deine": "meine", "deinen": "meinen", "deiner": "meiner"
  };

  function reflektiere(text) {
    return text
      .split(/\s+/)
      .map(function (wort) {
        var rein = wort.replace(/[.,!?]+$/, "");
        var ersetzt = reflexionen[rein.toLowerCase()];
        return ersetzt || wort;
      })
      .join(" ");
  }

  var musterRegeln = [
    { muster: /^ich bin (.+)/i, antwort: function (m) { return "Warum bist du " + reflektiere(m[1]) + "?"; } },
    { muster: /^ich fühle mich (.+)/i, antwort: function (m) { return "Warum fühlst du dich " + reflektiere(m[1]) + "?"; } },
    { muster: /^ich habe (.+)/i, antwort: function (m) { return "Seit wann hast du " + reflektiere(m[1]) + "?"; } },
    { muster: /^ich mag (.+)/i, antwort: function (m) { return "Was gefällt dir an " + reflektiere(m[1]) + "?"; } },
    { muster: /^ich will (.+)/i, antwort: function (m) { return "Warum willst du " + reflektiere(m[1]) + "?"; } },
    { muster: /^warum (.+)/i, antwort: function (m) { return "Was glaubst du selbst, warum " + reflektiere(m[1]) + "?"; } },
    { muster: /^kannst du (.+)/i, antwort: function () { return "Ich bin nur ein einfaches Beispielprogramm und kann das nicht wirklich beurteilen. Was denkst du?"; } }
  ];

  var schluesselwortRegeln = [
    { woerter: ["hallo", "hi ", "hey", "guten tag", "servus", "grüezi"], antworten: [
      "Hallo! Wie geht es dir heute?",
      "Hi! Worüber möchtest du sprechen?"
    ] },
    { woerter: ["ki", "computer", "roboter", "chatbot"], antworten: [
      "Interessant, dass du über Technik sprichst. Was denkst du darüber?",
      "Erzähl mir mehr über deine Erfahrungen damit."
    ] },
    { woerter: ["schule", "hausaufgabe", "prüfung", "test", "lehrer", "lehrerin"], antworten: [
      "Wie fühlst du dich in Bezug auf die Schule?",
      "Erzähl mir mehr davon."
    ] },
    { woerter: ["mutter", "vater", "familie", "eltern", "bruder", "schwester"], antworten: [
      "Erzähl mir mehr über deine Familie."
    ] },
    { woerter: ["traurig", "schlecht", "müde", "gestresst", "wütend"], antworten: [
      "Das tut mir leid, das zu hören. Magst du mehr erzählen?"
    ] },
    { woerter: ["gut", "super", "toll", "glücklich", "froh"], antworten: [
      "Das freut mich zu hören! Was genau macht dich froh?"
    ] }
  ];

  var standardAntworten = [
    "Erzähl mir mehr davon.",
    "Das ist interessant. Kannst du das genauer beschreiben?",
    "Wie fühlst du dich dabei?",
    "Ich verstehe. Und was denkst du selbst darüber?",
    "Kannst du das anders ausdrücken?"
  ];

  function generiereAntwort(text) {
    var bereinigt = text.trim().replace(/[.!]+$/, "");
    if (!bereinigt) {
      return "Magst du mir etwas erzählen?";
    }

    var textLower = bereinigt.toLowerCase();
    if (/^ja[.!]?$/.test(textLower)) return "Warum bist du dir da so sicher?";
    if (/^nein[.!]?$/.test(textLower)) return "Warum nicht?";

    for (var i = 0; i < musterRegeln.length; i++) {
      var treffer = bereinigt.match(musterRegeln[i].muster);
      if (treffer) return musterRegeln[i].antwort(treffer);
    }

    for (var j = 0; j < schluesselwortRegeln.length; j++) {
      var regel = schluesselwortRegeln[j];
      for (var k = 0; k < regel.woerter.length; k++) {
        if (textLower.indexOf(regel.woerter[k]) !== -1) {
          return regel.antworten[Math.floor(Math.random() * regel.antworten.length)];
        }
      }
    }

    return standardAntworten[Math.floor(Math.random() * standardAntworten.length)];
  }

  document.addEventListener("DOMContentLoaded", function () {
    var formular = document.getElementById("chatbot-formular");
    if (!formular) return;

    var eingabeFeld = document.getElementById("chatbot-eingabe");
    var verlauf = document.getElementById("chatbot-verlauf");

    function fuegeNachrichtHinzu(text, absender) {
      var blase = document.createElement("div");
      blase.className = "chat-blase " + absender;
      blase.textContent = text;
      verlauf.appendChild(blase);
      verlauf.scrollTop = verlauf.scrollHeight;
    }

    fuegeNachrichtHinzu(
      "Hallo! Ich bin ein einfacher Beispiel-Chatbot nach dem klassischen Schlüsselwort-Prinzip. Schreib mir etwas!",
      "bot"
    );

    formular.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = eingabeFeld.value;
      if (!text.trim()) return;
      eingabeFeld.value = "";
      fuegeNachrichtHinzu(text, "nutzer");
      var antwort = generiereAntwort(text);
      window.setTimeout(function () {
        fuegeNachrichtHinzu(antwort, "bot");
      }, 350);
    });
  });
})();
