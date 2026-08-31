const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcImage = path.join(__dirname, '../public/icon-512.png');
const resDir = path.join(__dirname, '../android/app/src/main/res');

const sizes = [
  { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
];

async function generate() {
  console.log('Generating high-res Android App Icons from', srcImage);

  for (const s of sizes) {
    const targetFolder = path.join(resDir, s.dir);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const iconContent = await sharp(srcImage)
      .resize(Math.round(s.size * 0.8), Math.round(s.size * 0.8))
      .toBuffer();

    await sharp({
      create: {
        width: s.size,
        height: s.size,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 },
      },
    })
      .composite([{ input: iconContent, gravity: 'center' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher.png'));

    await sharp({
      create: {
        width: s.size,
        height: s.size,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 },
      },
    })
      .composite([{ input: iconContent, gravity: 'center' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_round.png'));

    const fgContent = await sharp(srcImage)
      .resize(Math.round(s.fgSize * 0.65), Math.round(s.fgSize * 0.65))
      .toBuffer();

    await sharp({
      create: {
        width: s.fgSize,
        height: s.fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: fgContent, gravity: 'center' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_foreground.png'));

    console.log(`Generated Android App Icons for ${s.dir} (${s.size}x${s.size})`);
  }

  console.log('All Android Adaptive Brand Icons generated successfully!');
}

generate().catch(console.error);

