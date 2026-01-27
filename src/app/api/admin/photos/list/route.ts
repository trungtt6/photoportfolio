import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all photos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');
    const visible = searchParams.get('visible') !== 'false'; // Default to visible

    let where: any = { visible };

    if (featured) {
      where.featured = true;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    const photos = await prisma.photo.findMany({
      where,
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    // Map to Photo interface format
    const formattedPhotos = photos.map(photo => ({
      id: photo.photoId,
      title: photo.title,
      description: photo.description || '',
      imageUrl: photo.storagePath || `/api/storage/processed/${photo.photoId}.jpg`,
      thumbnailUrl: photo.storagePath || `/api/storage/references/${photo.photoId}/thumb.jpg`,
      category: photo.category as any,
      tags: photo.tags,
      date: photo.dateTaken?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      width: photo.width,
      height: photo.height,
      featured: photo.featured,
      price: photo.price,
      licensingAvailable: photo.licensingAvailable,
      storagePath: photo.storagePath,
      filename: photo.filename,
    }));

    return NextResponse.json(formattedPhotos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

// POST - Create new photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      photoId,
      filename,
      title,
      description,
      category,
      tags,
      featured,
      price,
      licensingAvailable,
      width,
      height,
      location,
      dateTaken,
    } = body;

    // Validate required fields
    if (!photoId || !filename || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: photoId, filename, title' },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        photoId,
        filename,
        storagePath: `processed/${filename}`,
        title,
        description,
        category: category || 'landscape',
        tags: tags || [],
        featured: featured || false,
        price: price || 49.99,
        licensingAvailable: licensingAvailable !== false,
        width: width || 3200,
        height: height || 2400,
        location,
        dateTaken: dateTaken ? new Date(dateTaken) : undefined,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}
