import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { processPhoto, generatePhotoId, getFileSizeMB } from '@/lib/imageProcessor';
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

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to temp folder
    const tempDir = path.join(process.cwd(), 'storage', 'temp');
    await mkdir(tempDir, { recursive: true });

    const tempFileName = `${Date.now()}-${file.name}`;
    const tempPath = path.join(tempDir, tempFileName);

    await writeFile(tempPath, buffer);
    console.log(`✓ File saved to temp: ${tempPath} (${getFileSizeMB(buffer.byteLength)} MB)`);

    // Generate unique photo ID
    const photoId = generatePhotoId();

    // Process the photo (resize, watermark, generate references)
    console.log(`\n🔄 Processing photo: ${photoId}`);
    console.log('━'.repeat(50));

    const result = await processPhoto(tempPath, photoId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Processing failed' },
        { status: 500 }
      );
    }

    // Clean up temp file
    try {
      await import('fs').then(fs => fs.promises.unlink(tempPath));
    } catch (e) {
      console.warn('Failed to delete temp file');
    }

    console.log('\n✅ Processing complete!');
    console.log('━'.repeat(50));
    console.log(`Original Size:  ${getFileSizeMB(result.sizes!.original)} MB`);
    console.log(`Processed Size: ${getFileSizeMB(result.sizes!.processed)} MB`);
    console.log(
      `Reduction: ${(
        ((result.sizes!.original - result.sizes!.processed) /
          result.sizes!.original) *
        100
      ).toFixed(1)}%`
    );

    // Save to database
    console.log('\n💾 Saving to database...');
    try {
      await prisma.photo.create({
        data: {
          photoId: photoId,
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
          processedSizeMB: parseFloat(getFileSizeMB(result.sizes!.processed)),
          originalSizeMB: parseFloat(getFileSizeMB(result.sizes!.original)),
        },
      });
      console.log(`✓ Photo saved to database (ID: ${photoId})`);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Photo processed but failed to save to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      photoId,
      message: 'Photo processed and saved successfully',
      sizes: {
        original: getFileSizeMB(result.sizes!.original),
        processed: getFileSizeMB(result.sizes!.processed),
      },
      paths: {
        processed: `/storage/processed/${photoId}.jpg`,
        thumb: `/storage/references/${photoId}/thumb.jpg`,
        medium: `/storage/references/${photoId}/medium.jpg`,
        high: `/storage/references/${photoId}/high.jpg`,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
