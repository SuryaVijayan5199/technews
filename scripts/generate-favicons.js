const fs = require('fs');
const path = require('path');
const sharp = require('../node_modules/sharp');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="techcrest-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00D2FF" />
      <stop offset="100%" stop-color="#2D7FF9" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="#071529" />
  <g fill="url(#techcrest-gradient)">
    <!-- Row 1: Top speedlines -->
    <rect x="295" y="306" width="120" height="36" rx="19" />
    <rect x="450" y="306" width="370" height="36" rx="19" />

    <!-- Row 2: Second speedline and the main T-bar -->
    <rect x="232" y="382" width="100" height="36" rx="19" />
    <rect x="368" y="382" width="410" height="38" rx="19" />
    
    <!-- Row 3: Third speedline row -->
    <rect x="186" y="458" width="96" height="36" rx="19" />
    <rect x="310" y="458" width="136" height="36" rx="19" />

    <!-- T-Stem: Overlaps seamlessly into the T-bar above, retaining the original slant and flat bottom -->
    <path d="
      M 520 390 
      L 660 390 
      L 535 680 
      A 18 18 0 0 1 517 698 
      L 413 698 
      A 19 19 0 0 1 395 680 
      Z" 
    />
  </g>
</svg>`;

async function generate() {
  const svgBuf = Buffer.from(svgContent);

  // 1. Update SVG
  fs.writeFileSync(path.join(__dirname, '../public/icons/techcrest-icon.svg'), svgContent, 'utf8');
  console.log('Updated public/icons/techcrest-icon.svg');

  // 2. 512x512 app icon
  const buf512 = await sharp(svgBuf).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../public/icons/techcrest-app-icon-gradient-512.png'), buf512);
  fs.writeFileSync(path.join(__dirname, '../public/icons/favicon-dark-512.png'), buf512);
  fs.writeFileSync(path.join(__dirname, '../public/logos/icons/favicon-dark-512.png'), buf512);

  // 3. 192x192 Next.js app/icon.png
  const buf192 = await sharp(svgBuf).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../app/icon.png'), buf192);

  // 4. 180x180 Apple touch icon
  const buf180 = await sharp(svgBuf).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../app/apple-icon.png'), buf180);
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), buf180);

  // 5. 64x64 favicon.png
  const buf64 = await sharp(svgBuf).resize(64, 64).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), buf64);

  // 6. 32x32 & 16x16
  const buf32 = await sharp(svgBuf).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../public/favicon-32x32.png'), buf32);
  fs.writeFileSync(path.join(__dirname, '../public/icons/favicon-dark-32.png'), buf32);
  fs.writeFileSync(path.join(__dirname, '../public/logos/icons/favicon-32x32.png'), buf32);

  const buf16 = await sharp(svgBuf).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../public/favicon-16x16.png'), buf16);
  fs.writeFileSync(path.join(__dirname, '../public/logos/icons/favicon-16x16.png'), buf16);

  // 7. ICO file (32x32 PNG header as ICO)
  fs.writeFileSync(path.join(__dirname, '../app/favicon.ico'), buf32);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), buf32);
  fs.writeFileSync(path.join(__dirname, '../public/logos/icons/favicon.ico'), buf32);

  console.log('All favicons generated with TechCrest gradient branding!');
}

generate().catch(console.error);
