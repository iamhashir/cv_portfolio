const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Check theme toggle
  const themeToggle = await page.$('button[aria-label*="theme"]') || await page.$('[class*="theme"]');
  console.log('Theme toggle found:', !!themeToggle);
  
  // Check for project cards
  const cards = await page.$$('[class*="card"], [class*="project"]');
  console.log('Project-like elements:', cards.length);
  
  // Check data
  const systemCount = await page.evaluate(() => {
    return document.body.innerText.includes('SYSTEMS') ? 'SYSTEMS text found' : 'SYSTEMS text NOT found';
  });
  console.log('Data status:', systemCount);
  
  // Get actual innerHTML of body for debugging
  const bodyText = await page.evaluate(() => document.body.innerText.split('\n').slice(0, 50).join('\n'));
  console.log('Page text (first 50 lines):\n', bodyText);
  
  await browser.close();
})();
