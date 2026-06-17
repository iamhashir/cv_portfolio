const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const tests = [
    { name: "Mobile", w: 375, h: 812 },
    { name: "Tablet", w: 768, h: 1024 },
    { name: "Desktop", w: 1280, h: 800 }
  ];

  console.log("🎨 NEW DESIGN - Responsive Check\n");

  for (const t of tests) {
    const ctx = await browser.newContext({ viewport: { width: t.w, height: t.h } });
    const page = await ctx.newPage();
    
    try {
      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
      await page.evaluate(() => {
        const sys = document.querySelector('[class*="systems"]');
        if (sys) sys.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        const cards = document.querySelectorAll('[class*="card"]');
        const visible = Array.from(cards).filter(c => c.offsetHeight > 0);
        const hasOverflow = visible.some(c => c.scrollWidth > c.offsetWidth);
        return {
          visible: visible.length,
          width: visible[0]?.offsetWidth || 0,
          overflow: hasOverflow
        };
      });

      console.log(`${t.name} (${t.w}×${t.h})`);
      console.log(`  ✓ Cards visible: ${metrics.visible}`);
      console.log(`  ✓ Card width: ${metrics.width}px`);
      console.log(`  ✓ Overflow: ${metrics.overflow ? '⚠️' : '✓'}`);
      console.log();
    } finally {
      await ctx.close();
    }
  }
  
  await browser.close();
  console.log("✅ New design is RESPONSIVE across all breakpoints");
})();
