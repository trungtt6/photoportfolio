const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const PHOTOGRAPHER_NAME = 'TrungTT';

async function addWatermark(imagePath) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Could not get image metadata');
  }

  const width = metadata.width;
  const height = metadata.height;

  // Create SVG watermark with TrungTT text
  const watermarkSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .watermark-text {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: ${Math.floor(width / 30)}px;
            font-weight: bold;
            fill: white;
            opacity: 0.18;
            text-anchor: end;
          }
        </style>
      </defs>
      <text 
        x="${width - 20}" 
        y="${height - 20}"
        class="watermark-text"
      >
        © ${new Date().getFullYear()} ${PHOTOGRAPHER_NAME}
      </text>
    </svg>
  `;

  // Get the original image as buffer
  const originalBuffer = await fs.readFile(imagePath);

  // Composite watermark on top
  const watermarkedBuffer = await sharp(originalBuffer)
    .composite([
      {
        input: Buffer.from(watermarkSvg),
        top: 0,
        left: 0,
      },
    ])
    .toBuffer();

  return watermarkedBuffer;
}

async function testPhotoProcessing() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  SMART PHOTO PROCESSING TEST - WATERMARK & RESIZE          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const photoId = 'mountain';
    const inputPath = 'storage/originals/mountain.JPG';
    
    // Create directories
    const processedDir = 'storage/processed';
    const referencesDir = `storage/references/${photoId}`;
    
    await fs.mkdir(processedDir, { recursive: true });
    await fs.mkdir(referencesDir, { recursive: true });

    // Get original file size
    const originalStats = await fs.stat(inputPath);
    const originalSize = originalStats.size;

    console.log(`📸 Input File:`);
    console.log(`   Name: mountain.JPG`);
    console.log(`   Size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n⏳ Processing...\n`);

    // Step 1: Resize for web
    console.log(`1️⃣  RESIZING TO 3200px...`);
    const resizedBuffer = await sharp(inputPath)
      .resize(3200, 2400, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    console.log(`   ✓ Resized: ${(resizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Step 2: Add watermark
    console.log(`\n2️⃣  ADDING WATERMARK ("© 2026 TrungTT")...`);
    const watermarkedBuffer = await addWatermark(inputPath);
    console.log(`   ✓ Watermarked: ${(watermarkedBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Now resize the watermarked version
    const resizedWatermarkedBuffer = await sharp(watermarkedBuffer)
      .resize(3200, 2400, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    const processedPath = `${processedDir}/${photoId}.jpg`;
    await fs.writeFile(processedPath, resizedWatermarkedBuffer);
    const processedSize = resizedWatermarkedBuffer.length;

    console.log(`   ✓ Saved: ${processedPath}`);
    console.log(`   ✓ Final size: ${(processedSize / 1024 / 1024).toFixed(2)} MB`);

    // Step 3: Generate reference sizes
    console.log(`\n3️⃣  GENERATING REFERENCE SIZES...`);
    
    const references = {
      thumb: 800,
      medium: 1600,
      high: 3200,
    };

    for (const [refName, refWidth] of Object.entries(references)) {
      const refPath = `${referencesDir}/${refName}.jpg`;
      const refBuffer = await sharp(resizedWatermarkedBuffer)
        .resize(refWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true })
        .toBuffer();

      await fs.writeFile(refPath, refBuffer);
      console.log(`   ✓ ${refName.padEnd(8)}: ${refWidth}px (${(refBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
    }

    // Summary
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║  ✅ PROCESSING COMPLETE!                                    ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝\n`);

    console.log(`📊 SIZE REDUCTION:`);
    console.log(`   Original:   ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Processed:  ${(processedSize / 1024 / 1024).toFixed(2)} MB`);
    const reduction = (((originalSize - processedSize) / originalSize) * 100).toFixed(1);
    console.log(`   Reduction:  ${reduction}% smaller! 🚀\n`);

    console.log(`📁 OUTPUT FILES:`);
    console.log(`   ✓ Web version:    storage/processed/mountain.jpg (watermarked)`);
    console.log(`   ✓ Thumbnail:      storage/references/mountain/thumb.jpg (800px)`);
    console.log(`   ✓ Medium:         storage/references/mountain/medium.jpg (1600px)`);
    console.log(`   ✓ High:           storage/references/mountain/high.jpg (3200px)\n`);

    console.log(`🎨 WATERMARK APPLIED:`);
    console.log(`   Text: © 2026 TrungTT`);
    console.log(`   Position: Bottom-right corner`);
    console.log(`   Opacity: 18% (visible but not intrusive)\n`);

    console.log(`✨ Ready to use!`);
    console.log(`   Gallery will display: storage/processed/mountain.jpg`);
    console.log(`   Original stored at: storage/originals/mountain.JPG\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testPhotoProcessing();
