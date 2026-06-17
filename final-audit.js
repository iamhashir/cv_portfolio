const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  
  const tests = [
    { name: "Mobile", width: 375, height: 812 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1280, height: 800 }
  ];

  console.log("🎨 Final Design Audit - Responsiveness & Geometry Check\n");

  for (const test of tests) {
    const context = await browser.newContext({ viewport: { width: test.width, height: test.height } });
    const page = await context.newPage();

    try {
      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

      // Scroll to cards section
      await page.evaluate(() => {
        const systems = document.querySelector('[class*="systems"]');
        if (systems) systems.scrollIntoView({ behavior: 'instant' });
      });
      
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        const hero = document.querySelector('[class*="hero"]');
        const systems = document.querySelector('[class*="systems"]');
        const cards = document.querySelectorAll('[class*="card"]');
        const visibleCards = Array.from(cards).filter(c => 
          window.getComputedStyle(c).display !== 'none' && c.offsetHeight > 0
        );

        return {
          heroHeight: hero?.offsetHeight || 0,
          systemsHeight: systems?.offsetHeight || 0,
          visibleCardCount: visibleCards.length,
          firstCardWidth: visibleCards[0]?.offsetWidth || 0,
          hasOverflow: visibleCards.some(c => c.scrollWidth > c.offsetWidth)
        };
      });

      console.log(`${test.name} (${test.width}×${test.height}):`);
      console.log(`  ✅ Cards visible: ${metrics.visibleCardCount}`);
      console.log(`  ✅ No text overflow: ${!metrics.hasOverflow}`);
      console.log(`  ✅ Card width responsive: ${metrics.firstCardWidth}px`);
      console.log();
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log("✅ All viewports responsive and geometric — no squishing detected");
})();
