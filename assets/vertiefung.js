'use strict';
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.vertiefungGesperrt) return;
  const choices = [...document.querySelectorAll('[data-stationenwahl]')];
  if (!choices.length) return;
  const message = document.getElementById('stationen-hinweis');
  function update() {
    const selected = choices.filter(el => el.checked).map(el => el.value);
    const valid = selected.length === 2;
    message.textContent = valid
      ? 'Deine Wahl: '+selected.join(' und ')+'. Öffne die Stationen über Direkt zu. Die zwei Laufzettel sind bereit.'
      : 'Wähle genau zwei Stationen. Aktuell gewählt: '+selected.length+'.';
    document.body.classList.toggle('stationenwahl-gueltig', valid);
    choices.forEach(el => el.setCustomValidity(valid ? '' : 'Wähle genau zwei Stationen.'));
    document.querySelectorAll('[data-laufzettel],[data-perspektive]').forEach(el => {
      el.hidden = !valid || !selected.includes(el.dataset.laufzettel || el.dataset.perspektive);
    });
  }
  choices.forEach(el => el.addEventListener('change', update));
  document.addEventListener('journal-geloescht', update);
  update();
});
