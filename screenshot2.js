const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 5000 });
  await page.screenshot({ path: './homepage2.png', fullPage: true });
  console.log('Screenshot 2 saved');
  await browser.close();
})();
