# Vertiefung nach Prüfung 2

## Bestand

- Acht Bereiche einschliesslich Startseite. Gemeinsame Gestaltung: style.css,
  lernlandschaft.css und lernseiten.css. Klassen: werkstatt, labor, box hinweis,
  journal-label, knopf, abschluss, themenkarte und hauptnav.
- lernseiten.js verschiebt Elemente in .lernseite, ohne sie neu aufzubauen.
  Explizite data-lernseite-Abschnitte haben Vorrang. Zurück/Weiter und Direkt zu
  setzen #lernseite-N; bestehende Abschnitts-IDs bleiben gültige Direktlinks.
  Eine Statusanzeige zählt Seiten, hashchange unterstützt Browsernavigation.
- script.js initialisiert Menü, Besuchsmarkierungen und Quiz: .frage,
  data-richtig (1-basiert), .antwort-knopf, Rückmeldung und Wiederholung.
  Bestehende Quizfragen und Auswertungen werden nicht geändert.
- werkstatt.js nutzt kiExplainedWerkstattV1 mit notes (Texte) und done (Häkchen).
  Fehler beim Speicherzugriff lassen Sitzung und Textdownload weiterarbeiten.
  Export: ki-lernjournal.txt. Löschen erfolgt auf der Startseite nach Bestätigung.
- Druck-CSS zeigt auch versteckte Lernschritte. Ohne JavaScript bleiben Texte
  lesbar. Im Bestand gibt es keine Versionsparameter an Assets.

## Schritte und Dateien

1. assets/konfiguration.js, assets/vertiefung.js, assets/vertiefung.css sowie
   vertiefung-1/index.html und vertiefung-2/index.html ergänzen.
2. HTML-Navigation aller Bereiche und Startkarten ergänzen. werkstatt.js für
   Checkboxen und gruppierte Exporte erweitern. Bestehende Journalfelder bleiben.
3. Kompetenzkompass um Quellen ergänzen; README zu Lernwegen, Freischaltung,
   Datenschutz, Technik, Tests und Prüfstand aktualisieren.
4. DOM- und Playwright-Tests erweitern, npm test und Browserprüfung ausführen.
   Kleine Commits auf codex/vertiefung, anschliessend Pull Request gegen main.

## Risiken und Entscheidungen

- Keine Schemaänderung nötig: neue notes-Schlüssel mit Präfix vertiefung-1/
  vertiefung-2; Checkboxen als Texte ja/nein. Alte Daten bleiben kompatibel.
- Freischaltung ist kein Zugriffsschutz einer statischen Website. Bei aktivem
  JavaScript ersetzt ein gesperrter Direktlink den Inhalt durch einen Hinweis.
  Ohne JavaScript bleiben die Lerntexte mit Freischalthinweis lesbar.
- Stationenwahl: genau zwei Checkboxen; bei anderer Anzahl Hinweis, keine
  Laufzettel. Bereits erfasste Texte bleiben bei Wahlwechsel erhalten.
- Modelltausch nur durch Test am anderen geöffneten Gerät, kein Modelltransfer.
  Posen nur ohne Gesicht im Bild, Ton nur mit Gegenstandsgeräuschen.
- Externe Dienste ändern sich: Quellenprüfung dokumentieren, keine nicht
  verifizierten Konto-, Sprach- oder Funktionszusagen. Klassen-iPad im Schulnetz
  vor dem Einsatz prüfen. Keine Einbettung, keine neuen Abhängigkeiten.
- Druck: alle Aufgaben, zwei gewählte Laufzettel; ohne gültige Wahl alle vier
  als Papiervorlagen. Keine Bewertung und keine automatische Notengebung.

Keine blockierenden offenen Fragen. Countdown und Offline-Labor sind optional.
