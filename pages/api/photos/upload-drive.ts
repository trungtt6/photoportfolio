import { NextApiRequest, NextApiResponse } from 'next';
import { initializeFolders, uploadFile } from '../../../lib/google-drive-oauth';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import formidable from 'formidable';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const file = files.file?.[0];
    const title = fields.title?.[0] || '';
    const description = fields.description?.[0] || '';
    const category = fields.category?.[0] || 'landscape';
    const tags = fields.tags?.[0] || [];
    const featured = fields.featured?.[0] === 'true';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check file size only on Vercel
    const isVercel = req.headers.host?.includes('vercel.app');
    if (isVercel && file.size > 4 * 1024 * 1024) {
      return res.status(413).json({
        error: 'FILE_TOO_LARGE',
        message: `File is ${(file.size / 1024 / 1024).toFixed(2)}MB. Vercel limits uploads to 4MB.`,
      });
    }

    // Read file buffer
    const fileBuffer = require('fs').readFileSync(file.filepath);

    // Initialize Google Drive folders for category
    const folders = await initializeFolders(category);

    // Generate unique photo ID
    const photoId = uuidv4();
    const fileExtension = file.originalFilename?.split('.').pop() || 'jpg';
    const baseFileName = `${photoId}.${fileExtension}`;

    // Upload original file
    await uploadFile(
      fileBuffer,
      baseFileName,
      file.mimetype || 'image/jpeg',
      folders.originals,
      {
        photoId,
        type: 'original',
        uploadedAt: new Date().toISOString(),
      }
    );

    // Process image - create watermarked version
    // Create a simple text-based watermark without relying on system fonts
    const watermarkSvg = `
      <svg width="400" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="60" fill="transparent"/>
        <text x="200" y="40" 
              font-family="Arial, Helvetica, sans-serif" 
              font-size="28" 
              font-weight="bold"
              fill="rgba(255,255,255,0.7)" 
              text-anchor="middle">
          © TrungTT
        </text>
      </svg>
    `;
    
    // Configure sharp to avoid font issues
    const watermarkBuffer = await sharp(fileBuffer, { failOnError: false })
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .composite([{
        input: Buffer.from(watermarkSvg),
        gravity: 'southeast',
      }])
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload processed (watermarked) file
    const processedFileName = `${photoId}_processed.jpg`;
    const processedUpload = await uploadFile(
      watermarkBuffer,
      processedFileName,
      'image/jpeg',
      folders.processed,
      {
        photoId,
        type: 'processed',
        uploadedAt: new Date().toISOString(),
      }
    );

    // Create thumbnail
    let thumbnailBuffer;
    try {
      thumbnailBuffer = await sharp(fileBuffer, { failOnError: false })
        .resize(400, 300, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      throw new Error('Failed to process image thumbnail');
    }

    // Upload thumbnail
    const thumbnailFileName = `${photoId}_thumb.jpg`;
    await uploadFile(
      thumbnailBuffer,
      thumbnailFileName,
      'image/jpeg',
      folders.thumbnails,
      {
        photoId,
        type: 'thumbnail',
        uploadedAt: new Date().toISOString(),
      }
    );

    // Get image dimensions
    let metadata;
    try {
      metadata = await sharp(fileBuffer, { failOnError: false }).metadata();
    } catch (error) {
      console.warn('Warning: Could not read image metadata:', error);
      metadata = { width: 1920, height: 1080 };
    }

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        photoId,
        filename: file.originalFilename || '',
        storagePath: `https://lh3.googleusercontent.com/d/${processedUpload.fileId}`,
        title,
        description,
        category,
        tags: Array.isArray(tags) ? tags : [tags],
        featured,
        visible: true,
        width: metadata.width || 1920,
        height: metadata.height || 1080,
        originalSizeMB: file.size ? file.size / (1024 * 1024) : 0,
        processedSizeMB: watermarkBuffer.length / (1024 * 1024),
      },
    });

    // Clean up temp file
    require('fs').unlinkSync(file.filepath);

    res.status(200).json({
      success: true,
      photo: {
        id: photo.id,
        photoId: photo.photoId,
        filename: photo.filename,
        title: photo.title,
        description: photo.description,
        category: photo.category,
        tags: photo.tags,
        featured: photo.featured,
        width: photo.width,
        height: photo.height,
        price: photo.price,
        licensingAvailable: photo.licensingAvailable,
        storagePath: photo.storagePath,
        originalSizeMB: photo.originalSizeMB,
        processedSizeMB: photo.processedSizeMB,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to upload photo', details: errorMessage });
  }
}
