const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');let saved=null;const errors=[];
async function load(p,blocked=false){
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,p,'index.html'),'utf8'),{url:'https://example.org/'+p+'/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  if(blocked)Object.defineProperty(w,'localStorage',{get(){throw Error('denied')}});
  else if(saved)w.localStorage.setItem('kiExplainedWerkstattV1',saved);
  w.URL.createObjectURL=()=> 'blob:test';w.URL.revokeObjectURL=()=>{};
 }});
 const w=dom.window;for(const name of ['script.js','werkstatt.js'])w.eval(fs.readFileSync(path.join(root,'assets',name),'utf8'));
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
 assert.deepEqual(errors,[]);console.log('PASS: all 7 page scripts; four labs; tie case; quiz retry and scoring; persisted notes and completion; reset; blocked storage; stored text treated as text.');
})().catch(e=>{console.error(e);process.exit(1)});
