const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ colorScheme: 'light', viewport: { width: 1440, height: 900 } });
  
  // 1. Legal Terms Page
  const p1 = await ctx.newPage();
  await p1.goto('http://localhost:3000/terms', { waitUntil: 'networkidle' });
  await p1.screenshot({ path: 'C:/Users/sarva/.gemini/antigravity/brain/83087ee6-1816-4882-878e-d2bcb243a4b0/terms_nodates.png', fullPage: false });

  // 2. Contact Page
  const p2 = await ctx.newPage();
  await p2.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  await p2.screenshot({ path: 'C:/Users/sarva/.gemini/antigravity/brain/83087ee6-1816-4882-878e-d2bcb243a4b0/contact_updated.png', fullPage: false });

  // 3. Article Detail Page
  const p3 = await ctx.newPage();
  await p3.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const hrefs = await p3.$$eval('a', anchors => anchors.map(a => a.getAttribute('href')));
  const articleHref = hrefs.find(h => h && h.match(/\/[a-z0-9-]+\/[a-z0-9-]+$/) && !h.includes('/about') && !h.includes('/contact'));
  if (articleHref) {
    console.log('Navigating to article:', articleHref);
    await p3.goto('http://localhost:3000' + articleHref, { waitUntil: 'networkidle' });
    await p3.screenshot({ path: 'C:/Users/sarva/.gemini/antigravity/brain/83087ee6-1816-4882-878e-d2bcb243a4b0/article_hero_fullwidth.png', fullPage: false });
  }

  await b.close();
  console.log('Verification screenshots saved successfully!');
})();
