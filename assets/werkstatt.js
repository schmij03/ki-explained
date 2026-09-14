'use strict';
// All exercises and journal data stay in the browser. No network requests.
document.addEventListener('DOMContentLoaded', () => {
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
  document.querySelectorAll('[data-journal]').forEach(el => {
    const value = state.notes[el.dataset.journal];
    if (typeof value === 'string') el.value = value;
    el.addEventListener('input', () => { state.notes[el.dataset.journal] = el.value; save(); });
  });
  document.querySelectorAll('[data-erledigt]').forEach(el => {
    el.checked = state.done[el.dataset.erledigt] === true;
    el.addEventListener('change', () => { state.done[el.dataset.erledigt] = el.checked; save(); progress(); });
  });
  const labels = {'transfer-1':'Kapitel 1 – Datenvergleich','transfer-2':'Kapitel 2 – Antworten beurteilen','transfer-3':'Kapitel 3 – Kreativer Vergleich','transfer-4':'Kapitel 4 – Faire Klassenregel','projekt-test':'Projekt – Test und Überarbeitung',obst:'Kapitel 1 – Trainingsdaten',tokens:'Kapitel 2 – Wortvorhersage','prompt-ziel':'Prompt – Ziel','prompt-kontext':'Prompt – Kontext','prompt-format':'Prompt – Format','prompt-revision':'Kapitel 3 – Verbesserter Prompt',verantwortung:'Kapitel 4 – Verantwortung',projekt:'Abschlussprojekt'};
  document.querySelectorAll('[data-export]').forEach(btn => btn.addEventListener('click', () => {
    // Include defaults from untouched select fields as well as edited fields.
    document.querySelectorAll('[data-journal]').forEach(el => { state.notes[el.dataset.journal] = el.value; });
    save();
    const lines = ['KI-EXPLAINED · MEIN LERNJOURNAL', '3. Sek · Persönliche Notizen', '', ...[1,2,3,4].map(i => `Kapitel ${i}: ${state.done[i] === true ? 'selbst als bearbeitet markiert' : 'noch offen'}`), ''];
    Object.entries(state.notes).forEach(([id, value]) => { if (typeof value === 'string') lines.push(labels[id] || (id.startsWith('kompass-') ? 'Kompetenzkompass – '+id.slice(8).replaceAll('-', ' – ') : id.startsWith('reflexion-') ? 'Rückblick Kapitel '+id.slice(-1) : id), value || '(noch leer)', ''); });
    const url = URL.createObjectURL(new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'ki-lernjournal.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }));
  document.querySelector('#fortschritt-loeschen')?.addEventListener('click', () => {
    if (!window.confirm('Alle Antworten und Häkchen dieser Lernseite in diesem Browser löschen?')) return;
    state = {notes:{},done:{}}; document.querySelectorAll('[data-journal]').forEach(el => { el.value = ''; }); document.querySelectorAll('[data-erledigt]').forEach(el => { el.checked = false; }); save(); progress();
  });
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
