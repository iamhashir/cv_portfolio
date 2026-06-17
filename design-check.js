const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    
    // Scroll to cards
    await page.evaluate(() => {
      const systems = document.querySelector('[class*="systems"]');
      if (systems) systems.scrollIntoView({ behavior: 'instant' });
    });
    
    await page.waitForTimeout(800);

    const screenshotPath = path.join(__dirname, "new-design-screenshot.png");
    await page.screenshot({ path: screenshotPath });
    console.log(`✅ Screenshot saved: new-design-screenshot.png`);

    const colors = await page.evaluate(() => {
      const bg = document.querySelector('[class*="backgroundStage"]');
      const cards = document.querySelectorAll('[class*="card"]');
      return {
        bgColor: bg ? window.getComputedStyle(bg).backgroundColor : 'N/A',
        gridActive: cards.length > 0,
        cardCount: cards.length
      };
    });

    console.log("Colors detected:", colors);
  } finally {
    await browser.close();
  }
})();
