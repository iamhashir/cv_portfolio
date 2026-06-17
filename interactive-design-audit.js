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

const findings = {
  contrast: [],
  focusStates: [],
  hoverStates: [],
  spacing: [],
  visibility: [],
  interactive: [],
  accessibility: []
};

async function auditInteractiveElements(page, viewport) {
  const pageFindings = {
    viewport: viewport.name,
    buttons: [],
    links: [],
    navigation: [],
    focus: [],
    hover: []
  };

  // Find all buttons
  const buttons = await page.locator('button, a[role="button"]').all();
  console.log(`   Found ${buttons.length} buttons`);

  for (const button of buttons.slice(0, 5)) { // Test first 5 for performance
    try {
      const text = await button.textContent();
      const isVisible = await button.isVisible();

      if (isVisible) {
        // Test hover state
        await button.hover();
        await page.waitForTimeout(100);

        // Test focus state
        await button.focus();
        await page.waitForTimeout(100);

        const box = await button.boundingBox();
        const style = await button.evaluate(el => {
          const cs = window.getComputedStyle(el);
          return {
            color: cs.color,
            backgroundColor: cs.backgroundColor,
            fontSize: cs.fontSize,
            padding: cs.padding,
            minHeight: cs.minHeight,
            minWidth: cs.minWidth,
            outline: cs.outline,
            outlineOffset: cs.outlineOffset
          };
        });

        pageFindings.buttons.push({
          text: text?.substring(0, 30) || 'No text',
          size: box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'N/A',
          style,
          hasMinSize: box ? (box.width >= 44 && box.height >= 44) : false,
          hasOutline: style.outline !== 'none' && style.outline !== ''
        });
      }
    } catch (e) {
      // Skip errors
    }
  }

  // Find all links
  const links = await page.locator('a:not([role="button"])').all();
  console.log(`   Found ${links.length} links`);

  for (const link of links.slice(0, 5)) {
    try {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      const isVisible = await link.isVisible();

      if (isVisible) {
        const style = await link.evaluate(el => {
          const cs = window.getComputedStyle(el);
          return {
            color: cs.color,
            textDecoration: cs.textDecoration,
            outline: cs.outline
          };
        });

        pageFindings.links.push({
          text: text?.substring(0, 30),
          href: href?.substring(0, 50),
          style
        });
      }
    } catch (e) {
      // Skip errors
    }
  }

  return pageFindings;
}

async function testAccessibility(page, viewport) {
  const a11y = {
    viewport: viewport.name,
    skipLink: false,
    ariaLabels: 0,
    focusManagement: false,
    keyboardNav: false
  };

  // Check for skip-to-main link
  const skipLink = await page.locator('.skip-to-main, [href="#main"]').count();
  a11y.skipLink = skipLink > 0;

  // Count aria-labels
  a11y.ariaLabels = await page.locator('[aria-label]').count();

  // Test Tab key navigation
  try {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    a11y.keyboardNav = focused !== 'BODY';
  } catch (e) {
    a11y.keyboardNav = false;
  }

  return a11y;
}

async function runInteractiveAudit() {
  const browser = await chromium.launch();
  const auditDir = path.join(__dirname, 'interactive-audit-results');

  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  console.log('\n🎯 INTERACTIVE DESIGN AUDIT - Testing Every Component\n' + '='.repeat(60));

  const allFindings = {
    timestamp: new Date().toISOString(),
    pages: {}
  };

  for (const viewport of VIEWPORTS) {
    console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

    for (const route of PAGES) {
      console.log(`\n  🔍 Auditing ${route.name}`);
      const pageKey = `${route.name}-${viewport.name}`;

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      const page = await context.newPage();

      try {
        await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        // Test interactive elements
        const interactive = await auditInteractiveElements(page, viewport);

        // Test accessibility
        const a11y = await testAccessibility(page, viewport);

        allFindings.pages[pageKey] = {
          url: `http://localhost:3000${route.path}`,
          interactive,
          accessibility: a11y
        };

        // Take screenshots of different states
        const screenshotBase = path.join(auditDir, `${route.name}-${viewport.name}`);

        // Default state
        await page.screenshot({ path: `${screenshotBase}-default.png` });
        console.log(`    ✓ Default state screenshot`);

        // Hover on first button
        const firstButton = await page.locator('button, a[role="button"]').first();
        if (firstButton) {
          await firstButton.hover();
          await page.waitForTimeout(200);
          await page.screenshot({ path: `${screenshotBase}-hover.png` });
          console.log(`    ✓ Hover state screenshot`);
        }

        // Tab navigation (focus)
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
        await page.screenshot({ path: `${screenshotBase}-focus.png` });
        console.log(`    ✓ Focus state screenshot`);

        // Scroll to middle
        await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${screenshotBase}-scroll.png` });
        console.log(`    ✓ Scroll state screenshot`);

      } catch (error) {
        console.error(`    ✗ Error: ${error.message}`);
        allFindings.pages[pageKey] = { error: error.message };
      }

      await context.close();
    }
  }

  await browser.close();

  // Generate findings report
  const reportPath = path.join(auditDir, 'interactive-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(allFindings, null, 2));

  console.log(`\n✅ Interactive audit complete!`);
  console.log(`📸 Screenshots: ${auditDir}`);
  console.log(`📋 Report: ${reportPath}`);

  return allFindings;
}

runInteractiveAudit().catch(console.error);
