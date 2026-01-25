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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 4MB for Vercel)
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // For Vercel serverless, we can't process images with Sharp
    // Instead, we'll save the metadata and instruct user to add images manually
    
    const photoId = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Save to database
    console.log('\n💾 Saving to database...');
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
      console.log(`✓ Photo metadata saved to database (ID: ${photoId})`);
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
      message: 'Photo metadata saved successfully',
      note: 'Image processing is disabled on Vercel. Please add processed images to public/storage/ folder',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
