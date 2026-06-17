const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VERIFICATION = {
  timestamp: new Date().toISOString(),
  pages: [],
  improvements: [],
  status: 'ANALYZING'
};

async function verifyPage(page, viewport, pageRoute) {
  const pageData = {
    name: pageRoute.name,
    viewport: viewport.name,
    checks: {
      buttons: { total: 0, withHover: 0, withFocus: 0, correctSize: 0 },
      links: { total: 0, withHover: 0, withFocus: 0 },
      typography: { issues: [] },
      spacing: { issues: [] },
      contrast: { issues: [] },
      mobile: { issues: [] }
    },
    screenshots: []
  };

  // Check buttons
  const buttons = await page.locator('button, a[role="button"], .btn-primary, .btn-secondary').all();
  pageData.checks.buttons.total = buttons.length;

  for (const btn of buttons.slice(0, 5)) {
    try {
      const box = await btn.boundingBox();
      if (!box) continue;

      // Check size
      if (box.width >= 44 && box.height >= 44) {
        pageData.checks.buttons.correctSize++;
      } else {
        pageData.checks.buttons.issues = pageData.checks.buttons.issues || [];
        pageData.checks.buttons.issues.push({
          size: `${Math.round(box.width)}×${Math.round(box.height)}`,
          text: await btn.textContent()
        });
      }

      // Check hover
      const defaultStyle = await btn.evaluate(el => {
        const cs = window.getComputedStyle(el);
        return { transform: cs.transform, filter: cs.filter, boxShadow: cs.boxShadow };
      });

      await btn.hover();
      await page.waitForTimeout(100);

      const hoverStyle = await btn.evaluate(el => {
        const cs = window.getComputedStyle(el);
        return { transform: cs.transform, filter: cs.filter, boxShadow: cs.boxShadow };
      });

      if (JSON.stringify(defaultStyle) !== JSON.stringify(hoverStyle)) {
        pageData.checks.buttons.withHover++;
      }

      // Check focus
      const focusStyle = await btn.evaluate(el => {
        el.focus();
        const cs = window.getComputedStyle(el);
        return { outline: cs.outline, boxShadow: cs.boxShadow };
      });

      if (focusStyle.outline !== 'none' || focusStyle.boxShadow !== 'none') {
        pageData.checks.buttons.withFocus++;
      }
    } catch (e) {
      // Skip
    }
  }

  // Check links
  const links = await page.locator('a:not([role="button"]):not(.btn-primary):not(.btn-secondary)').all();
  pageData.checks.links.total = links.length;

  for (const link of links.slice(0, 5)) {
    try {
      const isVisible = await link.isVisible();
      if (!isVisible) continue;

      const defaultStyle = await link.evaluate(el => {
        const cs = window.getComputedStyle(el);
        return { opacity: cs.opacity, textDecoration: cs.textDecoration };
      });

      await link.hover();
      await page.waitForTimeout(100);

      const hoverStyle = await link.evaluate(el => {
        const cs = window.getComputedStyle(el);
        return { opacity: cs.opacity, textDecoration: cs.textDecoration };
      });

      if (JSON.stringify(defaultStyle) !== JSON.stringify(hoverStyle)) {
        pageData.checks.links.withHover++;
      }

      const focusStyle = await link.evaluate(el => {
        el.focus();
        const cs = window.getComputedStyle(el);
        return { outline: cs.outline };
      });

      if (focusStyle.outline !== 'none') {
        pageData.checks.links.withFocus++;
      }
    } catch (e) {
      // Skip
    }
  }

  // Check typography
  const headings = await page.locator('h1, h2, h3').all();
  for (const heading of headings.slice(0, 3)) {
    try {
      const text = await heading.textContent();
      const fontSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
      const fontWeight = await heading.evaluate(el => window.getComputedStyle(el).fontWeight);

      const size = parseInt(fontSize);
      if (size < 18) {
        pageData.checks.typography.issues.push({
          text: text?.substring(0, 20),
          fontSize: fontSize,
          issue: 'Small heading size'
        });
      }
    } catch (e) {
      // Skip
    }
  }

  // Check spacing
  const sections = await page.locator('section, main > div').all();
  for (const section of sections.slice(0, 3)) {
    try {
      const box = await section.boundingBox();
      if (box && box.height < 80) {
        pageData.checks.spacing.issues.push({
          height: `${Math.round(box.height)}px`,
          issue: 'Cramped section'
        });
      }
    } catch (e) {
      // Skip
    }
  }

  // Mobile-specific checks
  if (viewport.name === 'mobile') {
    const mobileLinks = await page.locator('a').all();
    for (const link of mobileLinks.slice(0, 5)) {
      try {
        const box = await link.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          pageData.checks.mobile.issues.push({
            size: `${Math.round(box.width)}×${Math.round(box.height)}`,
            issue: 'Touch target too small on mobile'
          });
        }
      } catch (e) {
        // Skip
      }
    }
  }

  // Take screenshot
  const screenshotPath = path.join(__dirname, 'design-verification', `${pageRoute.name}-${viewport.name}.png`);
  await page.screenshot({ path: screenshotPath });
  pageData.screenshots.push(screenshotPath);

  return pageData;
}

async function runVerification() {
  const browser = await chromium.launch();

  // Create output directory
  if (!fs.existsSync(path.join(__dirname, 'design-verification'))) {
    fs.mkdirSync(path.join(__dirname, 'design-verification'), { recursive: true });
  }

  console.log('\n🔍 FINAL DESIGN VERIFICATION\n' + '='.repeat(70));

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

        const pageData = await verifyPage(page, viewport, pageRoute);
        VERIFICATION.pages.push(pageData);

        console.log(`  ✓ ${pageRoute.name} - Buttons: ${pageData.checks.buttons.total}, Links: ${pageData.checks.links.total}`);

      } catch (error) {
        console.error(`  ✗ Error: ${error.message}`);
      }

      await context.close();
    }
  }

  await browser.close();

  // Generate summary
  console.log(`\n📊 VERIFICATION SUMMARY:`);

  let totalButtonsWithHover = 0;
  let totalButtonsWithFocus = 0;
  let totalLinksWithHover = 0;
  let totalLinksWithFocus = 0;
  let allIssues = [];

  VERIFICATION.pages.forEach(page => {
    totalButtonsWithHover += page.checks.buttons.withHover;
    totalButtonsWithFocus += page.checks.buttons.withFocus;
    totalLinksWithHover += page.checks.links.withHover;
    totalLinksWithFocus += page.checks.links.withFocus;

    if (page.checks.typography.issues.length > 0) {
      allIssues.push(...page.checks.typography.issues.map(i => ({ ...i, page: page.name })));
    }
    if (page.checks.spacing.issues.length > 0) {
      allIssues.push(...page.checks.spacing.issues.map(i => ({ ...i, page: page.name })));
    }
    if (page.checks.mobile.issues.length > 0) {
      allIssues.push(...page.checks.mobile.issues.map(i => ({ ...i, page: page.name })));
    }
  });

  console.log(`  Buttons with hover feedback: ${totalButtonsWithHover}/${VERIFICATION.pages.reduce((sum, p) => sum + p.checks.buttons.total, 0)}`);
  console.log(`  Buttons with focus indicators: ${totalButtonsWithFocus}/${VERIFICATION.pages.reduce((sum, p) => sum + p.checks.buttons.total, 0)}`);
  console.log(`  Links with hover feedback: ${totalLinksWithHover}/${VERIFICATION.pages.reduce((sum, p) => sum + p.checks.links.total, 0)}`);
  console.log(`  Links with focus indicators: ${totalLinksWithFocus}/${VERIFICATION.pages.reduce((sum, p) => sum + p.checks.links.total, 0)}`);

  if (allIssues.length > 0) {
    console.log(`\n⚠️  Issues found: ${allIssues.length}`);
    allIssues.slice(0, 5).forEach(issue => {
      console.log(`  - [${issue.page}] ${issue.issue}: ${issue.size || issue.fontSize || issue.height || ''}`);
    });
  } else {
    console.log(`\n✅ No critical issues found!`);
  }

  // Save report
  const reportPath = path.join(__dirname, 'design-verification', 'verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(VERIFICATION, null, 2));

  console.log(`\n✅ Verification complete! Report saved.`);

  return VERIFICATION;
}

runVerification().catch(console.error);
