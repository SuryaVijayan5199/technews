const { chromium } = require('playwright');

const OUT = 'C:/Users/sarva/.gemini/antigravity/brain/83087ee6-1816-4882-878e-d2bcb243a4b0/homepage_full.png';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    colorScheme: 'light',
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 90000 });

  // Force light mode by removing dark class and adding light
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });

  // Wait a moment for the theme to apply
  await page.waitForTimeout(2000);

  console.log('Taking full-page screenshot...');
  await page.screenshot({ path: OUT, fullPage: true });
  await browser.close();
  console.log('Screenshot saved to:', OUT);
})();
