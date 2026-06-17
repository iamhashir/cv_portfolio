const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    // Clear browser cache to force full reload
    await page.goto("http://localhost:3000?t=" + Date.now(), { waitUntil: "networkidle" });
    
    // Wait a bit for rendering
    await page.waitForTimeout(1000);
    
    const screenshotPath = path.join(__dirname, "fresh-desktop-screenshot.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Fresh screenshot saved: ${screenshotPath}`);

    // Also get color info
    const colors = await page.evaluate(() => {
      const bg = document.querySelector('[class*="backgroundStage"]');
      const systems = document.querySelector('[class*="systems"]');
      return {
        backgroundStage: bg ? window.getComputedStyle(bg).backgroundColor : 'N/A',
        systemsSection: systems ? window.getComputedStyle(systems).backgroundColor : 'N/A',
      };
    });
    console.log("Colors:", colors);
  } finally {
    await browser.close();
  }
})();
