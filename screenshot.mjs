import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000); // let animations settle

await page.screenshot({ path: 'screenshot.png', fullPage: false });

await browser.close();
console.log('Screenshot saved to screenshot.png');
