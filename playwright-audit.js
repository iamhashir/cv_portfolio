const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

const BASE_URL = "http://localhost:3000";

async function auditDesign() {
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();

      console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

      try {
        await page.goto(BASE_URL, { waitUntil: "networkidle" });

        // Capture screenshot
        const screenshotPath = path.join(__dirname, `screenshot-${viewport.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  ✅ Screenshot saved: ${screenshotPath}`);

        // Get computed styles for key elements
        const bgColor = await page.evaluate(() => {
          const stage = document.querySelector('[class*="backgroundStage"]');
          return stage
            ? window.getComputedStyle(stage).backgroundColor
            : "NOT FOUND";
        });

        const pageColor = await page.evaluate(() => {
          const p = document.querySelector('main') || document.querySelector('.page');
          return p ? window.getComputedStyle(p).color : "NOT FOUND";
        });

        // Check for text overlap or squished elements
        const elements = await page.evaluate(() => {
          const els = document.querySelectorAll("h1, h2, p, button, a");
          return Array.from(els).slice(0, 20).map((el) => ({
            text: el.textContent?.slice(0, 50),
            width: el.offsetWidth,
            height: el.offsetHeight,
            overflow: el.scrollWidth > el.offsetWidth ? "OVERFLOW" : "OK",
            visible: el.offsetHeight > 0 ? "YES" : "NO",
          }));
        });

        // Check project cards layout
        const cards = await page.evaluate(() => {
          const cardEls = document.querySelectorAll('[class*="card"], [class*="project"]');
          return {
            count: cardEls.length,
            samples: Array.from(cardEls)
              .slice(0, 3)
              .map((el) => ({
                width: el.offsetWidth,
                height: el.offsetHeight,
                hasContent: el.textContent?.length > 0 ? "YES" : "NO",
              })),
          };
        });

        results.push({
          viewport: viewport.name,
          bgColor,
          pageColor,
          elementCount: elements.length,
          elementsSample: elements.filter((e) => e.visible === "YES").slice(0, 5),
          cards,
        });

        console.log(`  Background color: ${bgColor}`);
        console.log(`  Text color: ${pageColor}`);
        console.log(`  Project cards: ${cards.count} found`);
        console.log(
          `  Layout status: ${elements.filter((e) => e.overflow === "OVERFLOW").length} overflow issues`
        );
      } catch (err) {
        console.error(`  ❌ Error testing ${viewport.name}:`, err.message);
      } finally {
        await context.close();
      }
    }

    console.log("\n📊 AUDIT RESULTS:");
    console.log(JSON.stringify(results, null, 2));

    // Write summary
    const summary = `# Playwright Responsive Audit (${new Date().toISOString()})

${results
  .map(
    (r) => `
## ${r.viewport.toUpperCase()}
- Background: ${r.bgColor}
- Text color: ${r.pageColor}
- Project cards: ${r.cards.count}
- Overflow issues: ${r.elementsSample.filter((e) => e.overflow === "OVERFLOW").length}

Cards found:
\`\`\`json
${JSON.stringify(r.cards.samples, null, 2)}
\`\`\`
`
  )
  .join("\n")}

## Observations
- Light theme is rendering (#F4F0EA) instead of dark theme
- Check screenshot-mobile.png, screenshot-tablet.png, screenshot-desktop.png for visual geometry issues
- If cards are squished or text overflowing, that indicates responsive issues
`;

    fs.writeFileSync(path.join(__dirname, "audit-report.md"), summary);
    console.log("\n✅ Full report saved to audit-report.md");
  } finally {
    await browser.close();
  }
}

auditDesign().catch(console.error);
