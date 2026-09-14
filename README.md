# ki-explained

**KI verstehen, ausprobieren und verantwortungsvoll nutzen.**

ki-explained ist eine interaktive Lernwerkstatt für die 3. Sek im Fach Medien und Informatik. Kurze Erklärungen, Experimente und eigene Aufgaben führen durch die Grundlagen der Künstlichen Intelligenz. Die Lernenden arbeiten allein oder zu zweit und dokumentieren ihre Erkenntnisse in einem persönlichen Lernjournal.

## Einstieg und Orientierung

Die [Startseite](index.html) stellt die Themen vor und erklärt den Ablauf. Von dort aus lassen sich die vier Kapitel, der Kompetenzkompass, das Abschlussprojekt und die Prüfungsvorbereitung direkt öffnen.

Die Lernwerkstatt ist für die Nutzung auf dem iPad ausgelegt und funktioniert auch am Computer. Die Inhalte sind in kurze Lernschritte aufgeteilt: Mit **Zurück** und **Weiter** wird geblättert, über **Direkt zu** lässt sich ein bestimmter Abschnitt auswählen. Quizfragen erscheinen einzeln. Bei längeren Aufgaben oder vergrösserter Schrift kann zusätzliches Scrollen nötig sein.

## Themen und Lernziele

| Bereich | Was die Lernenden erarbeiten |
| --- | --- |
| [1. Was ist KI?](kapitel-1/index.html) | KI im Alltag erkennen, feste Regeln von gelernten Mustern unterscheiden und den Einfluss von Trainingsdaten untersuchen. |
| [2. Chatbots](kapitel-2/index.html) | Einen Regel-Bot ausprobieren, Wortvorhersagen verstehen und die Grenzen überzeugend formulierter Antworten erkennen. |
| [3. Prompting](kapitel-3/index.html) | Aufträge mit Ziel, Kontext und Format formulieren, Ergebnisse vergleichen und Prompts verbessern. |
| [4. Chancen, Risiken und Regeln](kapitel-4/index.html) | Aussagen anhand von Quellen prüfen, persönliche Daten schützen sowie Fairness, Umweltfolgen und Verantwortung diskutieren. |
| [Kompetenzkompass](kompetenzen/index.html) | Den eigenen Lernstand vor und nach der Einheit einschätzen und mit konkreten Lernbelegen begründen. |
| [Abschlussprojekt](projekt/index.html) | Einen KI-Lernhelfer als Steckbrief und Rollenspiel entwerfen, testen und nach Rückmeldungen überarbeiten. |
| [Prüfungsvorbereitung](pruefungsvorbereitung/index.html) | Inhalte mit Karteikarten und einem kapitelübergreifenden Quiz wiederholen. |

## Einsatz im Unterricht

Vorausgesetzt werden grundlegende Browserbedienung, Lesen, Texteingabe und einfache Zahlenvergleiche. Für die eingebauten Aufgaben sind weder ein KI-Konto noch ein API-Schlüssel oder eine Webcam erforderlich.

Ein typischer Lernweg besteht aus Lernziel, kurzer Erklärung, Experiment, eigener Begründung und Selbsttest. Aufklappbare Hilfen unterstützen den Einstieg. Freiwillige Bonus- und Kompetenzaufträge ermöglichen Vertiefungen. Beobachtungen können auch mündlich erläutert oder auf Papier festgehalten werden.

Als Richtwerte gelten:

- **Basisweg:** 4–5 Lektionen à 45 Minuten; Kapitel 1 benötigt etwa 45–60 Minuten.
- **Mit Kompetenzaufträgen und Kompass:** insgesamt etwa 6–7 Lektionen.
- **Abschlussprojekt:** zusätzlich 1–2 Lektionen.

Im Mittelpunkt stehen nachvollziehbare Begründungen, eigene Lernfortschritte und das Überarbeiten von Ergebnissen. Selbsttests dienen dem Üben. Selbsteinschätzungen und Abschluss-Häkchen ergeben keine automatische Note.

## Kompetenzorientierung und Quellen

Die Lernwerkstatt verbindet **Verstehen, Anwenden, Reflektieren und Mitgestalten**. Grundlage ist das Modell *KI-Kompetenzen für Lehrende und Lernende* von Susanne Alles, Joscha Falck, Manuel Flick und Regina Schulz (2025). Für die 3. Sek liegt der Schwerpunkt auf Niveau I; ausgewählte Aufgaben vertiefen Niveau II. Niveau III dient als Ausblick.

Ergänzend fliesst das **OECD/EU AILit-Framework (2026)** ein: mit KI bewusst umgehen, KI kreativ anwenden, KI gezielt einsetzen und KI aktiv mitgestalten. Die beiden Modelle werden als unterschiedliche Perspektiven genutzt und nicht gleichgesetzt.

Quellen, Originalgrafiken, Namensnennungen sowie Lizenz- und Bearbeitungshinweise stehen im [Kompetenzkompass](kompetenzen/index.html#quellen). Die Unterrichtsaufträge sind für diese Lernwerkstatt angepasst; sie stellen keine offizielle Zertifizierung dar.

## Lernjournal und Speicherung

Journaltexte, Selbsteinschätzungen und Abschlussmarkierungen werden ausschliesslich im Browser auf dem jeweiligen Gerät gespeichert. Die Lernjournal-Eingaben werden nicht an einen KI-Dienst gesendet.

- Das Journal lässt sich als Textdatei herunterladen.
- Alle gespeicherten Journaleinträge und Abschlussmarkierungen können auf der Startseite gelöscht werden.
- Vor einem Gerätewechsel oder dem Löschen von Browserdaten sollte das Journal exportiert werden.
- Auf gemeinsam genutzten Geräten können weitere Personen desselben Browserprofils die Einträge sehen.
- Wenn der Browserspeicher gesperrt ist, erscheint ein Hinweis. Der Export der aktuellen Sitzung bleibt möglich.

Beim Blättern bleiben Eingaben, Quizantworten und Experimentzustände erhalten. Beim Neuladen werden Quiz- und Experimentzustände zurückgesetzt; gespeicherte Journaltexte bleiben bestehen. Besuchsmarkierungen in der Navigation sind keine Leistungsbewertung.

## Technischer Aufbau

Das Projekt besteht aus statischen HTML-, CSS- und JavaScript-Dateien. Ein Build-Schritt oder Backend ist nicht erforderlich. Die Dateien können beispielsweise über GitHub Pages ausgeliefert werden.

| Pfad | Inhalt |
| --- | --- |
| `index.html` | Startseite, Anleitung und Zugang zum Lernjournal |
| `kapitel-1/` bis `kapitel-4/` | Erklärungen, Werkstätten, Aufgaben und Selbsttests |
| `kompetenzen/` | Kompetenzkompass und Quellen |
| `projekt/` | Abschlussprojekt |
| `pruefungsvorbereitung/` | Karteikarten und Übungsquiz |
| `assets/` | Gestaltung, Navigation, interaktive Funktionen und Grafiken |
| `tests/` | DOM- und Browser-Tests |

Die Experimente sind bewusst vereinfachte Modelle ohne Verbindung zu einer echten generativen KI. Das Obstlabor ordnet Früchte anhand des nächstgelegenen Gewichts zu und zeigt Gleichstände an. Die Wortvorhersage nutzt eine erfundene, gekennzeichnete Verteilung.

`assets/lernseiten.js` organisiert die Lernschritte, ohne die vorhandenen Elemente beim Blättern neu aufzubauen. URL-Fragmente ermöglichen Direktlinks und Browsernavigation. Ohne JavaScript bleiben die Lerntexte lesbar; interaktive Funktionen benötigen JavaScript. Die Druckansicht zeigt alle Lernschritte. Das Journal verwendet den lokalen Speicherschlüssel `kiExplainedWerkstattV1`.

## Lokal starten

Im Projektverzeichnis mit installiertem Python 3 ausführen:

```sh
python3 -m http.server 8765
```

Anschliessend die Lernwerkstatt unter [localhost:8765](http://localhost:8765) öffnen.

## Tests

Für die Entwicklungstests wird Node.js ab Version 22.13.0 benötigt.

```sh
npm install
npm test
```

Die DOM-Tests prüfen die acht Bereiche, Navigation und Direktlinks, Übungen, Quiz-Wiederholung, Eingabeerhalt sowie Speicherung, Export und Löschen des Journals.

Für die Browserprüfung zunächst Chromium installieren:

```sh
npx playwright install chromium
```

Bei laufendem lokalem Server in einem zweiten Terminal ausführen:

```sh
npm run test:browser
```

Mit `TEST_URL` lässt sich eine andere Basisadresse festlegen. Der Browser-Test umfasst die Lernschritte bei 768 × 1024, 1024 × 768 und 390 × 844 Pixeln sowie Navigation, Übungen und Journalfunktionen.

**Prüfstand:** Die DOM-Tests sowie Syntax- und Diff-Prüfungen der Umsetzung sind bestanden. Die Browserprüfung und eine visuelle Kontrolle auf dem iPad stehen noch aus, da der Chromium-Download in der bisherigen Arbeitsumgebung nicht erfolgreich war.
