'use strict';
// All exercises and journal data stay in the browser. No network requests.
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.vertiefungGesperrt) return;
  const key = 'kiExplainedWerkstattV1';
  let state = { notes: {}, done: {} };
  let storageOK = true;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      if (saved.notes && typeof saved.notes === 'object' && !Array.isArray(saved.notes)) state.notes = saved.notes;
      if (saved.done && typeof saved.done === 'object' && !Array.isArray(saved.done)) state.done = saved.done;
    }
    localStorage.setItem(key, JSON.stringify(state));
  } catch (_) { storageOK = false; }
  const status = () => document.querySelectorAll('.speicherstatus').forEach(el => {
    el.textContent = storageOK ? 'In diesem Browser gespeichert. Kein Versand an eine KI.' : 'Speichern im Browser ist nicht möglich. Lade dein Journal vor dem Schliessen herunter.';
  });
  const save = () => {
    try { localStorage.setItem(key, JSON.stringify(state)); storageOK = true; }
    catch (_) { storageOK = false; }
    status();
  };
  const progress = () => {
    document.querySelectorAll('[data-status]').forEach(el => {
      el.textContent = state.done[el.dataset.status] === true ? '✓ Selbst als bearbeitet markiert' : 'Noch offen';
    });
    const target = document.querySelector('#abschlussstand');
    if (target) target.textContent = `${[1,2,3,4].filter(i => state.done[i] === true).length} von 4 Kapiteln selbst als bearbeitet markiert.`;
  };
  const journalValue = el => el.type === 'checkbox' ? (el.checked ? 'ja' : 'nein') : el.value;
  document.querySelectorAll('[data-journal]').forEach(el => {
    const value = state.notes[el.dataset.journal];
    if (el.type === 'checkbox') el.checked = value === 'ja';
    else if (typeof value === 'string') el.value = value;
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => {
      state.notes[el.dataset.journal] = journalValue(el); save();
    });
  });
  document.querySelectorAll('[data-erledigt]').forEach(el => {
    el.checked = state.done[el.dataset.erledigt] === true;
    el.addEventListener('change', () => { state.done[el.dataset.erledigt] = el.checked; save(); progress(); });
  });
  const labels = {'transfer-1':'Kapitel 1 – Datenvergleich','transfer-2':'Kapitel 2 – Antworten beurteilen','transfer-3':'Kapitel 3 – Kreativer Vergleich','transfer-4':'Kapitel 4 – Faire Klassenregel','projekt-test':'Projekt – Test und Überarbeitung',obst:'Kapitel 1 – Trainingsdaten',tokens:'Kapitel 2 – Wortvorhersage','prompt-ziel':'Prompt – Ziel','prompt-kontext':'Prompt – Kontext','prompt-format':'Prompt – Format','prompt-revision':'Kapitel 3 – Verbesserter Prompt',verantwortung:'Kapitel 4 – Verantwortung',projekt:'Abschlussprojekt'};
  const vertiefungLabels = {
    "vertiefung-1-schnell": "Was wurde schnell erkannt, was nicht? Nenne je ein Beispiel.",
    "vertiefung-1-katze": "Woher kennt das Modell mögliche Katzenformen? Deine Vermutung.",
    "vertiefung-1-klassen": "Deine drei Klassen und Anzahl Bilder pro Klasse",
    "vertiefung-1-test": "Neuer Testgegenstand, vorhergesagte Klasse und angezeigte Sicherheit in Prozent",
    "vertiefung-1-fehler-1-aenderung": "Fehlerfall 1: Was habe ich verändert?",
    "vertiefung-1-fehler-1-reaktion": "Fehlerfall 1: Was hat das Modell getan? Klasse und Prozentanzeige.",
    "vertiefung-1-fehler-1-ursache": "Fehlerfall 1: Warum vermutlich? Nenne eine mögliche Ursache.",
    "vertiefung-1-fehler-2-aenderung": "Fehlerfall 2: Was habe ich verändert?",
    "vertiefung-1-fehler-2-reaktion": "Fehlerfall 2: Was hat das Modell getan? Klasse und Prozentanzeige.",
    "vertiefung-1-fehler-2-ursache": "Fehlerfall 2: Warum vermutlich? Nenne eine mögliche Ursache.",
    "vertiefung-1-vergleich-1-vorher": "Fall 1: vorher",
    "vertiefung-1-vergleich-1-nachher": "Fall 1: nachher",
    "vertiefung-1-vergleich-2-vorher": "Fall 2: vorher",
    "vertiefung-1-vergleich-2-nachher": "Fall 2: nachher",
    "vertiefung-1-verbesserung": "Welche Daten hast du ergänzt? Begründe in einem Satz, warum das hilft.",
    "vertiefung-1-kernsatz": "Formuliere den Kernsatz in eigenen Worten.",
    "vertiefung-1-verbindung": "Was haben Obstlabor und Bildmodell gemeinsam? Wo liegt ein Unterschied?",
    "vertiefung-1-exit": "Exit-Ticket: Nenne einen Fehlergrund und eine Massnahme dagegen.",
    "vertiefung-1-bonus": "Was hat der zusätzliche Test gezeigt?",
    "vertiefung-1-ziel-1": "Drei Klassen trainieren und neu testen",
    "vertiefung-1-ziel-2": "Fehler untersuchen und Ursachen nennen",
    "vertiefung-1-ziel-3": "Einfluss der Trainingsdaten begründen",
    "vertiefung-2-wahl-a": "Station A gewählt",
    "vertiefung-2-wahl-b": "Station B gewählt",
    "vertiefung-2-wahl-c": "Station C gewählt",
    "vertiefung-2-wahl-d": "Station D gewählt",
    "vertiefung-2-a-vergleich": "Drei Durchläufe: Wortfolgenlänge, Zufall, kurzer Ausschnitt und Beobachtung",
    "vertiefung-2-a-training": "Deine fünf Trainingssätze und eine Veränderung nach dem Training",
    "vertiefung-2-b-daten": "Welche Beispiele hast du gewählt oder weggelassen? Was wurde besser oder schlechter?",
    "vertiefung-2-c-begriff-1": "Begriff 1: Was gezeichnet? Erkannt wann oder nicht erkannt?",
    "vertiefung-2-c-begriff-2": "Begriff 2: Was gezeichnet? Erkannt wann oder nicht erkannt?",
    "vertiefung-2-c-begriff-3": "Begriff 3: Was gezeichnet? Erkannt wann oder nicht erkannt?",
    "vertiefung-2-c-begriff-4": "Begriff 4: Was gezeichnet? Erkannt wann oder nicht erkannt?",
    "vertiefung-2-c-begriff-5": "Begriff 5: Was gezeichnet? Erkannt wann oder nicht erkannt?",
    "vertiefung-2-c-begriff-6": "Begriff 6: Was gezeichnet? Erkannt wann oder nicht erkannt?",
    "vertiefung-2-c-ungewoehnlich": "Was war an deiner Zeichnung ungewöhnlich? Vergleiche mit Beispielen aus der Datensammlung.",
    "vertiefung-2-d-runde-1": "Runde 1: Wer gewinnt? Was fällt an den Zügen auf?",
    "vertiefung-2-d-runde-2": "Runde 2: Wer gewinnt? Was fällt an den Zügen auf?",
    "vertiefung-2-d-runde-3": "Runde 3: Wer gewinnt? Was fällt an den Zügen auf?",
    "vertiefung-2-d-runde-4": "Runde 4: Wer gewinnt? Was fällt an den Zügen auf?",
    "vertiefung-2-d-runde-5": "Runde 5: Wer gewinnt? Was fällt an den Zügen auf?",
    "vertiefung-2-a-versuch": "Was haben wir ausprobiert? Zwei Sätze.",
    "vertiefung-2-a-beispiel": "Was ist uns aufgefallen? Ein Beispiel.",
    "vertiefung-2-a-leitfrage": "Antwort auf die Leitfrage: ein bis zwei Sätze.",
    "vertiefung-2-a-chance-risiko": "Eine Chance und ein Risiko: Welche Daten braucht die Anwendung und wie schützt du persönliche Daten?",
    "vertiefung-2-a-bonus": "Bonus: Was würdest du verbessern? Woran erkennst du die Verbesserung?",
    "vertiefung-2-b-versuch": "Was haben wir ausprobiert? Zwei Sätze.",
    "vertiefung-2-b-beispiel": "Was ist uns aufgefallen? Ein Beispiel.",
    "vertiefung-2-b-leitfrage": "Antwort auf die Leitfrage: ein bis zwei Sätze.",
    "vertiefung-2-b-chance-risiko": "Eine Chance und ein Risiko: Welche Daten braucht die Anwendung und wie schützt du persönliche Daten?",
    "vertiefung-2-b-bonus": "Bonus: Was würdest du verbessern? Woran erkennst du die Verbesserung?",
    "vertiefung-2-c-versuch": "Was haben wir ausprobiert? Zwei Sätze.",
    "vertiefung-2-c-beispiel": "Was ist uns aufgefallen? Ein Beispiel.",
    "vertiefung-2-c-leitfrage": "Antwort auf die Leitfrage: ein bis zwei Sätze.",
    "vertiefung-2-c-chance-risiko": "Eine Chance und ein Risiko: Welche Daten braucht die Anwendung und wie schützt du persönliche Daten?",
    "vertiefung-2-c-bonus": "Bonus: Was würdest du verbessern? Woran erkennst du die Verbesserung?",
    "vertiefung-2-d-versuch": "Was haben wir ausprobiert? Zwei Sätze.",
    "vertiefung-2-d-beispiel": "Was ist uns aufgefallen? Ein Beispiel.",
    "vertiefung-2-d-leitfrage": "Antwort auf die Leitfrage: ein bis zwei Sätze.",
    "vertiefung-2-d-chance-risiko": "Eine Chance und ein Risiko: Welche Daten braucht die Anwendung und wie schützt du persönliche Daten?",
    "vertiefung-2-d-bonus": "Bonus: Was würdest du verbessern? Woran erkennst du die Verbesserung?",
    "vertiefung-2-aha": "Blitzlicht: Mein wichtigster Aha-Moment",
    "vertiefung-2-a-perspektive": "Welche Perspektive stand für dich im Vordergrund?",
    "vertiefung-2-a-begruendung": "Begründe deine Zuordnung mit einer Beobachtung.",
    "vertiefung-2-b-perspektive": "Welche Perspektive stand für dich im Vordergrund?",
    "vertiefung-2-b-begruendung": "Begründe deine Zuordnung mit einer Beobachtung.",
    "vertiefung-2-c-perspektive": "Welche Perspektive stand für dich im Vordergrund?",
    "vertiefung-2-c-begruendung": "Begründe deine Zuordnung mit einer Beobachtung.",
    "vertiefung-2-d-perspektive": "Welche Perspektive stand für dich im Vordergrund?",
    "vertiefung-2-d-begruendung": "Begründe deine Zuordnung mit einer Beobachtung.",
    "vertiefung-2-wunsch-tm": "Eigenes Teachable-Machine-Projekt",
    "vertiefung-2-wunsch-bilder": "Bildgeneratoren kritisch beurteilen",
    "vertiefung-2-wunsch-papier": "KI-Lernhelfer auf Papier (Abschlussprojekt)",
    "vertiefung-2-wunsch-sonstiges": "Sonstiges",
    "vertiefung-2-wunsch-freitext": "Dein anderer Wunsch"
  };
  document.querySelectorAll('[data-export]').forEach(btn => btn.addEventListener('click', () => {
    // Include defaults from untouched select fields as well as edited fields.
    document.querySelectorAll('[data-journal]').forEach(el => { state.notes[el.dataset.journal] = journalValue(el); });
    save();
    const lines = ['KI-EXPLAINED · MEIN LERNJOURNAL', '3. Sek · Persönliche Notizen', '', ...[1,2,3,4].map(i => `Kapitel ${i}: ${state.done[i] === true ? 'selbst als bearbeitet markiert' : 'noch offen'}`), ''];
    Object.entries(state.notes).forEach(([id, value]) => { if (typeof value === 'string' && !/^vertiefung-[12]-/.test(id)) lines.push(labels[id] || (id.startsWith('kompass-') ? 'Kompetenzkompass – '+id.slice(8).replaceAll('-', ' – ') : id.startsWith('reflexion-') ? 'Rückblick Kapitel '+id.slice(-1) : id), value || '(noch leer)', ''); });
    for (const [prefix, title] of [['vertiefung-1-', 'VERTIEFUNG 1: Wir trainieren eine KI'], ['vertiefung-2-', 'VERTIEFUNG 2: KI-Werkstatt (Stationenlernen)']]) {
      const entries = Object.entries(state.notes).filter(([id, value]) => id.startsWith(prefix) && typeof value === 'string');
      if (!entries.length) continue;
      lines.push(title, 'Formativ, ohne Note, nicht prüfungsrelevant', '');
      entries.forEach(([id, value]) => {
        const station = id.match(/^vertiefung-2-([abcd])-/);
        lines.push((station ? 'Station '+station[1].toUpperCase()+': ' : '') + (vertiefungLabels[id] || id), value || '(noch leer)', '');
      });
    }
    const url = URL.createObjectURL(new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'ki-lernjournal.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }));
  document.querySelector('#fortschritt-loeschen')?.addEventListener('click', () => {
    if (!window.confirm('Alle Antworten und Häkchen dieser Lernseite in diesem Browser löschen?')) return;
    state = {notes:{},done:{}}; document.querySelectorAll('[data-journal]').forEach(el => { if (el.type === 'checkbox') el.checked = false; else el.value = ''; }); document.querySelectorAll('[data-erledigt]').forEach(el => { el.checked = false; }); save(); progress(); document.dispatchEvent(new Event('journal-geloescht'));
  });
  if (document.body.hasAttribute('data-vertiefung')) {
    const fields = [...document.querySelectorAll('[data-journal]')];
    const copies = new Map();
    fields.forEach(el => {
      const copy = document.createElement('div');
      copy.className = 'druckantwort' + (el.type === 'checkbox' || el.tagName === 'SELECT' ? ' druckauswahl' : '');
      copy.setAttribute('aria-hidden', 'true');
      el.after(copy); el.classList.add('mit-druckantwort'); copies.set(el, copy);
    });
    window.addEventListener('beforeprint', () => fields.forEach(el => { copies.get(el).textContent = journalValue(el); }));
  }
  status(); progress();

  const weight = document.querySelector('#gewicht');
  if (weight) {
    let extra = false;
    const update = () => {
      const data = [{label:'Apfel',g:150},{label:'Apfel',g:180},{label:'Birne',g:110},{label:'Birne',g:130}];
      if (extra) data.push({label:'Birne',g:160});
      const g = Number(weight.value);
      const distance = Math.min(...data.map(d => Math.abs(d.g-g)));
      const nearest = data.filter(d => Math.abs(d.g-g) === distance);
      const labels = [...new Set(nearest.map(d => d.label))];
      document.querySelector('#gewicht-wert').textContent = g;
      document.querySelector('#obst-ergebnis').textContent = labels.length > 1
        ? `Unentschieden: Apfel und Birne sind beide ${distance} g entfernt. Mit Gewicht allein ist die Zuordnung hier nicht eindeutig.`
        : `Vorhersage: ${labels[0]}. Nächstes Beispiel: ${nearest.map(d => d.g+' g').join(' / ')} (Abstand ${distance} g). Das ist eine Zuordnung, kein Beweis für die Sorte.`;
      document.querySelector('#trainingsdaten').textContent = 'Apfel: 150 g, 180 g · Birne: 110 g, 130 g'+(extra?', 160 g':'');
      document.querySelector('#beispiel-ergaenzen').disabled = extra;
    };
    weight.addEventListener('input', update);
    document.querySelector('#beispiel-ergaenzen').addEventListener('click', () => { extra = true; update(); });
    document.querySelector('#labor-reset').addEventListener('click', () => { extra = false; weight.value = 160; update(); });
    update();
  }
  const context = document.querySelector('#satzkontext');
  if (context) {
    const distributions = {pause:[['ein Sandwich',60],['einen Apfel',30],['eine Suppe',10]],velo:[['Velo',70],['Trottinett',20],['Skateboard',10]]};
    const render = () => {
      const target = document.querySelector('#wortverteilung'); target.replaceChildren();
      distributions[context.value].forEach(([word,p]) => {
        const row = document.createElement('p'); row.className='wahrscheinlichkeit';
        row.textContent = `${word} · ${p} %`; row.style.setProperty('--anteil',p+'%'); target.append(row);
      });
      document.querySelector('#wort-ausgabe').textContent = 'Ziehe mehrmals eine Fortsetzung und vergleiche.';
    };
    context.addEventListener('change',render);
    document.querySelector('#wort-ziehen').addEventListener('click', () => {
      const random = Math.random()*100; let sum=0;
      const match = distributions[context.value].find(([,p]) => { sum+=p; return random<sum; });
      document.querySelector('#wort-ausgabe').textContent = 'Gezogene Fortsetzung: '+match[0]+'. Das Beispiel wählt ganze Wörter bzw. Wortgruppen; echte Modelle arbeiten mit Tokens.';
    }); render();
  }
  document.querySelector('#prompt-baukasten')?.addEventListener('submit', e => {
    e.preventDefault();
    const goal = document.querySelector('#prompt-ziel').value.trim();
    const context = document.querySelector('#prompt-kontext').value.trim();
    if (!goal || !context) { document.querySelector('#prompt-bau-feedback').textContent='Fülle Ziel und Kontext mit eigenen Angaben aus.'; return; }
    const result = `Hilf mir beim Lernen: ${goal}. Mein Lernstand und Kontext: ${context}. ${document.querySelector('#prompt-format').value} Erfinde keine Fakten. Kennzeichne Unsicherheiten.`;
    document.querySelector('#prompt-ergebnis').value=result;
    document.querySelector('#prompt-bau-feedback').textContent='Dein Prompt ist bereit. Besprich mit einer anderen Person, ob der Auftrag klar und prüfbar ist. Dies ist keine automatische Qualitätsbewertung.';
  });
  document.querySelector('#quellen-pruefen')?.addEventListener('click', () => {
    const answers = [['check-start','belegt'],['check-bib','widerspruch'],['check-frist','offen']];
    const feedback = document.querySelector('#quellen-feedback');
    if (answers.some(([id]) => !document.getElementById(id).value)) { feedback.textContent='Wähle zuerst für alle drei Aussagen eine Einschätzung.'; return; }
    const score = answers.filter(([id,right]) => document.getElementById(id).value === right).length;
    feedback.textContent=`${score}/3 richtig. Unterrichtsbeginn: belegt (Montag bis Freitag). Bibliothek: widersprochen (nur Montag und Donnerstag). Ausleihdauer: nicht belegt; eine zusätzliche Quelle ist nötig. Du kannst deine Auswahl ändern und erneut prüfen.`;
  });
});
