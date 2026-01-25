import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { readdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // First, try to get photos from database
    try {
      const photos = await prisma.photo.findMany({
        where: { visible: true },
        orderBy: { uploadedAt: 'desc' },
      });

      if (photos.length > 0) {
        // Map database records to Photo interface
        const formattedPhotos = photos.map(photo => ({
          id: photo.photoId,
          title: photo.title,
          description: photo.description || '',
          imageUrl: `/api/storage/processed/${photo.photoId}.jpg`,
          thumbnailUrl: `/api/storage/references/${photo.photoId}/thumb.jpg`,
          category: photo.category as any,
          tags: photo.tags,
          date: photo.dateTaken?.toISOString().split('T')[0] || photo.uploadedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          width: photo.width,
          height: photo.height,
          featured: photo.featured,
          price: photo.price,
          licensingAvailable: photo.licensingAvailable,
        }));

        return NextResponse.json(formattedPhotos);
      }
    } catch (dbError) {
      console.log('Database not available, falling back to filesystem');
    }

    // Fallback: Read from filesystem if database not available
    const processedDir = path.join(process.cwd(), 'storage', 'processed');
    
    try {
      const files = await readdir(processedDir);
      const jpgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

      const photos = jpgFiles.map((file, index) => ({
        id: file.replace(/\.(jpg|jpeg)$/i, ''),
        title: `Photo ${index + 1}`,
        description: 'Professional watermarked photograph',
        imageUrl: `/api/storage/processed/${file}`,
        thumbnailUrl: `/api/storage/references/${file.replace(/\.(jpg|jpeg)$/i, '')}/thumb.jpg`,
        category: 'landscape' as const,
        tags: ['watermarked', 'processed'],
        date: new Date().toISOString().split('T')[0],
        width: 3200,
        height: 2400,
        featured: true,
        price: 49.99,
        licensingAvailable: true,
      }));

      return NextResponse.json(photos);
    } catch (err) {
      console.log('No processed photos found');
    }

    // Return empty array if nothing available
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error loading photos:', error);
    return NextResponse.json([], { status: 500 });
  }
}
