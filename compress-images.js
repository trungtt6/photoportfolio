const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = 'C:\\trungtt\\PhotoPortfolio\\public\\images';
const images = ['mountain.JPG', 'forest.JPG', 'ocean.JPG'];

async function compressImages() {
  for (const img of images) {
    try {
      const inputPath = path.join(imagesDir, img);
      const outputPath = path.join(imagesDir, img.replace('.JPG', '.jpg'));
      
      // Delete output if exists
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      
      const info = await sharp(inputPath)
        .resize(3200, 2400, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size / 1024 / 1024;
      const compressedSize = info.size / 1024 / 1024;
      const reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
      
      console.log(`✓ ${img}`);
      console.log(`  Original: ${originalSize.toFixed(2)} MB`);
      console.log(`  Optimized: ${compressedSize.toFixed(2)} MB`);
      console.log(`  Reduction: ${reduction}%\n`);
    } catch (err) {
      console.error(`✗ Error processing ${img}:`, err.message);
    }
  }
  console.log('✅ Compression done!');
}

compressImages();
