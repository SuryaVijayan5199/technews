const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOT_PATH = 'C:/Users/sarva/.gemini/antigravity/brain/83087ee6-1816-4882-878e-d2bcb243a4b0/homepage_full.png';
const OUT = 'C:/Users/sarva/.gemini/antigravity/brain/83087ee6-1816-4882-878e-d2bcb243a4b0/homepage_a4.pdf';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    colorScheme: 'light',
  });
  const page = await ctx.newPage();

  // Convert Windows path to file URL
  const imgFileUrl = 'file:///' + SCREENSHOT_PATH.replace(/\\/g, '/');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page {
    size: A4;
    margin: 0;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body {
    width: 210mm;
    height: 297mm;
    background: #fff;
  }
  .page {
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 8mm;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #2D7FF9;
    padding-bottom: 4mm;
    margin-bottom: 4mm;
  }
  .header h1 {
    font-family: Arial, sans-serif;
    font-size: 14pt;
    color: #050d19;
    font-weight: 700;
  }
  .header .meta {
    font-family: Arial, sans-serif;
    font-size: 8pt;
    color: #666;
  }
  .screenshot-container {
    flex: 1;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: #f8fafc;
  }
  .screenshot-container img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: top center;
  }
  .footer {
    margin-top: 3mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial, sans-serif;
    font-size: 7pt;
    color: #999;
    border-top: 1px solid #e2e8f0;
    padding-top: 2mm;
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <h1>🔷 TechCrest — Homepage (Day Theme)</h1>
    <div class="meta">URL: http://localhost:3000 &nbsp;|&nbsp; ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
  </div>
  <div class="screenshot-container">
    <img src="${imgFileUrl}" alt="TechCrest Homepage Screenshot" />
  </div>
  <div class="footer">
    <span>TechCrest — Technology News Platform</span>
    <span>Full-page screenshot captured in Day Theme at 1440px viewport width</span>
  </div>
</div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('A4 PDF saved to:', OUT);
})();
