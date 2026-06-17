const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'desktop', width: 1440, height: 900 }
];

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/work', name: 'work' }
];

async function verifyImprovements() {
  const browser = await chromium.launch();
  const screenshotDir = path.join(__dirname, 'design-improvements-screenshots');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('📸 Verifying design improvements...\n');

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();

    for (const route of PAGES) {
      try {
        console.log(`✓ ${route.name} (${viewport.name})`);
        await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const screenshotPath = path.join(screenshotDir, `${route.name}-${viewport.name}-improved.png`);
        await page.screenshot({ path: screenshotPath });

        // Test button hover
        if (route.name === 'home') {
          const buttons = await page.locator('a[href*="cv"], button').first();
          if (buttons) {
            await buttons.hover();
            await page.waitForTimeout(300);
            const hoverPath = path.join(screenshotDir, `${route.name}-${viewport.name}-button-hover.png`);
            await page.screenshot({ path: hoverPath });
          }
        }

        // Check for focus states
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
        const focusPath = path.join(screenshotDir, `${route.name}-${viewport.name}-focus.png`);
        await page.screenshot({ path: focusPath });

      } catch (error) {
        console.error(`✗ Error on ${route.name} (${viewport.name}):`, error.message);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log(`\n✅ Screenshots saved to: ${screenshotDir}`);
}

verifyImprovements().catch(console.error);
