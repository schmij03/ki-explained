const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');let saved=null;const errors=[];
async function load(p,blocked=false,hash=''){
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,p,'index.html'),'utf8'),{url:'https://example.org/'+p+'/'+hash,runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  if(blocked)Object.defineProperty(w,'localStorage',{get(){throw Error('denied')}});
  else if(saved)w.localStorage.setItem('kiExplainedWerkstattV1',saved);
  w.URL.createObjectURL=()=> 'blob:test';w.URL.revokeObjectURL=()=>{};
 }});
 const w=dom.window;for(const name of ['konfiguration.js','script.js','werkstatt.js','vertiefung.js','lernseiten.js'])w.eval(fs.readFileSync(path.join(root,'assets',name),'utf8').replace('vertiefungSichtbar: false', 'vertiefungSichtbar: true'));
 await new Promise(r=>w.addEventListener('load',r,{once:true}));
 return {w,d:w.document,keep(){saved=w.localStorage.getItem('kiExplainedWerkstattV1');},close(){w.close()}};
}
(async()=>{
 let x=await load('kapitel-1');let d=x.d;
 assert.match(d.querySelector('#obst-ergebnis').textContent,/Vorhersage: Apfel/);
 d.querySelector('#beispiel-ergaenzen').click();assert.match(d.querySelector('#obst-ergebnis').textContent,/Vorhersage: Birne/);
 d.querySelector('#labor-reset').click();d.querySelector('#gewicht').value=140;d.querySelector('#gewicht').dispatchEvent(new x.w.Event('input'));assert.match(d.querySelector('#obst-ergebnis').textContent,/Unentschieden/);
 const note=d.querySelector('#obst');note.value='<script>unsafe</script> Gewicht allein reicht nicht';note.dispatchEvent(new x.w.Event('input'));
 d.querySelector('[data-erledigt]').click();
 const q=d.querySelector('.frage');q.querySelectorAll('.antwort-knopf')[1].click();assert(q.querySelector('.antwort-knopf').disabled);q.querySelector('.knopf.sekundaer').click();assert(!q.querySelector('.antwort-knopf').disabled);
 x.keep();x.close();x=await load('kapitel-1');assert.match(x.d.querySelector('#obst').value,/Gewicht allein/);assert(x.d.querySelector('[data-erledigt]').checked);x.close();
 x=await load('kapitel-2');d=x.d;d.querySelector('#satzkontext').value='velo';d.querySelector('#satzkontext').dispatchEvent(new x.w.Event('change'));d.querySelector('#wort-ziehen').click();assert.match(d.querySelector('#wort-ausgabe').textContent,/Velo|Trottinett|Skateboard/);x.close();
 x=await load('kapitel-3');d=x.d;d.querySelector('#prompt-ziel').value='Prozentrechnen';d.querySelector('#prompt-kontext').value='3. Sek';d.querySelector('#prompt-baukasten').dispatchEvent(new x.w.Event('submit',{cancelable:true}));assert.match(d.querySelector('#prompt-ergebnis').value,/Prozentrechnen/);x.close();
 x=await load('kapitel-4');d=x.d;d.querySelector('#quellen-pruefen').click();assert.match(d.querySelector('#quellen-feedback').textContent,/zuerst/);
 for(const [id,v] of [['start','belegt'],['bib','widerspruch'],['frist','offen']])d.querySelector('#check-'+id).value=v;
 d.querySelector('#quellen-pruefen').click();assert.match(d.querySelector('#quellen-feedback').textContent,/3\/3/);x.close();
 x=await load('');assert.match(x.d.querySelector('#abschlussstand').textContent,/1 von 4/);x.w.confirm=()=>true;x.d.querySelector('#fortschritt-loeschen').click();assert.match(x.d.querySelector('#abschlussstand').textContent,/0 von 4/);x.keep();x.close();
 x=await load('projekt',true);assert.match(x.d.querySelector('.speicherstatus').textContent,/nicht möglich/);x.close();
 x=await load('pruefungsvorbereitung');d=x.d;const quiz=d.querySelector('.frage');const correct=Number(quiz.dataset.richtig)-1;quiz.querySelectorAll('.antwort-knopf')[correct].click();assert.equal(d.querySelector('[data-quiz-punkte]').textContent,'1');quiz.querySelector('.knopf.sekundaer').click();assert.equal(d.querySelector('[data-quiz-punkte]').textContent,'0');quiz.querySelectorAll('.antwort-knopf')[correct].click();assert.equal(d.querySelector('[data-quiz-punkte]').textContent,'1');x.close();

 x=await load('kompetenzen'); d=x.d;
 for(const id of ['kompass-verstehen-vorher','kompass-verstehen-nachher','kompass-verstehen-beleg']) {
  const el=d.getElementById(id); el.value=el.tagName==='SELECT'?'Mit Unterstützung':'Testfall 160 g begründet'; el.dispatchEvent(new x.w.Event('input'));
 }
 x.keep(); x.close(); x=await load('kompetenzen');
 assert.equal(x.d.getElementById('kompass-verstehen-vorher').value,'Mit Unterstützung');
 assert.match(x.d.getElementById('kompass-verstehen-beleg').value,/160 g/);
 let exported; x.w.URL.createObjectURL=b=>{exported=b;return 'blob:test'};
 x.w.HTMLAnchorElement.prototype.click=function(){}; x.d.querySelector('[data-export]').click();
 const result=await new Promise(resolve=>{const reader=new x.w.FileReader();reader.onload=()=>resolve(reader.result);reader.readAsText(exported)});
 assert.match(result,/Kompetenzkompass – verstehen – beleg/);assert.match(result,/160 g/);x.close();
 x=await load('');x.w.confirm=()=>true;x.d.querySelector('#fortschritt-loeschen').click();x.keep();x.close();
 x=await load('kompetenzen');assert.equal(x.d.getElementById('kompass-verstehen-beleg').value,'');x.close();
 x=await load('kompetenzen',true);assert.match(x.d.querySelector('.speicherstatus').textContent,/nicht möglich/);x.close();
 // Every local link/fragment and label must resolve, including the new page.
 for(const folder of ['', 'kapitel-1','kapitel-2','kapitel-3','kapitel-4','projekt','pruefungsvorbereitung','kompetenzen','vertiefung-1','vertiefung-2']) {
  const file=path.join(root,folder,'index.html'); const dom=new JSDOM(fs.readFileSync(file,'utf8')); const doc=dom.window.document;
  const ids=[...doc.querySelectorAll('[id]')].map(el=>el.id); assert.equal(new Set(ids).size,ids.length,file);
  for(const label of doc.querySelectorAll('label[for]')) assert(doc.getElementById(label.htmlFor),label.htmlFor);
  for(const el of doc.querySelectorAll('a[href],img[src],script[src],link[href]')) {
   const url=el.getAttribute('href')||el.getAttribute('src'); if(/^(https?:|data:|mailto:)/.test(url))continue;
   const [relative,fragment]=url.split('#'); const target=relative?path.resolve(path.dirname(file),relative):file;
   assert(fs.existsSync(target),target);
   if(fragment){const dest=new JSDOM(fs.readFileSync(target,'utf8'));assert(dest.window.document.getElementById(fragment),url);dest.window.close();}
  } dom.window.close();
 }

 for(const folder of ['', 'kapitel-1','kapitel-2','kapitel-3','kapitel-4','projekt','pruefungsvorbereitung','kompetenzen','vertiefung-1','vertiefung-2']) {
  x=await load(folder);d=x.d;
  const pages=[...d.querySelectorAll('.lernseite')]; assert(pages.length>=3,folder);
  assert.equal(pages.filter(p=>!p.hidden).length,1);
  assert(d.querySelector('.lernseiten-fuss button').disabled);
  const ids=[...d.querySelectorAll('[id]')].map(el=>el.id);assert.equal(new Set(ids).size,ids.length);
  const note=d.querySelector('textarea[data-journal],input[data-journal]'); if(note){note.value='Bleibt beim Blättern';note.dispatchEvent(new x.w.Event('input'));}
  for(let i=0;i<pages.length;i++) {
   x.w.location.hash=pages[i].id;x.w.dispatchEvent(new x.w.HashChangeEvent('hashchange'));
   assert(!pages[i].hidden);assert.equal(pages.filter(p=>!p.hidden).length,1);
   assert.equal(d.querySelector('#lernseiten-auswahl').value,String(i));
  }
  assert(d.querySelector('.lernseiten-fuss button:last-child').disabled);
  if(note)assert.equal(note.value,'Bleibt beim Blättern');
  x.w.location.hash=pages[0].id;x.w.dispatchEvent(new x.w.HashChangeEvent('hashchange'));
  assert(!pages[0].hidden);x.close();
 }
 for(const [folder,hash] of [['kapitel-1','werkstatt'],['kapitel-2','chatbot-demo'],['kapitel-3','kompetenzauftrag'],['kompetenzen','quellen'],['','journal'],['vertiefung-1','fehler'],['vertiefung-2','station-c'],['vertiefung-2','laufzettel']]) {
  x=await load(folder,false,'#'+hash);assert(!x.d.getElementById(hash).closest('.lernseite').hidden,hash);x.close();
 }

 x=await load('kapitel-1');d=x.d;
 d.querySelector('.lernseiten-fuss button:last-child').click();
 await new Promise(r=>setTimeout(r,10));assert.equal(d.querySelector('#lernseiten-auswahl').value,'1');
 d.querySelector('.lernseiten-fuss button:first-child').click();
 await new Promise(r=>setTimeout(r,10));assert.equal(d.querySelector('#lernseiten-auswahl').value,'0');
 const choice=d.querySelector('#lernseiten-auswahl');choice.value='2';choice.dispatchEvent(new x.w.Event('change'));
 await new Promise(r=>setTimeout(r,10));assert.equal(x.w.location.hash,'#lernseite-3');
 const firstQuestion=d.querySelector('.frage');firstQuestion.querySelector('.antwort-knopf').click();
 const quizPage=firstQuestion.closest('.lernseite');x.w.location.hash=quizPage.id;
 await new Promise(r=>setTimeout(r,10));assert(firstQuestion.querySelector('.antwort-knopf').disabled);x.close();
 assert.deepEqual(errors,[]);console.log('PASS: all 10 pages, pagination/buttons/deep links/input retention, compass persistence/export/reset and local links; page scripts; four labs; tie case; quiz retry and scoring; persisted notes and completion; reset; blocked storage; stored text treated as text.');
})().catch(e=>{console.error(e);process.exit(1)});
