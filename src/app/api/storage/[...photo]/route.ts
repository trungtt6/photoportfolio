import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ photo: string[] }> }
) {
  try {
    const { photo } = await params;
    const filePath = photo.join('/');
    
    // Security: prevent directory traversal
    if (filePath.includes('..') || filePath.includes('original')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Build full path to storage
    const fullPath = path.join(
      process.cwd(),
      'storage',
      filePath
    );

    // Read the file
    const fileBuffer = await readFile(fullPath);

    // Determine content type
    let contentType = 'application/octet-stream';
    if (fullPath.endsWith('.jpg') || fullPath.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (fullPath.endsWith('.png')) {
      contentType = 'image/png';
    }

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('File read error:', error);
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}
