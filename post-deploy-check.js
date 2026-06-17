const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // Scroll to cards to verify they render
    await page.evaluate(() => {
      const systems = document.querySelector('[class*="systems"]');
      if (systems) systems.scrollIntoView({ behavior: 'instant' });
    });

    const health = await page.evaluate(() => {
      const errors = document.querySelectorAll('[class*="error"]');
      const console_logs = [];
      const bg = document.querySelector('[class*="backgroundStage"]');
      const grid = document.querySelector('[class*="grid"]');
      const cards = document.querySelectorAll('[class*="card"]');
      
      return {
        hasErrors: errors.length > 0,
        errorCount: errors.length,
        darkTheme: bg ? window.getComputedStyle(bg).backgroundColor === 'rgb(15, 12, 8)' : false,
        gridActive: !!grid,
        cardCount: cards.length,
        visibleCards: Array.from(cards).filter(c => c.offsetHeight > 0).length,
        pageTitle: document.title
      };
    });

    console.log("📋 POST-DEPLOY HEALTH CHECK:");
    console.log(`  Page: ${health.pageTitle}`);
    console.log(`  Dark theme: ${health.darkTheme ? '✓' : '✗'}`);
    console.log(`  Grid rendering: ${health.gridActive ? '✓' : '✗'}`);
    console.log(`  Cards: ${health.visibleCards}/${health.cardCount} visible`);
    console.log(`  Errors: ${health.hasErrors ? `⚠️ ${health.errorCount}` : '✓ None'}`);
    
    if (health.darkTheme && health.gridActive && health.visibleCards > 0 && !health.hasErrors) {
      console.log("\n✅ POST-DEPLOY VERIFICATION PASSED");
    } else {
      console.log("\n⚠️ ISSUES DETECTED - see above");
    }
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  } finally {
    await browser.close();
  }
})();
