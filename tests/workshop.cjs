const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const reveal=async selector=>{const id=await page.locator(selector).first().evaluate(el=>el.closest('.lernseite').id);await page.evaluate(id=>{location.hash=id;},id);await page.locator(selector).first().waitFor({state:'visible'});};
 const base=process.env.TEST_URL||'http://127.0.0.1:8765';
 // Default configuration remains false. Check direct links before intercepting it.
 for(const folder of ['','kapitel-1/','vertiefung-1/','vertiefung-2/']) {
  await page.goto(base+'/'+folder+'#lernseite-4');
  assert.equal(await page.locator('[data-freischaltung]:visible').count(),0);
  if(folder.startsWith('vertiefung')) {
   assert.match(await page.locator('main').innerText(),/Diese Vertiefung wird ab dem 13.01.2027 freigeschaltet/);
   assert.equal(await page.locator('[data-journal],.lernseite').count(),0);
   await page.emulateMedia({media:'print'});
   assert(await page.locator('.freischaltung').isVisible());
   await page.emulateMedia({media:'screen'});
  }
 }
 const openConfig=fs.readFileSync(path.join(__dirname,'../assets/konfiguration.js'),'utf8').replace('vertiefungSichtbar: false','vertiefungSichtbar: true');
 await page.context().route('**/assets/konfiguration.js',route=>route.fulfill({contentType:'text/javascript',body:openConfig}));
 for(const path of ['','kapitel-1/','kapitel-2/','kapitel-3/','kapitel-4/','pruefungsvorbereitung/','projekt/','kompetenzen/','vertiefung-1/','vertiefung-2/']) {
  await page.goto(base+'/'+path);
  assert.equal(await page.locator('h1').count(),1);
  const broken=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));
  assert.deepEqual(broken,[],path);
  for(const [width,height] of [[768,1024],[1024,768],[390,844]]) {
   await page.setViewportSize({width,height});
   const count=await page.locator('.lernseite').count();
   for(let i=0;i<count;i++) {
    await page.locator('#lernseiten-auswahl').selectOption(String(i));
    await page.waitForFunction(i=>document.querySelector('#lernseiten-auswahl').value===String(i)&&!document.querySelectorAll('.lernseite')[i].hidden,i);
    assert.equal(await page.locator('.lernseite:visible').count(),1);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${path} ${width} step ${i}`);
   }
  }
  await page.locator('#lernseiten-auswahl').selectOption('0');
  await page.waitForFunction(()=>!document.querySelector('.lernseite').hidden);
  await page.locator('.lernseiten-fuss button:last-child').click();
  await page.waitForFunction(()=>location.hash==='#lernseite-2');await page.goBack();
  await page.waitForFunction(()=>!document.querySelector('.lernseite').hidden);
 }
 // New pages: 320 px and enlarged text in addition to the shared three sizes.
 for(const folder of ['vertiefung-1','vertiefung-2']) {
  for(const size of [18,32]) {
   await page.goto(base+'/'+folder+'/');await page.setViewportSize({width:320,height:844});
   await page.addStyleTag({content:`body {font-size:${size}px}`});
   for(let i=0;i<7;i++) {
    await page.locator('#lernseiten-auswahl').selectOption(String(i));
    await page.waitForFunction(i=>!document.querySelectorAll('.lernseite')[i].hidden,i);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${folder} 320 font ${size} step ${i}`);
   }
  }
 }
 await page.setViewportSize({width:768,height:1024});
 await page.goto(base+'/vertiefung-1/#fehler');
 assert(await page.locator('#fehler').isVisible());
 await page.locator('#vertiefung-1-fehler-1-aenderung').fill('Anderer Hintergrund');
 await page.locator('.lernseiten-fuss button:last-child').click();
 await page.locator('.lernseiten-fuss button:first-child').click();
 assert.equal(await page.locator('#vertiefung-1-fehler-1-aenderung').inputValue(),'Anderer Hintergrund');
 await page.reload();assert.equal(await page.locator('#vertiefung-1-fehler-1-aenderung').inputValue(),'Anderer Hintergrund');
 await page.emulateMedia({media:'print'});
 assert.equal(await page.locator('.lernseite:visible').count(),7);
 await page.emulateMedia({media:'screen'});
 await page.goto(base+'/vertiefung-2/#wahl');
 const hint=page.locator('#stationen-hinweis');
 assert.match(await hint.innerText(),/Aktuell gewählt: 0/);
 // Keyboard operation of station choice.
 await page.locator('#vertiefung-2-wahl-a').focus();await page.keyboard.press('Space');
 assert.match(await hint.innerText(),/Aktuell gewählt: 1/);
 await page.locator('#vertiefung-2-wahl-c').check();assert.match(await hint.innerText(),/A und C/);
 await page.locator('#vertiefung-2-wahl-b').check();assert.match(await hint.innerText(),/Aktuell gewählt: 3/);
 await page.locator('#vertiefung-2-wahl-b').uncheck();
 await reveal('#laufzettel');
 assert.equal(await page.locator('[data-laufzettel]:visible').count(),2);
 assert(await page.locator('[data-laufzettel="A"]').isVisible());assert(await page.locator('[data-laufzettel="C"]').isVisible());
 await page.locator('#vertiefung-2-a-leitfrage').fill('Plausibel heisst nicht wahr.');
 await page.reload();assert.equal(await page.locator('#vertiefung-2-a-leitfrage').inputValue(),'Plausibel heisst nicht wahr.');
 assert(await page.locator('#vertiefung-2-wahl-a').isChecked());
 await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));
 await page.emulateMedia({media:'print'});
 assert.equal(await page.locator('.lernseite:visible').count(),7);
 assert.equal(await page.locator('[data-laufzettel]:visible').count(),2);
 assert.match(await page.locator('#vertiefung-2-a-leitfrage + .druckantwort').innerText(),/Plausibel heisst nicht wahr/);
 if(process.env.SCREENSHOT_DIR)await page.pdf({path:process.env.SCREENSHOT_DIR+'/vertiefung-2.pdf',format:'A4',preferCSSPageSize:true});
 await page.emulateMedia({media:'screen'});
 await reveal('#wahl');await page.locator('#vertiefung-2-wahl-c').uncheck();
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('[data-laufzettel]:visible').count(),4);
 await page.emulateMedia({media:'screen'});await page.locator('#vertiefung-2-wahl-c').check();
 await reveal('#sicherung');await page.locator('#vertiefung-2-wunsch-tm').check();await page.locator('#vertiefung-2-wunsch-bilder').check();
 await page.reload();assert(await page.locator('#vertiefung-2-wunsch-tm').isChecked());
 const extensionDownload=page.waitForEvent('download');await page.locator('[data-export]:visible').click();
 const downloaded=await extensionDownload;
 const exported=fs.readFileSync(await downloaded.path(),'utf8');
 assert.match(exported,/VERTIEFUNG 1/);assert.match(exported,/VERTIEFUNG 2/);assert.match(exported,/Plausibel heisst nicht wahr/);
 if(process.env.SCREENSHOT_DIR)await page.screenshot({path:process.env.SCREENSHOT_DIR+'/vertiefung-2.png',fullPage:true});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const staticPage=await nojs.newPage();await staticPage.goto(base+'/vertiefung-1/');
 assert.equal(await staticPage.locator('[data-lernseite]:visible').count(),7);await nojs.close();
 await page.goto(base+'/kapitel-1/#werkstatt');
 await page.locator('#gewicht').evaluate(el=>{el.value=160;el.dispatchEvent(new Event('input'));});
 assert.match(await page.locator('#obst-ergebnis').innerText(),/Apfel/);
 await page.locator('#beispiel-ergaenzen').click();
 assert.match(await page.locator('#obst-ergebnis').innerText(),/Vorhersage: Birne/);
 await page.locator('#labor-reset').click();
 await page.locator('#gewicht').evaluate(el=>{el.value=140;el.dispatchEvent(new Event('input'));});
 assert.match(await page.locator('#obst-ergebnis').innerText(),/Unentschieden/);
 await page.locator('#obst').fill('Gewicht allein genügt nicht.');
 await reveal('[data-erledigt]');await page.locator('[data-erledigt]').check();await page.reload();
 assert.equal(await page.locator('#obst').inputValue(),'Gewicht allein genügt nicht.');
 assert(await page.locator('[data-erledigt]').isChecked());
 await reveal('.frage');const q=page.locator('.frage').first(); await q.locator('.antwort-knopf').nth(1).click();
 await q.getByRole('button',{name:'Nochmals versuchen'}).click();assert(await q.locator('.antwort-knopf').first().isEnabled());
 await page.goto(base+'/kapitel-2/#werkstatt');await page.locator('#satzkontext').selectOption('velo');await page.locator('#wort-ziehen').click();
 assert.match(await page.locator('#wort-ausgabe').innerText(),/Gezogene Fortsetzung/);
 await reveal('#chatbot-eingabe');await page.locator('#chatbot-eingabe').fill('Ich bin müde');await page.locator('#chatbot-formular').evaluate(f=>f.requestSubmit());
 await page.waitForFunction(()=>document.querySelectorAll('.chat-blase').length>=2);
 await page.goto(base+'/kapitel-3/#werkstatt');await page.locator('#prompt-ziel').fill('Prozentrechnen');await page.locator('#prompt-kontext').fill('3. Sek');
 await page.getByRole('button',{name:'Prompt zusammensetzen'}).click();assert.match(await page.locator('#prompt-ergebnis').inputValue(),/Prozentrechnen/);
 await page.goto(base+'/kapitel-4/#werkstatt');await page.locator('#quellen-pruefen').click();assert.match(await page.locator('#quellen-feedback').innerText(),/zuerst/);
 for(const [id,v] of [['start','belegt'],['bib','widerspruch'],['frist','offen']])await page.locator('#check-'+id).selectOption(v);
 await page.locator('#quellen-pruefen').click();assert.match(await page.locator('#quellen-feedback').innerText(),/3\/3 richtig/);
 await page.goto(base+'/projekt/#projekt');await page.locator('#projekt').fill('Unser Lernhelfer');
 await reveal('[data-export]');const dl=page.waitForEvent('download');await page.locator('[data-export]').click();assert.equal((await dl).suggestedFilename(),'ki-lernjournal.txt');
 await page.goto(base);assert.match(await page.locator('#abschlussstand').innerText(),/1 von 4/);
 await page.setViewportSize({width:1280,height:900});if(process.env.SCREENSHOT_DIR) await page.screenshot({path:process.env.SCREENSHOT_DIR+'/home.png',fullPage:true});
 await page.goto(base+'/kapitel-3/#werkstatt');if(process.env.SCREENSHOT_DIR) await page.screenshot({path:process.env.SCREENSHOT_DIR+'/workshop.png'});
 await page.goto(base+'/kompetenzen/#kompass-verstehen-vorher');
 await page.locator('#kompass-verstehen-vorher').selectOption({label:'Mit Unterstützung'});
 await page.locator('#kompass-verstehen-beleg').fill('Ich vergleiche neue Testfälle.');
 await page.reload();assert.equal(await page.locator('#kompass-verstehen-beleg').inputValue(),'Ich vergleiche neue Testfälle.');
 await reveal('[data-export]');const compassDownload=page.waitForEvent('download');await page.locator('[data-export]').click();
 assert.equal((await compassDownload).suggestedFilename(),'ki-lernjournal.txt');
 if(process.env.SCREENSHOT_DIR) await page.screenshot({path:process.env.SCREENSHOT_DIR+'/compass.png',fullPage:true});
 page.on('dialog',d=>d.accept());await page.goto(base+'/#journal');await page.locator('#fortschritt-loeschen').click();assert.match(await page.locator('#abschlussstand').innerText(),/0 von 4/);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('kiExplainedWerkstattV1'))),{notes:{},done:{}});
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}));
 const p=await blocked.newPage();await p.goto(base+'/kapitel-1/#werkstatt');assert.match(await p.locator('.speicherstatus').textContent(),/nicht möglich/);await p.locator('#obst').fill('Export funktioniert weiterhin.');
 await blocked.route('**/assets/konfiguration.js',route=>route.fulfill({contentType:'text/javascript',body:openConfig}));
 await p.goto(base+'/vertiefung-2/#wahl');assert.match(await p.locator('.speicherstatus').first().textContent(),/nicht möglich/);
 await p.locator('#vertiefung-2-wahl-b').check();await p.locator('#vertiefung-2-wahl-d').check();
 await p.goto(base+'/vertiefung-1/#sicherung');await p.locator('#vertiefung-1-exit').fill('Sitzung exportieren');
 const blockedDownload=p.waitForEvent('download');await p.locator('[data-export]:visible').click();
 assert.match(fs.readFileSync(await (await blockedDownload).path(),'utf8'),/Sitzung exportieren/);
 assert.deepEqual(errors,[]);console.log('PASS: ten areas, default gate, three viewports plus 320 px and enlarged text, stations, keyboard, journal, print CSS, no-JS, original exercises and blocked storage.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
