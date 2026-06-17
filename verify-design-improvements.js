const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function verifyImprovements() {
  const browser = await chromium.launch();
  const screenshotDir = path.join(__dirname, 'design-improvements-verified');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('\n✨ VERIFYING DESIGN IMPROVEMENTS\n' + '='.repeat(50));

  const pages = [
    { path: '/', name: 'home', viewports: ['mobile', 'desktop'] },
    { path: '/about', name: 'about', viewports: ['mobile', 'desktop'] },
    { path: '/work', name: 'work', viewports: ['mobile', 'desktop'] }
  ];

  const viewports = {
    mobile: { width: 375, height: 667 },
    desktop: { width: 1440, height: 900 }
  };

  for (const page of pages) {
    for (const viewportName of page.viewports) {
      const viewport = viewports[viewportName];
      const context = await browser.newContext({ viewport });
      const p = await context.newPage();

      try {
        console.log(`\n📱 ${page.name} (${viewportName})`);
        await p.goto(`http://localhost:3000${page.path}`, { waitUntil: 'networkidle' });
        await p.waitForTimeout(500);

        // Hero/header screenshot
        const heroPath = path.join(screenshotDir, `${page.name}-${viewportName}-hero.png`);
        await p.screenshot({ path: heroPath });
        console.log(`   ✓ Hero section`);

        // Scroll to content
        if (page.name !== 'home') {
          await p.evaluate(() => window.scrollBy(0, 300));
          await p.waitForTimeout(300);
        } else {
          await p.evaluate(() => window.scrollBy(0, 400));
          await p.waitForTimeout(300);
        }

        const contentPath = path.join(screenshotDir, `${page.name}-${viewportName}-content.png`);
        await p.screenshot({ path: contentPath });
        console.log(`   ✓ Content section`);

        // Test button hover
        const buttons = await p.locator('a[href*="contact"], a[href*="details"], .ctaLink').first();
        if (buttons) {
          await buttons.hover();
          await p.waitForTimeout(200);
          const hoverPath = path.join(screenshotDir, `${page.name}-${viewportName}-button-hover.png`);
          await p.screenshot({ path: hoverPath });
          console.log(`   ✓ Button hover state`);
        }

      } catch (error) {
        console.error(`   ✗ Error: ${error.message}`);
      }

      await context.close();
    }
  }

  await browser.close();
  console.log(`\n✅ Verification complete. Screenshots: ${screenshotDir}`);
}

verifyImprovements().catch(console.error);
