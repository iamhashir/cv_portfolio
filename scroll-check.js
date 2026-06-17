const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    
    // Scroll down to the systems section
    await page.evaluate(() => {
      const systems = document.querySelector('[class*="systems"]');
      if (systems) systems.scrollIntoView({ behavior: 'instant' });
    });
    
    await page.waitForTimeout(800); // Wait for animations
    
    const screenshotPath = path.join(__dirname, "scroll-to-cards.png");
    await page.screenshot({ path: screenshotPath });
    console.log(`✅ Screenshot after scrolling to cards: ${screenshotPath}`);

    // Check if cards are now visible
    const cardVisibility = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="card"]');
      const visible = Array.from(cards).filter(c => {
        const rect = c.getBoundingClientRect();
        return rect.height > 0 && window.getComputedStyle(c).display !== 'none';
      });
      return {
        totalCards: cards.length,
        visibleCards: visible.length,
        firstCardOpacity: visible[0] ? window.getComputedStyle(visible[0]).opacity : 'N/A'
      };
    });
    
    console.log("Card Visibility:", cardVisibility);
  } finally {
    await browser.close();
  }
})();
