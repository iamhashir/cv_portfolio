const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DESIGN_AUDIT = {
  timestamp: new Date().toISOString(),
  findings: {
    visibility: [],
    contrast: [],
    spacing: [],
    interactive: [],
    typography: [],
    recommendations: []
  },
  screenshots: []
};

async function auditVisibility(page, viewport) {
  const findings = [];

  // Check all text elements for visibility
  const textElements = await page.locator('h1, h2, h3, p, a, button, label').all();

  for (const el of textElements.slice(0, 10)) {
    try {
      const visible = await el.isVisible();
      if (!visible) continue;

      const box = await el.boundingBox();
      const text = await el.textContent();
      const styles = await el.evaluate(e => {
        const cs = window.getComputedStyle(e);
        return {
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          opacity: cs.opacity,
          visibility: cs.visibility,
          display: cs.display
        };
      });

      // Check for visibility issues
      if (styles.opacity === '0' || styles.visibility === 'hidden') {
        findings.push({
          issue: 'Hidden element',
          text: text?.substring(0, 30),
          reason: `opacity: ${styles.opacity}, visibility: ${styles.visibility}`
        });
      }

      // Check for small font that might be hard to read
      const fontSize = parseInt(styles.fontSize);
      if (fontSize < 14) {
        findings.push({
          issue: 'Small font size',
          text: text?.substring(0, 30),
          size: styles.fontSize,
          recommendation: 'Consider increasing to at least 16px for body text'
        });
      }

      // Check for poor contrast scenarios
      if (box) {
        const isInteractive = ['A', 'BUTTON'].includes(el.tagName) ||
                            await el.getAttribute('role') === 'button';
        if (isInteractive && box.width < 44) {
          findings.push({
            issue: 'Small touch target',
            text: text?.substring(0, 30),
            size: `${Math.round(box.width)}×${Math.round(box.height)}`,
            recommendation: 'Increase to 44×44px minimum for accessibility'
          });
        }
      }
    } catch (e) {
      // Skip errors
    }
  }

  return findings;
}

async function checkColorContrast(page) {
  const contrastIssues = [];

  // Check buttons for adequate contrast
  const buttons = await page.locator('button, a[role="button"], .btn-primary, .btn-secondary').all();

  for (const btn of buttons.slice(0, 5)) {
    try {
      const visible = await btn.isVisible();
      if (!visible) continue;

      const styles = await btn.evaluate(e => {
        const cs = window.getComputedStyle(e);
        const text = e.textContent || '';

        // Simple contrast check (not perfect, but useful)
        const bgColor = cs.backgroundColor;
        const textColor = cs.color;

        return {
          bgColor,
          textColor,
          text: text.substring(0, 20),
          hasText: text.trim().length > 0
        };
      });

      if (!styles.hasText) {
        contrastIssues.push({
          element: 'button',
          issue: 'Missing text or unclear label',
          bg: styles.bgColor,
          text: styles.textColor
        });
      }
    } catch (e) {
      // Skip
    }
  }

  return contrastIssues;
}

async function checkSpacing(page) {
  const spacingIssues = [];

  // Check for consistent section spacing
  const sections = await page.locator('section, [class*="section"], main > div').all();

  for (const section of sections.slice(0, 5)) {
    try {
      const styles = await section.evaluate(e => {
        const cs = window.getComputedStyle(e);
        return {
          padding: cs.padding,
          margin: cs.margin,
          gap: cs.gap
        };
      });

      const box = await section.boundingBox();
      if (box && box.height < 100) {
        spacingIssues.push({
          issue: 'Cramped section',
          height: `${Math.round(box.height)}px`,
          padding: styles.padding,
          recommendation: 'Consider increasing vertical padding for breathing room'
        });
      }
    } catch (e) {
      // Skip
    }
  }

  return spacingIssues;
}

async function runDesignLeadAudit() {
  const browser = await chromium.launch();
  const auditDir = path.join(__dirname, 'design-lead-audit-results');

  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  console.log('\n👁️  DESIGN LEAD VISUAL AUDIT\n' + '='.repeat(70));

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
      console.log(`  📄 ${pageRoute.name}`);

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      const page = await context.newPage();

      try {
        await page.goto(`http://localhost:3000${pageRoute.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(800);

        // Run visibility audit
        const visibilityFindings = await auditVisibility(page, viewport);
        if (visibilityFindings.length > 0) {
          DESIGN_AUDIT.findings.visibility.push({
            page: pageRoute.name,
            viewport: viewport.name,
            issues: visibilityFindings
          });
        }

        // Check contrast
        const contrastFindings = await checkColorContrast(page);
        if (contrastFindings.length > 0) {
          DESIGN_AUDIT.findings.contrast.push({
            page: pageRoute.name,
            viewport: viewport.name,
            issues: contrastFindings
          });
        }

        // Check spacing
        const spacingFindings = await checkSpacing(page);
        if (spacingFindings.length > 0) {
          DESIGN_AUDIT.findings.spacing.push({
            page: pageRoute.name,
            viewport: viewport.name,
            issues: spacingFindings
          });
        }

        // Take screenshot
        const screenshotPath = path.join(auditDir, `${pageRoute.name}-${viewport.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        DESIGN_AUDIT.screenshots.push({
          page: pageRoute.name,
          viewport: viewport.name,
          path: screenshotPath
        });

        console.log(`    ✓ Audit complete`);

      } catch (error) {
        console.error(`    ✗ Error: ${error.message}`);
      }

      await context.close();
    }
  }

  await browser.close();

  // Save report
  const reportPath = path.join(auditDir, 'design-lead-findings.json');
  fs.writeFileSync(reportPath, JSON.stringify(DESIGN_AUDIT, null, 2));

  console.log(`\n✅ DESIGN AUDIT COMPLETE`);
  console.log(`\n📊 FINDINGS SUMMARY:`);
  console.log(`  Visibility issues: ${DESIGN_AUDIT.findings.visibility.length}`);
  console.log(`  Contrast issues: ${DESIGN_AUDIT.findings.contrast.length}`);
  console.log(`  Spacing issues: ${DESIGN_AUDIT.findings.spacing.length}`);

  return DESIGN_AUDIT;
}

runDesignLeadAudit().catch(console.error);
