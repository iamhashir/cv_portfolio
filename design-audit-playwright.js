const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/work', name: 'work' }
];

async function auditDesign() {
  const browser = await chromium.launch();
  const screenshotDir = path.join(__dirname, 'design-audit-screenshots');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const issues = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();

    for (const route of PAGES) {
      try {
        console.log(`\n📱 Auditing ${route.name} on ${viewport.name} (${viewport.width}x${viewport.height})...`);
        await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' });

        // Wait for initial renders
        await page.waitForTimeout(1000);

        // Screenshot
        const screenshotPath = path.join(screenshotDir, `${route.name}-${viewport.name}.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`✅ Screenshot: ${screenshotPath}`);

        // Check for visibility issues
        const accessibilityIssues = await page.evaluate(() => {
          const problems = [];

          // Check for text contrast
          document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            const text = el.textContent?.trim();
            if (text && text.length > 3) {
              const color = style.color;
              const bg = style.backgroundColor;
              if (color === 'rgba(0, 0, 0, 0)' || bg === 'rgba(0, 0, 0, 0)') {
                problems.push(`Invisible text in ${el.tagName} with content "${text.substring(0, 30)}"`);
              }
            }
          });

          // Check for clickable elements without focus states
          document.querySelectorAll('button, a, [role="button"]').forEach(el => {
            const style = window.getComputedStyle(el);
            if (!style.outline && !el.style.outline) {
              const text = el.textContent?.trim() || el.getAttribute('aria-label') || '';
              if (text) problems.push(`No visible focus state on: ${text.substring(0, 40)}`);
            }
          });

          return problems;
        });

        if (accessibilityIssues.length > 0) {
          issues.push({
            page: route.name,
            viewport: viewport.name,
            type: 'accessibility',
            details: accessibilityIssues
          });
        }

        // Check interactive elements
        const buttons = await page.locator('button, a[role="button"], [onclick]').count();
        const links = await page.locator('a').count();
        console.log(`   Components: ${buttons} buttons/clickables, ${links} links`);

        // Scroll and check for layout issues
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        const footerPath = path.join(screenshotDir, `${route.name}-${viewport.name}-bottom.png`);
        await page.screenshot({ path: footerPath });

      } catch (error) {
        console.error(`❌ Error auditing ${route.name} on ${viewport.name}:`, error.message);
        issues.push({
          page: route.name,
          viewport: viewport.name,
          type: 'error',
          details: error.message
        });
      }
    }

    await context.close();
  }

  await browser.close();

  // Generate report
  console.log('\n\n📋 AUDIT REPORT\n' + '='.repeat(50));
  if (issues.length === 0) {
    console.log('✅ No major issues detected!');
  } else {
    console.log(`Found ${issues.length} issues:\n`);
    issues.forEach(issue => {
      console.log(`\n🔴 ${issue.page.toUpperCase()} (${issue.viewport})`);
      console.log(`   Type: ${issue.type}`);
      if (Array.isArray(issue.details)) {
        issue.details.forEach(d => console.log(`   - ${d}`));
      } else {
        console.log(`   ${issue.details}`);
      }
    });
  }

  console.log(`\n📸 Screenshots saved to: ${screenshotDir}`);
  return { issues, screenshotDir };
}

auditDesign().catch(console.error);
