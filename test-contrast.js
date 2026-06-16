const { chromium } = require('playwright');

async function testContrast() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });

  const results = await page.evaluate(() => {
    const rgbToLum = (str) => {
      const match = str.match(/\d+/g);
      if (!match) return 0;
      const [r, g, b] = match.slice(0, 3).map(Number);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    const getContrast = (fgColor, bgColor) => {
      const fgLum = rgbToLum(fgColor);
      const bgLum = rgbToLum(bgColor);
      const lighter = Math.max(fgLum, bgLum);
      const darker = Math.min(fgLum, bgLum);
      return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
    };

    // Find the h2 "Engineering Systems"
    const sections = document.querySelectorAll('h2');
    const section2 = Array.from(sections).find(h => h.textContent.includes('Engineering'));

    if (!section2) return { error: 'Could not find Engineering Systems heading' };

    const h2Style = window.getComputedStyle(section2);

    // Walk up to find the actual background
    let element = section2;
    let bgColor = 'rgb(244, 240, 234)'; // default cream
    for (let i = 0; i < 10; i++) {
      const bg = window.getComputedStyle(element).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        bgColor = bg;
        break;
      }
      element = element.parentElement;
      if (!element) break;
    }

    const h1 = document.querySelector('h1');
    const h1Style = h1 ? window.getComputedStyle(h1) : null;

    return {
      h1Text: h1?.textContent?.substring(0, 40),
      h1Color: h1Style?.color,
      h1Contrast: h1Style?.color ? getContrast(h1Style.color, bgColor) : 'N/A',
      h2Text: section2.textContent,
      h2Color: h2Style.color,
      h2Contrast: getContrast(h2Style.color, bgColor),
      bgColor,
      note: 'Checking actual contrast against light background'
    };
  });

  console.log('Contrast Test Results:', JSON.stringify(results, null, 2));
  await browser.close();
}

testContrast().catch(console.error);
