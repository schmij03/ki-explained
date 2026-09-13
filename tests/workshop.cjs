const {chromium} = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.TEST_URL||'http://127.0.0.1:8765';
 for(const path of ['','kapitel-1/','kapitel-2/','kapitel-3/','kapitel-4/','pruefungsvorbereitung/','projekt/']) {
  await page.goto(base+'/'+path);
  assert.equal(await page.locator('h1').count(),1);
  const broken=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));
  assert.deepEqual(broken,[],path);
  for(const width of [1280,390]) {await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${path} ${width}`);}
 }
 await page.goto(base+'/kapitel-1/');
 await page.locator('#gewicht').evaluate(el=>{el.value=160;el.dispatchEvent(new Event('input'));});
 assert.match(await page.locator('#obst-ergebnis').innerText(),/Apfel/);
 await page.locator('#beispiel-ergaenzen').click();
 assert.match(await page.locator('#obst-ergebnis').innerText(),/Vorhersage: Birne/);
 await page.locator('#labor-reset').click();
 await page.locator('#gewicht').evaluate(el=>{el.value=140;el.dispatchEvent(new Event('input'));});
 assert.match(await page.locator('#obst-ergebnis').innerText(),/Unentschieden/);
 await page.locator('#obst').fill('Gewicht allein genügt nicht.');
 await page.locator('[data-erledigt]').check();await page.reload();
 assert.equal(await page.locator('#obst').inputValue(),'Gewicht allein genügt nicht.');
 assert(await page.locator('[data-erledigt]').isChecked());
 const q=page.locator('.frage').first(); await q.locator('.antwort-knopf').nth(1).click();
 await q.getByRole('button',{name:'Nochmals versuchen'}).click();assert(await q.locator('.antwort-knopf').first().isEnabled());
 await page.goto(base+'/kapitel-2/');await page.locator('#satzkontext').selectOption('velo');await page.locator('#wort-ziehen').click();
 assert.match(await page.locator('#wort-ausgabe').innerText(),/Gezogene Fortsetzung/);
 await page.locator('#chatbot-eingabe').fill('Ich bin müde');await page.locator('#chatbot-formular').evaluate(f=>f.requestSubmit());
 await page.waitForFunction(()=>document.querySelectorAll('.chat-blase').length>=2);
 await page.goto(base+'/kapitel-3/');await page.locator('#prompt-ziel').fill('Prozentrechnen');await page.locator('#prompt-kontext').fill('3. Sek');
 await page.getByRole('button',{name:'Prompt zusammensetzen'}).click();assert.match(await page.locator('#prompt-ergebnis').inputValue(),/Prozentrechnen/);
 await page.goto(base+'/kapitel-4/');await page.locator('#quellen-pruefen').click();assert.match(await page.locator('#quellen-feedback').innerText(),/zuerst/);
 for(const [id,v] of [['start','belegt'],['bib','widerspruch'],['frist','offen']])await page.locator('#check-'+id).selectOption(v);
 await page.locator('#quellen-pruefen').click();assert.match(await page.locator('#quellen-feedback').innerText(),/3\/3 richtig/);
 await page.goto(base+'/projekt/');await page.locator('#projekt').fill('Unser Lernhelfer');
 const dl=page.waitForEvent('download');await page.locator('[data-export]').click();assert.equal((await dl).suggestedFilename(),'ki-lernjournal.txt');
 await page.goto(base);assert.match(await page.locator('#abschlussstand').innerText(),/1 von 4/);
 await page.setViewportSize({width:1280,height:900});if(process.env.SCREENSHOT_DIR) await page.screenshot({path:process.env.SCREENSHOT_DIR+'/home.png',fullPage:true});
 await page.goto(base+'/kapitel-3/#werkstatt');if(process.env.SCREENSHOT_DIR) await page.screenshot({path:process.env.SCREENSHOT_DIR+'/workshop.png'});
 page.on('dialog',d=>d.accept());await page.goto(base);await page.locator('#fortschritt-loeschen').click();assert.match(await page.locator('#abschlussstand').innerText(),/0 von 4/);
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}));
 const p=await blocked.newPage();await p.goto(base+'/kapitel-1/');assert.match(await p.locator('.speicherstatus').innerText(),/nicht möglich/);await p.locator('#obst').fill('Export funktioniert weiterhin.');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: seven pages, mobile/desktop, labs, quiz retry, journal persistence/export/reset, blocked storage.');
})().catch(e=>{console.error(e);process.exit(1)});
