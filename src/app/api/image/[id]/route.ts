import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Remove .jpg extension if present
  const photoId = id.endsWith('.jpg') ? id.slice(0, -4) : id;
  
  try {
    // Get the photo from database
    const photo = await prisma.photo.findUnique({
      where: { photoId: photoId },
      select: { googleDriveUrl: true, thumbnailDriveId: true, storagePath: true }
    });
    
    if (!photo) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    // Determine if we need thumbnail
    const { searchParams } = new URL(request.url);
    const isThumbnail = searchParams.get('size') === 'thumb';
    
    let imageUrl: string;
    
    // Check if we have Google Drive URLs
    if (photo.googleDriveUrl) {
      imageUrl = isThumbnail && photo.thumbnailDriveId 
        ? `https://drive.usercontent.google.com/download?id=${photo.thumbnailDriveId}`
        : photo.googleDriveUrl;
    } else if (photo.storagePath) {
      // Fall back to storage path for older photos
      imageUrl = photo.storagePath;
    } else {
      // Final fallback to local storage
      imageUrl = isThumbnail 
        ? `${process.cwd()}/storage/references/${photoId}/thumb.jpg`
        : `${process.cwd()}/storage/processed/${photoId}.jpg`;
    }
    
    // Fetch the image
    let response: Response;
    
    if (imageUrl.startsWith('http')) {
      // Fetch from URL (Google Drive or old Google URLs)
      response = await fetch(imageUrl);
    } else {
      // Read from local file
      const fs = await import('fs/promises');
      try {
        const imageBuffer = await fs.readFile(imageUrl);
        const contentType = imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') 
          ? 'image/jpeg' 
          : 'image/png';
        
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Cross-Origin-Resource-Policy': 'cross-origin',
          },
        });
      } catch (err) {
        return NextResponse.json({ error: 'Local file not found' }, { status: 404 });
      }
    }
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }
    
    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Get content type from response or default to jpeg
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
