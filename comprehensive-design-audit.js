const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'desktop', width: 1440, height: 900 }
];

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/work', name: 'work' }
];

const SCROLL_POSITIONS = [0, 0.25, 0.5, 0.75, 1.0];

async function auditComponent(page, selector, componentName) {
  try {
    const element = page.locator(selector).first();
    const count = await element.count();
    if (count === 0) return null;

    const visible = await element.isVisible().catch(() => false);
    const style = await element.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        padding: computed.padding,
        margin: computed.margin,
        outline: computed.outline,
        display: computed.display,
        opacity: computed.opacity
      };
    }).catch(() => ({}));

    return {
      selector,
      componentName,
      visible,
      style,
      found: true
    };
  } catch (error) {
    return {
      selector,
      componentName,
      error: error.message,
      found: false
    };
  }
}

async function runAudit() {
  const browser = await chromium.launch();
  const auditDir = path.join(__dirname, 'comprehensive-audit-results');

  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  const auditResults = {
    timestamp: new Date().toISOString(),
    pages: {}
  };

  console.log('\n📊 COMPREHENSIVE DESIGN AUDIT\n' + '='.repeat(60));

  for (const viewport of VIEWPORTS) {
    console.log(`\n🔍 Auditing ${viewport.name} (${viewport.width}x${viewport.height})`);
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();

    for (const route of ROUTES) {
      console.log(`\n  → ${route.name}`);
      const pageKey = `${route.name}-${viewport.name}`;
      auditResults.pages[pageKey] = {
        url: `http://localhost:3000${route.path}`,
        viewport: viewport.name,
        route: route.name,
        components: {},
        screenshots: []
      };

      try {
        await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(800);

        // Audit components
        const components = [
          { selector: 'button', name: 'buttons' },
          { selector: 'a', name: 'links' },
          { selector: 'h1', name: 'h1-headings' },
          { selector: 'h2', name: 'h2-headings' },
          { selector: 'h3', name: 'h3-headings' },
          { selector: '[role="button"]', name: 'button-roles' },
          { selector: 'input', name: 'inputs' },
          { selector: 'textarea', name: 'textareas' },
          { selector: 'nav', name: 'navigation' },
          { selector: '.ctaPrimary, .ctaSecondary', name: 'cta-buttons' },
          { selector: 'header', name: 'header' },
          { selector: 'section', name: 'sections' },
          { selector: '[aria-label]', name: 'aria-labels' }
        ];

        for (const comp of components) {
          const result = await auditComponent(page, comp.selector, comp.name);
          if (result) {
            auditResults.pages[pageKey].components[comp.name] = result;
          }
        }

        // Take screenshots at different scroll positions
        for (const scrollPos of SCROLL_POSITIONS) {
          const scrollHeight = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
          const scrollY = scrollHeight * scrollPos;

          await page.evaluate((y) => window.scrollTo(0, y), scrollY);
          await page.waitForTimeout(300);

          const screenshotPath = path.join(
            auditDir,
            `${route.name}-${viewport.name}-scroll-${Math.round(scrollPos * 100)}.png`
          );

          await page.screenshot({ path: screenshotPath });
          auditResults.pages[pageKey].screenshots.push({
            scrollPosition: scrollPos,
            scrollY,
            file: path.basename(screenshotPath)
          });
        }

        // Test keyboard navigation
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
        const focusScreenshot = path.join(auditDir, `${route.name}-${viewport.name}-focus-tab.png`);
        await page.screenshot({ path: focusScreenshot });
        console.log(`    ✓ Screenshots taken (${SCROLL_POSITIONS.length} scroll positions + focus)`);

      } catch (error) {
        console.error(`    ✗ Error: ${error.message}`);
        auditResults.pages[pageKey].error = error.message;
      }
    }

    await context.close();
  }

  await browser.close();

  // Save audit results
  const reportPath = path.join(auditDir, 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  console.log(`\n✅ Audit complete. Report saved to: ${reportPath}`);
  console.log(`📸 Screenshots saved to: ${auditDir}`);

  return auditResults;
}

runAudit().catch(console.error);
