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
| [Vertiefung 1](vertiefung-1/index.html) | Bildmodell trainieren, Fehler untersuchen und Trainingsdaten verbessern. Nach Prüfung 2, ohne Note. |
| [Vertiefung 2](vertiefung-2/index.html) | Zwei von vier unabhängigen Stationen bearbeiten, Daten und Datenschutz beurteilen. Nach Prüfung 2, ohne Note. |

## Einsatz im Unterricht

Vorausgesetzt werden grundlegende Browserbedienung, Lesen, Texteingabe und einfache Zahlenvergleiche. Für die eingebauten Aufgaben sind weder ein KI-Konto noch ein API-Schlüssel oder eine Webcam erforderlich.

Ein typischer Lernweg besteht aus Lernziel, kurzer Erklärung, Experiment, eigener Begründung und Selbsttest. Aufklappbare Hilfen unterstützen den Einstieg. Freiwillige Bonus- und Kompetenzaufträge ermöglichen Vertiefungen. Beobachtungen können auch mündlich erläutert oder auf Papier festgehalten werden.

Als Richtwerte gelten:

- **Basisweg:** 4 bis 5 Lektionen à 45 Minuten; Kapitel 1 benötigt etwa 45 bis 60 Minuten.
- **Mit Kompetenzaufträgen und Kompass:** insgesamt etwa 6 bis 7 Lektionen.
- **Abschlussprojekt:** zusätzlich 1 bis 2 Lektionen.

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

Die DOM-Tests prüfen die zehn Bereiche (acht bestehende und zwei Vertiefungen), Navigation und Direktlinks, Übungen, Quiz-Wiederholung, Eingabeerhalt sowie Speicherung, Export und Löschen des Journals.

Für die Browserprüfung zunächst Chromium installieren:

```sh
npx playwright install chromium
```

Bei laufendem lokalem Server in einem zweiten Terminal ausführen:

```sh
npm run test:browser
```

Mit `TEST_URL` lässt sich eine andere Basisadresse festlegen. Der Browser-Test umfasst die Lernschritte bei 768 × 1024, 1024 × 768 und 390 × 844 Pixeln sowie Navigation, Übungen und Journalfunktionen.

**Prüfstand (19.09.2026):** `npm test` mit Node 24.19.0 bestanden, inklusive
zehn Bereichen und aller neuen DOM-Abnahmetests. JavaScript-Syntax und
`git diff --check` bestanden. Die Hauptinhalte der vier Kapitel, des Projekts
und der Prüfungsvorbereitung sind bytegleich zur Ausgangsversion und zusätzlich
über Prüfsummen abgesichert. `npx playwright install chromium` scheiterte nach
Zeitüberschreitungen mit HTTP 502. `npm run test:browser` wurde versucht, konnte
aber wegen des fehlenden Chromium-Programms keinen Test ausführen.

Die Browser-Tests sind für 768 × 1024, 1024 × 768, 390 × 844 sowie zusätzlich
320 Pixel Breite und vergrösserte Schrift erweitert. **Nicht ausgeführt:**
Layout- und Überlaufkontrollen, Browsernavigation und Tastaturbedienung im echten
Browser, Browser-Downloads, Druck-CSS und A4-PDF-Prüfung, HTML-Fallback im Browser
sowie Browser-Konsolenprüfung. Die DOM-Ausführung meldet keine Skriptfehler.
Eine visuelle Kontrolle auf einem echten iPad und ein Test im Schulnetz stehen aus.


## Vertiefung nach Prüfung 2

Die beiden neuen Bereiche ergänzen den Basisweg. Sie ändern den Stoff, die
Reihenfolge und die Quizfragen der Kapitel 1 bis 4, die Prüfungsvorbereitung
mit zwölf Quizfragen und das Abschlussprojekt nicht. Sie sind **formativ,
ohne Note und nicht prüfungsrelevant**. Sie gehören nicht zur Prüfungsvorbereitung.

| Termin | Lernweg, mittwochs 11:05 bis 11:50 Uhr |
| --- | --- |
| 18.11., 25.11., 02.12. und 16.12.2026 | Grundeinheit, Kapitel 1 bis 4 |
| 06.01.2027 | Prüfung 2, nur Stoff der Grundeinheit |
| 13.01.2027 | [Wir trainieren eine KI](vertiefung-1/index.html): 10 Minuten Prüfungsrückgabe, 5 Minuten Einstieg, 22 Minuten Werkstatt, 8 Minuten Sicherung |
| 27.01.2027 | [KI-Werkstatt (Stationenlernen)](vertiefung-2/index.html): 5 Minuten Einstieg, zwei Stationen zu je 15 Minuten inklusive Laufzettel, 10 Minuten Sicherung |
| Ab 03.02.2027 | Im zweiten Semester: Unterrichtskapitel 2 «Fakes im Netz», nicht zu verwechseln mit Kapitel 2 «Chatbots» dieser Website |

Der Kernsatz lautet: **Plausibel heisst nicht wahr.** Die Lernenden arbeiten
allein oder in Zweierteams mit wechselnder Bedienung und Beobachtung. Jede
Station A bis D ist unabhängig lösbar, auch nach Abwesenheiten. Empfohlen ist
eine Station zu Daten und Bildern (B/C) plus eine zu Sprache oder Spiel (A/D).
Der Bonus der ersten Vertiefung ist freiwillig und kein zusätzlicher Pflichtteil
der 35 Minuten. Es gibt keine automatische Bewertung.

Lehrplan 21: MI.1.1.f (Chancen und Risiken der Durchdringung des Alltags),
MI.1.1.e (Mediennutzung und Konsequenzen für eigenes Verhalten), MI.1.3.h
(allein und in Teams experimentieren und sich austauschen). Jede Station nennt
ihre Dagstuhl-Perspektive: technologisch, gesellschaftlich-kulturell oder
anwendungsbezogen. Diese Zuordnung wird in der Sicherung begründet.

### Geräteplanung für die Vertiefung

Für jede lernende Person einen Laptop einplanen. Die Zusammenarbeit in
Zweierteams bleibt bestehen, jede Person arbeitet aber an einem eigenen Gerät
und führt ihr persönliches Lernjournal. Die externen Angebote vor dem Einsatz
auf den vorgesehenen Laptops im Schulnetz prüfen. Die Lernwerkstatt bleibt
auch auf iPads nutzbar.
Für Vertiefung 1 Kamera, Kamerafreigabe und Teachable Machine prüfen, alternativ
vorbereitete Gegenstandsbilder bereithalten. Auch die vier Stationen der zweiten
Vertiefung auf den tatsächlich eingesetzten Geräten vorab öffnen.

Das persönliche Journal möglichst auf demselben Gerät führen. Der lokale
Browserspeicher synchronisiert sich nicht zwischen iPad und Laptop. Vor einem
Wechsel exportieren und die Textdatei über Teams oder OneDrive sichern. Der
Export ist eine lesbare Sicherung, es gibt keinen automatischen Journalimport.

### Freischaltung und technischer Aufbau

Die einzige Konfigurationsstelle ist `assets/konfiguration.js`:

```js
window.kiExplainedKonfiguration = Object.freeze({ vertiefungSichtbar: false });
```

Die Lehrperson setzt **am 13.01.2027** den Wert auf `true` und veröffentlicht
die Änderung. Es gibt keine automatische Datumsfreigabe und keinen zweiten
Schalter im Speicher. Standardmässig sind beide Karten, Navigationspunkte und
Zusatzhinweise ausgeblendet. Ein Direktlink zeigt bei aktivem JavaScript:
«Diese Vertiefung wird ab dem 13.01.2027 freigeschaltet».

Das ist eine Anzeigehilfe einer statischen Website, kein Zugriffsschutz.
Ohne JavaScript bleiben die Lerntexte mit Freischalthinweis lesbar, Eingaben
können dann auf Papier erfolgen. Diese bewusste Ausnahme erfüllt den lesbaren
HTML-Fallback. Die Quellen der Vertiefung werden mit demselben Schalter sichtbar.

| Datei | Aufgabe |
| --- | --- |
| `vertiefung-1/index.html`, `vertiefung-2/index.html` | Je sieben explizite `data-lernseite`-Schritte, Aufgaben und Journalfelder |
| `assets/konfiguration.js` | Zentraler Schalter, Navigation und Direktlinkhinweis vor Initialisierung |
| `assets/vertiefung.js` | Genau zwei Stationen validieren und zugehörige Laufzettel und Perspektiven zeigen |
| `assets/vertiefung.css` | Touch-Felder, Vergleichstabelle, Freischaltung und A4-Druck |
| `assets/werkstatt.js` | Bestehendes Journal, Checkboxen, gruppierter Export und ungekürzte Drucktexte |
| `assets/lernseiten.js` | Bestehende Navigation, auf gesperrten Vertiefungsseiten nicht initialisieren |
| `tests/vertiefung.cjs` | Neue DOM-Abnahmetests |

`#lernseite-1` bis `#lernseite-7` und sprechende IDs wie `#trainieren`,
`#station-a`, `#laufzettel` und `#sicherung` sind direkt erreichbar.
Beim Blättern werden Elemente weiterhin verschoben, nicht neu aufgebaut.
Der Bestand verwendet keine Asset-Versionsparameter, deshalb wurden keine
abweichenden Versionskonventionen eingeführt. Keine neuen Abhängigkeiten,
kein Build-Schritt, keine externen Skripte, Fonts, Analytics oder iframes.

### Journal, Datenschutz und Druck

Der Schlüssel **kiExplainedWerkstattV1** bleibt unverändert. Neue Feldnamen
beginnen unter `notes` mit `vertiefung-1-` oder `vertiefung-2-`. Checkboxen
speichern `ja`/`nein`, Text- und Auswahlfelder weiterhin Zeichenketten. Alte
`notes`- und `done`-Einträge werden übernommen. Es ist keine destruktive
Migration nötig. Auch alte Seiten erhalten die neuen Felder beim Speichern.

Stationenwahl, Protokolle, Laufzettel, Selbsteinschätzungen und Wünsche bleiben
lokal. Ein Wahlwechsel blendet Felder nur aus, ihre bisherigen Antworten bleiben
im Journal und im Export. Bei null, einer, drei oder vier gewählten Stationen
erscheint ein Hinweis; keine Laufzettel werden am Bildschirm eingeblendet.

Der Textdownload enthält beide neuen Bereiche unter eigenen Überschriften,
auch beim Export von der Startseite und auch nach erneuter Sperrung. Exportiere
nach jeder Lektion und lade die Textdatei in den vorgesehenen Teams-Kanal;
OneDrive kann als Zwischenablage dienen. «Meine Einträge löschen» auf der
Startseite entfernt auch alle neuen Journalfelder. Besuchsmarkierungen bleiben
rein zur Orientierung und sind keine Leistungsbewertung.

Bei gesperrtem Browserspeicher funktionieren Eingabe, Auswahl und Export in der
aktuellen Sitzung. Beim Verlassen der Seite ohne Export können Daten verloren
gehen. Fremde Dienste erhalten keine Journalfelder von dieser Website. Beim
Öffnen eines externen Links gelten jedoch die Datenhinweise des Diensts.

Teachable Machine: Gegenstände statt Gesichter, keine Namen, kein Konto, keine
Drive-Speicherung und kein Hochladen oder Teilen von Modellen. Kameraprobleme:
vorbereitete Gegenstandsbilder aus Dateien verwenden. Modelltausch im Bonus
bedeutet Testen am bereits geöffneten Gerät des anderen Teams. Posen nur ohne
Gesicht im Bild, alternativ Gegenstandsgeräusche ohne Stimmen.

Druck zeigt alle sieben Schritte. Bei gültiger Wahl erscheinen die zwei
gewählten Laufzettel, ohne gültige Wahl alle vier Papiervorlagen. Die Laufzettel
beginnen jeweils auf einer neuen A4-Seite. Lange Antworten werden vor dem
Drucken als umbrechender Text gespiegelt, statt im Formular abgeschnitten zu
werden. Gesperrte Seiten drucken nur den Freischalthinweis. Das optionale
Countdown-Werkzeug und ein zusätzliches Offline-Labor sind nicht Bestandteil
der Umsetzung; bei Netzausfall dienen Obstlabor oder vorbereitete Spielkarten
als Ersatz.

### Quellen und Lizenzhinweise zur Vertiefung

Geprüft am 19.09.2026, eigene Formulierungen, keine übernommenen Aufgabenblätter:

- [Teachable Machine](https://teachablemachine.withgoogle.com) und
  [Anbieterbeschreibung](https://blog.google/innovation-and-ai/products/teachable-machine/)
  von Google Creative Lab, 07.11.2019: Training im Browser, lokale Beispiele bis
  zur freiwilligen Drive-Speicherung. Die aktuelle Kamera- und Browserfunktion
  wurde nicht auf einem Schulgerät getestet.
- [Quick, Draw!](https://quickdraw.withgoogle.com/?locale=de) und
  [Datensammlung](https://quickdraw.withgoogle.com/data): Laut Spielseite werden
  Zeichnungen einem öffentlichen Forschungsdatensatz hinzugefügt. Keine
  persönlichen Angaben zeichnen; alternativ vorhandene Beispiele vergleichen
  oder auf Papier zeichnen. Die allgemeinen Datenhinweise des Diensts sind vor
  Einsatz zusätzlich zu prüfen. Keine Zeichnungen werden hier eingebettet.
- [Soekia](https://www.soekia.ch/) verlinkt das didaktische Sprachmodell mit
  Bezug zur PH Schwyz. Interaktive Oberfläche und Loginfreiheit konnten durch
  den Textabruf nicht vollständig verifiziert werden. Deshalb keine pauschale
  Zusage über Kosten, Sprache oder Verfügbarkeit.
- [AI for Oceans](https://studio.code.org/courses/oceans/units/1): Die Kursseite
  ist erreichbar; Ablauf, deutsche Sprache und kontofreier Kurszugang sind
  nicht vollständig verifiziert. Die Aufgaben nennen den vorgesehenen Ablauf
  mit entsprechendem Vorbehalt.
- [AI Unplugged](https://www.aiunplugged.org/), Stefan Seegerer und Annabel
  Lindner: [deutsche Broschüre](https://www.aiunplugged.org/german.pdf), laut
  Impressum [CC BY-NC 3.0](https://creativecommons.org/licenses/by-nc/3.0/), mit
  dort genannten Ausnahmen. [Online-Spiel](https://www.stefanseegerer.de/schlag-das-krokodil/):
  Stefan Seegerer. Die Broschürenlizenz ist keine pauschale Lizenz des Spiels
  oder dieses Repositories. Keine Originalgrafiken oder Karten wurden kopiert.

Vor dem 13.01.2027 muss die Lehrperson auf einem Klassen-iPad und einem vorgesehenen Laptop im Schulnetz
Kamera, Teachable Machine, Quick, Draw!, Soekia, Code.org und das Krokodil-Spiel
prüfen. Zugang und Ablauf können sich ändern. Keine Konten für die Aufgaben
anlegen; bei einer Anmeldesperre die Station wechseln. Für das Brettspiel
Karten und Regeln vorab bereitstellen.
