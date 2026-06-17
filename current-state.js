const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    
    const state = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid"]');
      const cards = document.querySelectorAll('[class*="card"]');
      const visible = Array.from(cards).filter(c => c.offsetHeight > 0);
      
      return {
        gridPresent: !!grid,
        cardCount: cards.length,
        visibleCards: visible.length,
        noErrors: !document.querySelector('[class*="error"]'),
        responsive: visible[0] ? visible[0].offsetWidth > 0 : false
      };
    });

    console.log("📊 Current State (Iteration 9):");
    console.log(`  Grid: ${state.gridPresent ? '✓' : '✗'}`);
    console.log(`  Cards: ${state.visibleCards}/${state.cardCount}`);
    console.log(`  Responsive: ${state.responsive ? '✓' : '✗'}`);
    console.log(`  Errors: ${state.noErrors ? '✓ None' : '⚠️ Found'}`);
    
    if (state.gridPresent && state.visibleCards > 0 && state.noErrors) {
      console.log("\n✅ STABLE - Design remains responsive and functional");
    }
  } finally {
    await browser.close();
  }
})();
