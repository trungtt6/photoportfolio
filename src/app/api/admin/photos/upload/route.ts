// NOTE: This file requires 'npm install googleapis' to work
// Follow GOOGLE_DRIVE_SETUP.md for complete setup instructions

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import prisma from '@/lib/prisma';
import sharp from 'sharp';

// Configure Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Check file size only on Vercel (not localhost)
    const isVercel = request.headers.get('host')?.includes('vercel.app');
    if (isVercel) {
      const maxSize = 4 * 1024 * 1024; // 4MB Vercel limit
      const isLargeFile = file.size > maxSize;

      if (isLargeFile) {
        // For large files, return error with info
        return NextResponse.json({
          error: 'FILE_TOO_LARGE',
          message: `File is ${(file.size / 1024 / 1024).toFixed(2)}MB. Vercel limits uploads to 4MB. Please compress your image or use a smaller file.`,
          maxSize: maxSize,
          currentSize: file.size,
        }, { status: 413 });
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);
    let processedBuffer: Buffer;

    // Add watermark
    try {
      processedBuffer = await sharp(originalBuffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .composite([{
          input: Buffer.from(`
            <svg width="300" height="50" xmlns="http://www.w3.org/2000/svg">
              <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-style="italic" fill="rgba(255,255,255,0.6)" text-anchor="middle" dominant-baseline="middle">
                © TrungTT
              </text>
            </svg>
          `),
          gravity: 'southeast',
        }])
        .jpeg({ quality: 90 })
        .toBuffer();
    } catch (error) {
      console.error('Watermark failed:', error);
      // Use original buffer if watermark fails
      processedBuffer = originalBuffer;
    }

    // Generate unique photo ID
    const photoId = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Upload to Google Drive
    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${photoId}.jpg`,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: {
        mimeType: 'image/jpeg',
        body: processedBuffer,
      },
    });

    // Make file public
    await drive.permissions.create({
      fileId: driveResponse.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get public URL - use direct image link
    const publicUrl = `https://lh3.googleusercontent.com/d/${driveResponse.data.id}`;

    // Save to database
    try {
      await prisma.photo.create({
        data: {
          photoId,
          filename: file.name,
          storagePath: publicUrl,
          title: (formData.get('title') as string) || file.name.replace(/\.[^/.]+$/, ''),
          description: (formData.get('description') as string) || '',
          category: (formData.get('category') as string) || 'landscape',
          tags: [],
          featured: (formData.get('featured') as string) === 'true',
          visible: true,
          price: parseFloat((formData.get('price') as string) || '49.99'),
          licensingAvailable: true,
          width: 3200,
          height: 2400,
          processedSizeMB: parseFloat((file.size / 1024 / 1024).toFixed(2)),
          originalSizeMB: parseFloat((file.size / 1024 / 1024).toFixed(2)),
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      photoId,
      message: 'Photo uploaded to Google Drive successfully',
      url: publicUrl,
      driveFileId: driveResponse.data.id,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
