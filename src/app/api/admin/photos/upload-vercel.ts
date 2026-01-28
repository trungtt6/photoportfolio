import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    // Check file size (max 4MB for Vercel)
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // For now, save basic info without processing
    // In production, you'd use a cloud storage service
    const photoId = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Save to database
    try {
      await prisma.photo.create({
        data: {
          photoId,
          filename: file.name,
          storagePath: `/storage/processed/${photoId}.jpg`,
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

    // Return success
    return NextResponse.json({
      success: true,
      photoId,
      message: 'Photo information saved successfully',
      note: 'Image processing disabled on Vercel. Please process images locally and upload to public/storage/',
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
