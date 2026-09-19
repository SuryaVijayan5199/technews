const { chromium } = require('playwright');

const OUT = 'C:/Users/sarva/.gemini/antigravity/brain/83087ee6-1816-4882-878e-d2bcb243a4b0/about_screenshot.png';
const OUT_HOME = 'C:/Users/sarva/.gemini/antigravity/brain/83087ee6-1816-4882-878e-d2bcb243a4b0/home_floating_btn.png';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // About page screenshot
  const ctx = await browser.newContext({
    colorScheme: 'light',
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  console.log('Navigating to about page...');
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT, fullPage: true });
  console.log('About screenshot saved.');

  // Home page with floating button check - viewport screenshot
  const page2 = await ctx.newPage();
  await page2.goto('http://localhost:3000/about', { waitUntil: 'networkidle', timeout: 60000 });
  await page2.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });
  await page2.waitForTimeout(1500);
  // Screenshot just the bottom-left area to verify the home button
  await page2.screenshot({ path: OUT_HOME, clip: { x: 0, y: 780, width: 350, height: 120 } });
  console.log('Home btn screenshot saved.');

  await browser.close();
  console.log('All done.');
})();
