const { chromium } = require('playwright');
const path = require('path');

async function takeScreenshot() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Scroll down to show CTA buttons and content
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);

  const screenshotPath = path.join(__dirname, 'final-design-showcase.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`✅ Final screenshot saved: ${screenshotPath}`);

  await context.close();
  await browser.close();
}

takeScreenshot().catch(console.error);
