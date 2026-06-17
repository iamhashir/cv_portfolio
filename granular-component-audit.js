const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DETAILED_AUDIT = {
  timestamp: new Date().toISOString(),
  pages: {},
  issues: [],
  improvements: []
};

async function testElementVisiblity(page, selector, elementName) {
  try {
    const elements = await page.locator(selector).all();
    const results = [];

    for (let i = 0; i < Math.min(elements.length, 3); i++) {
      const el = elements[i];
      const visible = await el.isVisible();
      const box = await el.boundingBox();
      const text = await el.textContent();

      if (visible && box) {
        const styles = await el.evaluate(e => {
          const cs = window.getComputedStyle(e);
          const rect = e.getBoundingClientRect();
          return {
            computed: {
              color: cs.color,
              backgroundColor: cs.backgroundColor,
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
              padding: cs.padding,
              outline: cs.outline,
              outlineOffset: cs.outlineOffset,
              minHeight: cs.minHeight,
              cursor: cs.cursor
            },
            rect: {
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              top: Math.round(rect.top),
              left: Math.round(rect.left)
            },
            text: e.textContent?.substring(0, 40) || 'No text'
          };
        });

        results.push({
          index: i,
          visible: true,
          size: `${Math.round(box.width)}×${Math.round(box.height)}`,
          text: text?.substring(0, 40),
          styles,
          accessible: box.width >= 44 && box.height >= 44,
          hasOutline: styles.computed.outline !== 'none'
        });
      }
    }

    return {
      selector,
      elementName,
      count: elements.length,
      results
    };
  } catch (e) {
    return {
      selector,
      elementName,
      error: e.message
    };
  }
}

async function auditPage(page, pageName, viewport) {
  console.log(`\n  📄 ${pageName} (${viewport.name})`);

  const audit = {
    pageName,
    viewport: viewport.name,
    components: {},
    scrollTests: [],
    focusTests: [],
    hoverTests: []
  };

  // Test all major component types
  const selectors = [
    { selector: 'button', name: 'buttons' },
    { selector: 'a:not([role="button"])', name: 'links' },
    { selector: '[role="button"]', name: 'button-roles' },
    { selector: 'h1, h2, h3', name: 'headings' },
    { selector: '.ctaPrimary, .ctaSecondary', name: 'cta-buttons' },
    { selector: '.card, [class*="card"]', name: 'cards' },
    { selector: 'input, textarea, select', name: 'form-inputs' },
    { selector: 'nav, [role="navigation"]', name: 'navigation' },
    { selector: '.badge, .tag, [class*="badge"]', name: 'badges' }
  ];

  for (const {selector, name} of selectors) {
    const result = await testElementVisiblity(page, selector, name);
    audit.components[name] = result;
  }

  // Test scroll positions for readability
  const scrollPositions = [0, 0.3, 0.6, 1.0];
  for (const pos of scrollPositions) {
    await page.evaluate((p) => {
      const max = document.body.scrollHeight - window.innerHeight;
      window.scrollTo(0, max * p);
    }, pos);

    await page.waitForTimeout(200);

    const text = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h1, h2, p, span'))
        .filter(e => e.offsetHeight > 0);
      return elements.map(e => ({
        tag: e.tagName,
        text: e.textContent?.substring(0, 20),
        visible: e.offsetHeight > 0,
        style: window.getComputedStyle(e).color
      })).slice(0, 5);
    });

    audit.scrollTests.push({
      position: `${Math.round(pos * 100)}%`,
      visibleElements: text
    });
  }

  // Test focus management
  const focusTrace = [];
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        text: el?.textContent?.substring(0, 30),
        hasOutline: window.getComputedStyle(el || new Element()).outline !== 'none'
      };
    });
    focusTrace.push(focused);
  }
  audit.focusTests = focusTrace;

  // Test first button hover
  const firstButton = await page.locator('button, [role="button"]').first();
  if (firstButton) {
    await firstButton.hover();
    await page.waitForTimeout(200);

    const hoverStyle = await firstButton.evaluate(e => {
      const cs = window.getComputedStyle(e);
      return {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        boxShadow: cs.boxShadow,
        transform: cs.transform,
        opacity: cs.opacity
      };
    });

    audit.hoverTests.push({
      element: 'first-button',
      hasHoverFeedback: hoverStyle.boxShadow !== 'none' || hoverStyle.color !== 'rgb(0, 0, 0)',
      hoverStyles: hoverStyle
    });
  }

  return audit;
}

async function runGranularAudit() {
  const browser = await chromium.launch();
  const auditDir = path.join(__dirname, 'granular-audit-results');

  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  console.log('\n🔬 GRANULAR COMPONENT-LEVEL AUDIT\n' + '='.repeat(70));

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  const pages = [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
    { path: '/work', name: 'work' }
  ];

  for (const viewport of viewports) {
    console.log(`\n📱 ${viewport.name.toUpperCase()} (${viewport.width}×${viewport.height})`);

    for (const page of pages) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      const p = await context.newPage();

      try {
        await p.goto(`http://localhost:3000${page.path}`, { waitUntil: 'networkidle' });
        await p.waitForTimeout(500);

        // Run audit
        const audit = await auditPage(p, page.name, viewport);

        const pageKey = `${page.name}-${viewport.name}`;
        DETAILED_AUDIT.pages[pageKey] = audit;

        // Take screenshot
        const screenshotPath = path.join(auditDir, `${pageKey}-audit.png`);
        await p.screenshot({ path: screenshotPath });
        console.log(`    ✓ Audit complete, screenshot saved`);

        // Analyze for issues
        Object.entries(audit.components).forEach(([name, data]) => {
          if (data.results) {
            data.results.forEach(result => {
              if (!result.accessible) {
                DETAILED_AUDIT.issues.push({
                  page: page.name,
                  viewport: viewport.name,
                  component: name,
                  issue: `Element too small: ${result.size} (need 44×44)`,
                  text: result.text
                });
              }
              if (!result.hasOutline) {
                DETAILED_AUDIT.issues.push({
                  page: page.name,
                  viewport: viewport.name,
                  component: name,
                  issue: 'No focus outline detected',
                  text: result.text
                });
              }
            });
          }
        });

      } catch (error) {
        console.error(`    ✗ Error: ${error.message}`);
      }

      await context.close();
    }
  }

  await browser.close();

  // Save detailed report
  const reportPath = path.join(auditDir, 'granular-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(DETAILED_AUDIT, null, 2));

  console.log(`\n✅ Granular audit complete!`);
  console.log(`📋 Report saved to: ${reportPath}`);
  console.log(`📸 Screenshots saved to: ${auditDir}`);
  console.log(`\n🔍 Issues found: ${DETAILED_AUDIT.issues.length}`);

  if (DETAILED_AUDIT.issues.length > 0) {
    console.log('\nTop Issues:');
    DETAILED_AUDIT.issues.slice(0, 5).forEach(issue => {
      console.log(`  - ${issue.page}: ${issue.issue}`);
    });
  }

  return DETAILED_AUDIT;
}

runGranularAudit().catch(console.error);
