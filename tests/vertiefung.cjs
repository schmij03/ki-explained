const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),key='kiExplainedWerkstattV1';
const errors=[];
async function load(folder,{open=true,storage=null,blocked=false,hash=''}={}) {
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,folder,'index.html'),'utf8'),{
  url:'https://example.org/'+folder+'/'+hash,runScripts:'dangerously',virtualConsole:vc,
  beforeParse(w){
   if(blocked)Object.defineProperty(w,'localStorage',{get(){throw Error('blocked')}});
   else if(storage)w.localStorage.setItem(key,JSON.stringify(storage));
   w.URL.createObjectURL=()=> 'blob:test';w.URL.revokeObjectURL=()=>{};
   w.HTMLAnchorElement.prototype.click=function(){};
  }
 });
 const w=dom.window;
 for(const name of ['konfiguration.js','script.js','werkstatt.js','vertiefung.js','lernseiten.js']){
  let src=fs.readFileSync(path.join(root,'assets',name),'utf8');
  if(open && name==='konfiguration.js')src=src.replace('vertiefungSichtbar: false','vertiefungSichtbar: true');
  w.eval(src);
 }
 await new Promise(r=>w.addEventListener('load',r,{once:true}));
 return {w,d:w.document,close:()=>w.close(),saved:()=>JSON.parse(w.localStorage.getItem(key))};
}
async function exported(x){
 let blob;x.w.URL.createObjectURL=b=>{blob=b;return 'blob:test'};x.d.querySelector('[data-export]').click();
 return new Promise(resolve=>{const reader=new x.w.FileReader();reader.onload=()=>resolve(reader.result);reader.readAsText(blob)});
}
function input(x,id,value){const el=x.d.getElementById(id);el.value=value;el.dispatchEvent(new x.w.Event('input'));}
(async()=>{
 // Protected main content is byte-identical to the pre-extension baseline.
 for(const [file,expected] of Object.entries(require('./basis-inhalte.json'))){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  const main=html.slice(html.indexOf('<main'),html.indexOf('</main>')+7);
  assert.equal(require('node:crypto').createHash('sha256').update(main).digest('hex'),expected,file);
 }
 const folders=['','kapitel-1','kapitel-2','kapitel-3','kapitel-4','projekt','pruefungsvorbereitung','kompetenzen','vertiefung-1','vertiefung-2'];
 for(const folder of folders){
  let x=await load(folder,{open:false,hash:'#lernseite-4'});
  assert([...x.d.querySelectorAll('[data-freischaltung]')].every(el=>el.hidden));
  if(folder.startsWith('vertiefung')){
   assert.match(x.d.querySelector('main').textContent,/Diese Vertiefung wird ab dem 13.01.2027 freigeschaltet/);
   assert.equal(x.d.querySelectorAll('[data-journal],.lernseite,.lernseiten-kopf').length,0);
  }else{
   const before=fs.readFileSync(path.join(root,folder,'index.html'),'utf8');
   assert(before.includes('data-freischaltung'));
   assert(x.d.querySelector('.lernseiten-kopf'));
  }
  x.close();x=await load(folder);
  assert([...x.d.querySelectorAll('[data-freischaltung]')].every(el=>!el.hidden));
  for(const n of [1,2])assert(x.d.querySelector(`.hauptnav a[href*="vertiefung-${n}"]`) || folder===`vertiefung-${n}`);
  if(folder.startsWith('vertiefung')){
   assert.equal(x.d.querySelectorAll('.lernseite').length,7);
   assert.equal(x.d.querySelectorAll('h1').length,1);
   for(const a of x.d.querySelectorAll('a[href^="https:"]')){
    assert.equal(a.target,'_blank');assert.equal(a.rel,'noopener noreferrer');
    assert.match(a.nextElementSibling?.textContent||'',/öffnet einen externen Dienst/);
   }
   assert.equal(x.d.querySelectorAll('iframe,script[src^="http"],link[href^="http"]').length,0);
  }
  x.close();
 }
 const old={notes:{obst:'Altes Journal',projekt:'Altes Projekt','kompass-verstehen-vorher':'Mit Unterstützung'},done:{1:true,4:true}};
 let x=await load('vertiefung-1',{storage:old});
 input(x,'vertiefung-1-exit','Mehr Hintergründe testen.');
 input(x,'vertiefung-1-ziel-1','3');
 let state=x.saved();assert.equal(state.notes.obst,old.notes.obst);assert.deepEqual(state.done,old.done);
 assert.equal(state.notes['vertiefung-1-ziel-1'],'3');
 x.close();x=await load('vertiefung-2',{storage:state});
 const choices=[...x.d.querySelectorAll('[data-stationenwahl]')];
 const sheets=()=>[...x.d.querySelectorAll('[data-laufzettel]')].filter(el=>!el.hidden).map(el=>el.dataset.laufzettel);
 assert.deepEqual(sheets(),[]);assert.match(x.d.querySelector('#stationen-hinweis').textContent,/Aktuell gewählt: 0/);
 choices[0].click();assert.deepEqual(sheets(),[]);assert(!choices[0].checkValidity());
 choices[2].click();assert.deepEqual(sheets(),['A','C']);assert(choices[0].checkValidity());
 input(x,'vertiefung-2-a-leitfrage','Plausibel heisst nicht wahr.');
 input(x,'vertiefung-2-a-perspektive','technologisch');
 x.d.getElementById('vertiefung-2-wunsch-tm').click();x.d.getElementById('vertiefung-2-wunsch-papier').click();
 input(x,'vertiefung-2-wunsch-freitext','Datenschutz untersuchen');
 choices[1].click();assert.deepEqual(sheets(),[]);assert.match(x.d.querySelector('#stationen-hinweis').textContent,/Aktuell gewählt: 3/);
 choices[3].click();assert.match(x.d.querySelector('#stationen-hinweis').textContent,/Aktuell gewählt: 4/);
 choices[0].click();choices[2].click();assert.deepEqual(sheets(),['B','D']);
 assert.equal(x.d.getElementById('vertiefung-2-a-leitfrage').value,'Plausibel heisst nicht wahr.');
 for(const hash of ['station-d','laufzettel','lernseite-7','wahl']){
  x.w.location.hash=hash;x.w.dispatchEvent(new x.w.HashChangeEvent('hashchange'));
  assert.equal(x.d.querySelectorAll('.lernseite:not([hidden])').length,1);
 }
 assert.equal(x.d.getElementById('vertiefung-2-wunsch-freitext').value,'Datenschutz untersuchen');
 state=x.saved();x.close();x=await load('vertiefung-2',{storage:state});
 assert.deepEqual([...x.d.querySelectorAll('[data-stationenwahl]:checked')].map(el=>el.value),['B','D']);
 assert.equal(x.d.getElementById('vertiefung-2-a-perspektive').value,'technologisch');
 assert(x.d.getElementById('vertiefung-2-wunsch-tm').checked);
 assert(x.d.getElementById('vertiefung-2-wunsch-papier').checked);
 x.w.dispatchEvent(new x.w.Event('beforeprint'));
 assert.equal(x.d.getElementById('vertiefung-2-a-leitfrage').nextElementSibling.textContent,'Plausibel heisst nicht wahr.');
 state=x.saved();x.close();
 // Export from the homepage includes both new areas even when they are locked.
 x=await load('',{storage:state,open:false});const text=await exported(x);
 for(const pattern of [/VERTIEFUNG 1: Wir trainieren eine KI/,/VERTIEFUNG 2: KI-Werkstatt/,/Mehr Hintergründe/,/Station A: Antwort auf die Leitfrage/,/Plausibel heisst nicht wahr/,/Datenschutz untersuchen/,/Altes Journal/])assert.match(text,pattern);
 x.w.confirm=()=>false;x.d.querySelector('#fortschritt-loeschen').click();assert.equal(x.saved().notes.obst,'Altes Journal');
 x.w.confirm=()=>true;x.d.querySelector('#fortschritt-loeschen').click();state=x.saved();assert.deepEqual(state,{notes:{},done:{}});x.close();
 x=await load('vertiefung-2',{storage:state});assert.equal(x.d.querySelectorAll('[data-stationenwahl]:checked').length,0);assert.equal(x.d.getElementById('vertiefung-2-a-leitfrage').value,'');x.close();
 for(const folder of ['vertiefung-1','vertiefung-2']){
  x=await load(folder,{blocked:true});assert.match(x.d.querySelector('.speicherstatus').textContent,/nicht möglich/);
  const note=x.d.querySelector('textarea[data-journal]');input(x,note.id,'Auch ohne Speicher exportiert.');
  assert.match(await exported(x),/Auch ohne Speicher exportiert/);x.close();
  // Readable HTML fallback without evaluating any script.
  const dom=new JSDOM(fs.readFileSync(path.join(root,folder,'index.html'),'utf8'));
  assert.equal(dom.window.document.querySelectorAll('[data-lernseite]:not([hidden])').length,7);dom.window.close();
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: Freischaltung, sieben Schritte, genau zwei Stationen, Laufzettel, Auswahlwechsel, alte Journale, Export beider Bereiche, Löschen, gesperrter Speicher, Drucktexte, externe Links und HTML ohne JavaScript.');
})().catch(e=>{console.error(e);process.exit(1)});
