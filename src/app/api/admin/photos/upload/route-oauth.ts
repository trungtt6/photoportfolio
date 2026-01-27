// Alternative Google Drive upload using OAuth 2.0
// Use this if you prefer OAuth over service account
// NOTE: Requires 'npm install googleapis' to work

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import prisma from '@/lib/prisma';

// OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);

// Set credentials
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

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

    // File size validation removed - Google Drive handles large files

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique photo ID
    const photoId = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Upload to Google Drive
    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${photoId}.jpg`,
        parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : undefined,
      },
      media: {
        mimeType: file.type,
        body: buffer,
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

    // Get public URL
    const publicUrl = `https://drive.google.com/uc?id=${driveResponse.data.id}`;

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
