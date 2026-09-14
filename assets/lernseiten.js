'use strict';
// Keep the original elements alive: exercises and unsaved input survive page turns.
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  if (!main) return;
  const pages = [];
  function addPage(title) {
    const section = document.createElement('section');
    section.className = 'lernseite';
    section.id = 'lernseite-' + (pages.length + 1);
    section.dataset.title = title;
    section.tabIndex = -1;
    section.setAttribute('aria-label', title);
    pages.push(section);
    return section;
  }
  const explicit = [...main.querySelectorAll(':scope > [data-lernseite]')];
  if (explicit.length) {
    explicit.forEach(el => { const page=addPage(el.dataset.lernseite); page.append(el); });
  } else {
    // Separate the longer compass forms and illustrations into their own steps.
    for (const section of [...main.querySelectorAll(':scope > section')]) {
      if (section.querySelector('.kompetenz-stand')) {
        const intro = document.createElement('section');
        while(section.firstChild && !section.firstChild.matches?.('.kompetenz-stand')) intro.append(section.firstChild);
        section.before(intro);
        for(const field of [...section.querySelectorAll('.kompetenz-stand')]) {
          const part=document.createElement('section');
          const h=document.createElement('h2'); h.textContent='Mein Standort: '+field.querySelector('legend').textContent;
          part.append(h,field); section.before(part);
        }
        const h=document.createElement('h2');h.textContent='Kompass sichern';section.prepend(h);
      }
      if(section.id==='quellen') {
        for(const figure of [...section.querySelectorAll('figure')]) {
          const disclosure=document.createElement('details');
          const summary=document.createElement('summary');summary.textContent=figure.querySelector('figcaption').textContent;
          disclosure.append(summary,figure);section.append(disclosure);
        }
      }
    }
    let page=addPage('Einstieg'), pending=[];
    for(const el of [...main.children]) {
      if(el.matches('h1,.tag')) continue;
      if(el.matches('.etappenleiste')) {el.remove();continue;}
      if(el.matches('script')) continue;
      if(el.id==='theorie-start') {pending.push(el);continue;}
      let title='';
      if(el.matches('h2,h3')) title=el.textContent.trim();
      else if(el.matches('section')) title=el.querySelector('h2')?.textContent.trim()||'';
      else if(el.matches('.frage')) title='Selbsttest · Frage '+(pages.filter(p=>p.dataset.quiz).length+1);
      else if(el.matches('ol') && document.body.dataset.projekt) title='Euer Ablauf';
      else if(el.matches('.quiz-ergebnis')) title='Dein Ergebnis';
      else if(el.matches('.box') && el.querySelector('h2')) title=el.querySelector('h2').textContent.trim();
      else if(el.matches('label[for="projekt"]')) title='Unser Projektentwurf';
      else if(el.matches('details')) {if(el.querySelector('summary')?.textContent.includes('Lehrpersonen')) title='Für Lehrpersonen';}
      if(title && !(el.matches('.lernauftrag') && page===pages[0])) {
        page=addPage(title.replace(/^Etappe \d+:\s*/,''));
        if(el.matches('.frage')) page.dataset.quiz='true';
      }
      if(pending.length){ page.append(...pending);pending=[]; }
      page.append(el);
    }
  }
  const controls=document.createElement('nav');controls.className='lernseiten-kopf';controls.setAttribute('aria-label','Lernschritte');
  const label=document.createElement('label');label.htmlFor='lernseiten-auswahl';label.textContent='Direkt zu';
  const select=document.createElement('select');select.id='lernseiten-auswahl';
  pages.forEach((p,i)=>{const option=document.createElement('option');option.value=i;option.textContent=(i+1)+'. '+p.dataset.title;select.append(option);});
  const home=document.createElement('a');home.href=document.body.dataset.startseite?'#lernseite-1':'../index.html';home.textContent='Themenübersicht';
  controls.append(home,label,select);
  const bottom=document.createElement('nav');bottom.className='lernseiten-fuss';bottom.setAttribute('aria-label','Seite wechseln');
  const prev=document.createElement('button'),next=document.createElement('button'),status=document.createElement('span');
  prev.type=next.type='button';prev.textContent='← Zurück';next.textContent='Weiter →';status.setAttribute('role','status');
  bottom.append(prev,status,next);main.append(controls,...pages,bottom);
  document.body.classList.add('mit-lernseiten');
  let current=0;
  function show(index,focus=false) {
    current=Math.max(0,Math.min(pages.length-1,index));
    pages.forEach((p,i)=>{p.hidden=i!==current;});select.value=String(current);
    status.textContent='Seite '+(current+1)+' von '+pages.length;
    prev.disabled=current===0;next.disabled=current===pages.length-1;
    if(focus) {
      const heading=pages[current].querySelector('h2,h3')||pages[current];heading.tabIndex=-1;heading.focus({preventScroll:true});
      main.scrollIntoView?.({block:'start',behavior:'instant'});
    }
  }
  function fromHash(focus=false) {
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(_){return;}
    const target=document.getElementById(id);
    const page=target?.closest('.lernseite');
    show(page?pages.indexOf(page):0,focus);
    if(target && page && target!==page) {
      let parent=target.parentElement;
      while(parent && parent!==page){if(parent.matches('details'))parent.open=true;parent=parent.parentElement;}
    }
  }
  function go(index) {location.hash=pages[index].id;}
  prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
  select.addEventListener('change',()=>go(Number(select.value)));
  window.addEventListener('hashchange',()=>fromHash(true));
  // Same-hash links still reveal their target; Back/Forward are handled by hashchange.
  main.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a && a.hash===location.hash)fromHash(true);});
  fromHash();
});
