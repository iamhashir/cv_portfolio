const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    // Check for grid and cards
    const gridInfo = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid"]');
      const cards = document.querySelectorAll('[class*="card"], [class*="project"]');
      
      return {
        gridExists: !!grid,
        gridDisplay: grid ? window.getComputedStyle(grid).display : 'N/A',
        gridHeight: grid ? grid.offsetHeight : 'N/A',
        cardsCount: cards.length,
        firstCardInfo: cards.length > 0 ? {
          display: window.getComputedStyle(cards[0]).display,
          height: cards[0].offsetHeight,
          width: cards[0].offsetWidth,
          text: cards[0].textContent?.slice(0, 50)
        } : 'N/A'
      };
    });

    console.log("Grid & Card Status:", JSON.stringify(gridInfo, null, 2));
  } finally {
    await browser.close();
  }
})();
