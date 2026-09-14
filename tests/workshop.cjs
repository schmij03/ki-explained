const {chromium} = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const reveal=async selector=>{const id=await page.locator(selector).first().evaluate(el=>el.closest('.lernseite').id);await page.evaluate(id=>{location.hash=id;},id);await page.locator(selector).first().waitFor({state:'visible'});};
 const base=process.env.TEST_URL||'http://127.0.0.1:8765';
 for(const path of ['','kapitel-1/','kapitel-2/','kapitel-3/','kapitel-4/','pruefungsvorbereitung/','projekt/','kompetenzen/']) {
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
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}));
 const p=await blocked.newPage();await p.goto(base+'/kapitel-1/#werkstatt');assert.match(await p.locator('.speicherstatus').textContent(),/nicht möglich/);await p.locator('#obst').fill('Export funktioniert weiterhin.');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: eight pages and compass, mobile/desktop, labs, quiz retry, journal persistence/export/reset, blocked storage.');
})().catch(e=>{console.error(e);process.exit(1)});
