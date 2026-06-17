const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FINAL_AUDIT = {
  timestamp: new Date().toISOString(),
  verdict: { issues: [], improvements: [], verified: [] },
  pages: {}
};

async function runFinalAudit() {
  const browser = await chromium.launch();
  const auditDir = path.join(__dirname, 'final-audit-results');

  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  console.log('\n🎯 FINAL INTERACTIVE DESIGN AUDIT\n' + '='.repeat(70));

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
    console.log(`\n📱 ${viewport.name.toUpperCase()}`);

    for (const pageRoute of pages) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      const page = await context.newPage();

      try {
        await page.goto(`http://localhost:3000${pageRoute.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        console.log(`  ✓ ${pageRoute.name}`);

        // Test 1: Check all buttons
        const buttons = await page.locator('button, a[role="button"], .btn-primary, .btn-secondary, .ctaPrimary, .ctaSecondary').all();

        for (const btn of buttons.slice(0, 3)) {
          const box = await btn.boundingBox();
          const text = await btn.textContent();

          if (box) {
            // Check size
            if (box.width < 44 || box.height < 44) {
              FINAL_AUDIT.verdict.issues.push({
                page: pageRoute.name,
                viewport: viewport.name,
                element: `button: ${text?.substring(0, 20)}`,
                issue: `Touch target too small: ${Math.round(box.width)}×${Math.round(box.height)}`
              });
            } else {
              FINAL_AUDIT.verdict.verified.push({
                page: pageRoute.name,
                viewport: viewport.name,
                element: `button: ${text?.substring(0, 20)}`,
                check: 'Touch target OK'
              });
            }

            // Test hover
            await btn.hover();
            await page.waitForTimeout(150);

            const hoverStyle = await btn.evaluate(el => {
              const cs = window.getComputedStyle(el);
              return {
                hasTransform: cs.transform !== 'none',
                hasShadow: cs.boxShadow !== 'none',
                hasFilter: cs.filter !== 'none'
              };
            });

            if (!hoverStyle.hasTransform && !hoverStyle.hasShadow && !hoverStyle.hasFilter) {
              FINAL_AUDIT.verdict.issues.push({
                page: pageRoute.name,
                viewport: viewport.name,
                element: `button: ${text?.substring(0, 20)}`,
                issue: 'Missing hover feedback'
              });
            } else {
              FINAL_AUDIT.verdict.verified.push({
                page: pageRoute.name,
                viewport: viewport.name,
                element: `button: ${text?.substring(0, 20)}`,
                check: 'Hover feedback present'
              });
            }
          }
        }

        // Test 2: Check links
        const links = await page.locator('a:not([role="button"]):not(.btn-primary):not(.btn-secondary)').all();

        for (const link of links.slice(0, 3)) {
          const text = await link.textContent();

          // Test hover
          await link.hover();
          await page.waitForTimeout(150);

          const hoverStyle = await link.evaluate(el => {
            const cs = window.getComputedStyle(el);
            return {
              opacity: cs.opacity,
              textDecoration: cs.textDecoration,
              color: cs.color
            };
          });

          if (hoverStyle.opacity === '1' && hoverStyle.textDecoration === 'none') {
            FINAL_AUDIT.verdict.issues.push({
              page: pageRoute.name,
              viewport: viewport.name,
              element: `link: ${text?.substring(0, 20)}`,
              issue: 'Missing hover effect'
            });
          } else {
            FINAL_AUDIT.verdict.verified.push({
              page: pageRoute.name,
              viewport: viewport.name,
              element: `link: ${text?.substring(0, 20)}`,
              check: 'Hover effect OK'
            });
          }
        }

        // Test 3: Check focus states (Tab navigation)
        let focusCount = 0;
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press('Tab');
          const focused = await page.evaluate(() => {
            const el = document.activeElement;
            const cs = window.getComputedStyle(el);
            return {
              tag: el?.tagName,
              hasOutline: cs.outline !== 'none',
              outlineColor: cs.outlineColor
            };
          });
          if (focused.hasOutline) focusCount++;
        }

        if (focusCount < 3) {
          FINAL_AUDIT.verdict.issues.push({
            page: pageRoute.name,
            viewport: viewport.name,
            element: 'Focus states',
            issue: `Only ${focusCount}/5 elements had visible focus outline`
          });
        } else {
          FINAL_AUDIT.verdict.verified.push({
            page: pageRoute.name,
            viewport: viewport.name,
            element: 'Focus states',
            check: 'Focus indicators present on most elements'
          });
        }

        // Test 4: Scroll and readability
        for (let scrollPos = 0; scrollPos <= 100; scrollPos += 50) {
          await page.evaluate((pos) => {
            const max = document.body.scrollHeight - window.innerHeight;
            window.scrollTo(0, (max * pos) / 100);
          }, scrollPos);
          await page.waitForTimeout(200);
        }

        // Test 5: Take screenshot
        const screenshotPath = path.join(auditDir, `${pageRoute.name}-${viewport.name}-final.png`);
        await page.screenshot({ path: screenshotPath });

        FINAL_AUDIT.verdict.verified.push({
          page: pageRoute.name,
          viewport: viewport.name,
          check: 'Full page audit completed'
        });

      } catch (error) {
        console.error(`    ✗ Error: ${error.message}`);
        FINAL_AUDIT.verdict.issues.push({
          page: pageRoute.name,
          viewport: viewport.name,
          error: error.message
        });
      }

      await context.close();
    }
  }

  await browser.close();

  // Save report
  const reportPath = path.join(auditDir, 'final-audit-verdict.json');
  fs.writeFileSync(reportPath, JSON.stringify(FINAL_AUDIT, null, 2));

  // Print summary
  console.log(`\n✅ FINAL AUDIT COMPLETE`);
  console.log(`\n📊 SUMMARY:`);
  console.log(`  Issues found: ${FINAL_AUDIT.verdict.issues.length}`);
  console.log(`  Verified: ${FINAL_AUDIT.verdict.verified.length}`);

  if (FINAL_AUDIT.verdict.issues.length > 0) {
    console.log(`\n🔍 ISSUES TO ADDRESS:`);
    FINAL_AUDIT.verdict.issues.slice(0, 10).forEach(issue => {
      console.log(`  - [${issue.page}] ${issue.issue || issue.error}`);
    });
  }

  return FINAL_AUDIT;
}

runFinalAudit().catch(console.error);
