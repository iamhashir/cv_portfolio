const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Check theme attribute on html
  const htmlTheme = await page.evaluate(() => {
    return {
      theme: document.documentElement.getAttribute('data-theme'),
      class: document.documentElement.className,
      computedBg: window.getComputedStyle(document.documentElement).backgroundColor || 'not set'
    };
  });
  
  console.log('Theme state:', JSON.stringify(htmlTheme, null, 2));
  
  // Check viewport size
  const body = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));
  console.log('Viewport:', body);
  
  await browser.close();
})();
