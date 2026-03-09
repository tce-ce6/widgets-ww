const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);
  
  // click seed shape
  await page.mouse.click(170, 320);
  await page.waitForTimeout(500);
  // click seed colour
  await page.mouse.click(390, 320);
  await page.waitForTimeout(500);
  
  // click next
  await page.mouse.click(500, 792);
  await page.waitForTimeout(1000);
  
  await page.screenshot({path: 'stage2_final.png'});
  await browser.close();
})();
