# ki-explained – Lernwerkstatt für die 3. Sek

Interaktive Lernlandschaft für Medien und Informatik in der Schweiz. Vier Kapitel mit Theorie, Experimenten, Hilfen, Bonusaufgaben, Selbsttests und einem herunterladbaren Lernjournal. Dazu Karteikarten und ein Abschlussprojekt.

## Unterricht

- Kapitel 1: Regeln, gelernte Muster und Trainingsdaten (45–60 Minuten).
- Kapitel 2: Regel-Bots, Tokens und wahrscheinliche Fortsetzungen (45 Minuten).
- Kapitel 3: Ziel, Kontext und Format im Prompt-Baukasten (45 Minuten).
- Kapitel 4: Aussagen anhand einer Quelle prüfen, Datenschutz und Verantwortung (45 Minuten).
- Abschluss: Lernhelfer als Steckbrief und Rollenspiel (1–2 zusätzliche Lektionen).

Voraussetzungen: grundlegende Browserbedienung, Lesen und einfache Zahlenvergleiche. Kein Konto, API-Schlüssel, Webcamzugriff oder kostenpflichtiger Dienst erforderlich. Eingebaute Experimente sind bewusst vereinfachte, lokal ausgeführte Modelle. Sie sind kein Zugriff auf einen generativen KI-Dienst. Die Wortverteilung ist erfunden und als solche gekennzeichnet. Das Obstmodell verwendet den nächsten Nachbarn nach Gewicht und zeigt Gleichstände ausdrücklich.

Unterstützung: Partnerarbeit, aufklappbare Hilfen, Beobachtungen mündlich erklären. Vertiefung: freiwillige Bonusaufgaben. Zeiten sind Richtwerte. Kein Anspruch auf eine offizielle Lehrplan-Zertifizierung.

## Technik und Datenschutz

Statische HTML-, CSS- und JavaScript-Dateien; kein Build-Schritt. Lokal `python -m http.server 8765` ausführen und `http://localhost:8765` öffnen. Die bestehenden Kapitel-URLs bleiben erhalten; GitHub Pages kann die Dateien direkt ausliefern.

Das Lernjournal verwendet `localStorage` (`kiExplainedWerkstattV1`). Eingaben werden nicht versendet. Auf gemeinsam genutzten Geräten sind sie für weitere Nutzer desselben Browserprofils sichtbar. Export als UTF-8-Text; Löschen auf der Startseite. Bei gesperrtem Speicher erscheint ein Hinweis, der Export der aktuellen Sitzung bleibt möglich. Besuchsmarkierungen der bestehenden Navigation sind keine Leistungsbewertung; Abschluss-Häkchen werden ausdrücklich von Lernenden gesetzt.

## Gestaltung

Orientierung an den Gestaltungs- und Lernwegprinzipien von [Form und Raum](https://github.com/mathe-phlu/form_und_raum): Papierfarben, klare Kapitel-Farbcodes, Materialzugänge, Werkstatt, Hilfe, Bonus und Rückblick. Eigenständige Umsetzung für KI-Themen und die 3. Sek; keine Übernahme von PH-Logos, Bildern oder Unterrichtsmaterialien und keine behauptete Verbindung zur PH Luzern.

## Prüfen

DOM-Interaktionen (ohne Browserinstallation): `npm install` und `npm test`.

Visuelle Browserprüfung: `npx playwright install chromium`, lokalen Server starten und:

```sh
node tests/workshop.cjs
```

`TEST_URL` kann eine andere Basis-URL setzen. Der Test prüft sieben Seiten, mobile und Desktop-Breiten, interne Sprungziele, die vier Werkstätten, Quiz-Wiederholung, Lernjournal-Speicherung, Download, Zurücksetzen sowie gesperrten Browserspeicher.

Validierung dieser Überarbeitung: DOM-Tests für alle sieben Seiten, die vier Werkstätten, Gleichstände, Quiz-Wiederholung und Punktestand, gespeicherte Antworten, Abschlussmarkierungen, Löschen und blockierten Speicher bestanden. Interne Dateien/Links und JavaScript-Syntax geprüft. Der Playwright-Test ist vorbereitet, konnte in der Arbeitsumgebung wegen nicht erreichbarem Chromium-Download nicht ausgeführt werden; visuelle Prüfung steht aus.


## Kompetenzorientierte Ergänzung

Der Kompetenzkompass (`kompetenzen/index.html`) verbindet die vier Bereiche von Alles/Falck/Flick/Schulz (2025) mit konkreten Lernbelegen. Niveau I ist Schwerpunkt, Niveau II ausgewählte Vertiefung und Niveau III Ausblick. Das OECD/EU AILit-Framework (2026), deutsche bereitgestellte Ausgabe, ergänzt bewusste Nutzung, kreatives Anwenden, gezielten Einsatz und aktive Mitgestaltung. Die Modelle sind nicht gleichgesetzt. Quellen, Bearbeitungshinweise und CC-BY-4.0-Angaben stehen auf der Kompassseite; die zwei bereitgestellten Originalgrafiken sind unverändert eingebunden.

Neue Aufträge: Datenvergleich und Testfälle (Kapitel 1), KI-Antworten beurteilen (2), kreative Lernkarte und Arbeitsaufteilung (3), Fairness, Perspektiven und Ressourcen (4), Testprotokoll und Überarbeitung (Projekt). Alle funktionieren ohne KI-Konto. Selbsteinschätzung vorher/nachher und Lernbelege nutzen das bestehende lokale Journal samt Export und Löschung. Es werden keine automatischen Kompetenznoten vergeben.

Zeitbedarf mit Ergänzungen: etwa 6–7 Lektionen für die Kapitel inklusive Kompass, zusätzlich 1–2 Lektionen Projekt. Basisweg weiterhin 4–5 Lektionen.

Validierung der Kompetenzergänzung: `npm test` bestanden für alle acht Seiten, inklusive Kompass-Speicherung, Exportinhalt, Löschen, gesperrtem Speicher, eindeutigen IDs und allen lokalen Links/Sprungzielen. JavaScript-Syntax und `git diff --check` bestanden. Browserprüfung um die achte Seite und den Kompass ergänzt; noch nicht ausgeführt, weil Chromium fehlt und die Installation in der Arbeitsumgebung mit einem Lock-Aktualisierungsfehler abbrach. Visuelle Prüfung bleibt offen.
