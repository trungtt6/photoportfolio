import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const PHOTOGRAPHER_NAME = 'TrungTT';
const STORAGE_DIR = path.join(process.cwd(), 'storage');

interface ProcessingResult {
  success: boolean;
  photoId: string;
  originalPath?: string;
  processedPath?: string;
  references?: {
    thumb: string;
    medium: string;
    high: string;
  };
  sizes?: {
    original: number;
    processed: number;
    thumb: number;
    medium: number;
    high: number;
  };
  error?: string;
}

/**
 * Add watermark text to image
 */
async function addWatermark(
  imageInput: string | Buffer,
  photographerName: string = PHOTOGRAPHER_NAME
): Promise<Buffer> {
  // Read image as buffer
  let imageBuffer: Buffer;
  if (typeof imageInput === 'string') {
    imageBuffer = await fs.promises.readFile(imageInput);
  } else {
    imageBuffer = imageInput;
  }

  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Could not get image metadata');
  }

  const width = metadata.width;
  const height = metadata.height;

  // Create SVG watermark with script font style - more visible
  const watermarkSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .watermark-text {
            font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
            font-size: ${Math.floor(width / 12)}px;
            font-weight: 400;
            fill: white;
            opacity: 0.7;
            text-anchor: end;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
          }
        </style>
      </defs>
      <text 
        x="${width - 30}" 
        y="${height - 40}"
        class="watermark-text"
      >
        ${photographerName}
      </text>
    </svg>
  `;

  // Composite watermark on top
  const watermarkedBuffer = await sharp(imageBuffer)
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

/**
 * Process uploaded photo: resize, add watermark, generate references
 */
export async function processPhoto(
  inputPath: string,
  photoId: string
): Promise<ProcessingResult> {
  try {
    // Ensure directories exist
    const originalsDir = path.join(STORAGE_DIR, 'originals');
    const processedDir = path.join(STORAGE_DIR, 'processed');
    const referencesDir = path.join(STORAGE_DIR, 'references', photoId);

    await fs.promises.mkdir(originalsDir, { recursive: true });
    await fs.promises.mkdir(processedDir, { recursive: true });
    await fs.promises.mkdir(referencesDir, { recursive: true });

    // Get original file info
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;

    // Store the original file
    const originalFilename = `${photoId}-original.jpg`;
    const originalPath = path.join(originalsDir, originalFilename);
    await fs.promises.copyFile(inputPath, originalPath);
    console.log(`✓ Stored original: ${originalFilename} (${(originalSize / 1024 / 1024).toFixed(2)} MB)`);

    // 1. RESIZE FOR WEB (3200px width, 75% quality)
    const processedFilename = `${photoId}.jpg`;
    const processedPath = path.join(processedDir, processedFilename);

    const resizedBuffer = await sharp(inputPath)
      .resize(3200, 2400, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    console.log(`✓ Resized to 3200px: ${(resizedBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // 2. ADD WATERMARK
    const watermarkedBuffer = await addWatermark(
      Buffer.isBuffer(resizedBuffer) 
        ? resizedBuffer 
        : inputPath,
      PHOTOGRAPHER_NAME
    );

    await fs.promises.writeFile(processedPath, watermarkedBuffer);
    const processedSize = watermarkedBuffer.length;
    console.log(`✓ Added watermark & saved: ${(processedSize / 1024 / 1024).toFixed(2)} MB`);

    // 3. GENERATE REFERENCE SIZES
    const references: Record<string, number> = {
      thumb: 800,
      medium: 1600,
      high: 3200,
    };

    const refSizes: Record<string, number> = {};

    for (const [refName, refWidth] of Object.entries(references)) {
      const refPath = path.join(referencesDir, `${refName}.jpg`);

      // First resize, then add watermark
      const resized = await sharp(watermarkedBuffer)
        .resize(refWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true })
        .toBuffer();

      await fs.promises.writeFile(refPath, resized);
      refSizes[refName] = resized.length;
      console.log(
        `✓ Generated ${refName}: ${refWidth}px (${(resized.length / 1024 / 1024).toFixed(2)} MB)`
      );
    }

    return {
      success: true,
      photoId,
      originalPath,
      processedPath,
      references: {
        thumb: path.join(referencesDir, 'thumb.jpg'),
        medium: path.join(referencesDir, 'medium.jpg'),
        high: path.join(referencesDir, 'high.jpg'),
      },
      sizes: {
        original: originalSize,
        processed: processedSize,
        thumb: refSizes.thumb,
        medium: refSizes.medium,
        high: refSizes.high,
      },
    };
  } catch (error) {
    console.error(`✗ Error processing photo ${photoId}:`, error);
    return {
      success: false,
      photoId,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get file size in MB (for display)
 */
export function getFileSizeMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2);
}

/**
 * Generate unique photo ID
 */
export function generatePhotoId(): string {
  return `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
