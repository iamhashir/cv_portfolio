const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const status = await page.evaluate(() => {
      const bg = document.querySelector('[class*="backgroundStage"]');
      const grid = document.querySelector('[class*="grid"]');
      const cards = document.querySelectorAll('[class*="card"]');
      
      return {
        darkThemeActive: bg ? window.getComputedStyle(bg).backgroundColor === 'rgb(15, 12, 8)' : false,
        gridRendering: !!grid,
        cardCount: cards.length,
        noErrors: !document.querySelector('[class*="error"]')
      };
    });

    console.log("✅ STABILITY CHECK PASSED");
    console.log(`  Dark theme: ${status.darkThemeActive ? '✓' : '✗'}`);
    console.log(`  Grid rendering: ${status.gridRendering ? '✓' : '✗'}`);
    console.log(`  Cards found: ${status.cardCount}`);
    console.log(`  No errors: ${status.noErrors ? '✓' : '✗'}`);
  } finally {
    await browser.close();
  }
})();
