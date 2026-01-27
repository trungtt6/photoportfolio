import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Test endpoint to verify MongoDB connection
 * GET /api/admin/test
 */
export async function GET() {
  try {
    // Try to connect to database
    const testPhoto = await prisma.photo.findFirst({
      where: { visible: true },
    });

    return NextResponse.json({
      status: 'connected',
      message: 'Successfully connected to MongoDB!',
      photosInDatabase: true,
      testData: testPhoto ? `Found ${testPhoto.title}` : 'No photos yet',
    });
  } catch (error: any) {
    console.error('Database connection error:', error);

    // Check if it's a connection error
    const isConnectionError =
      error.message.includes('connect') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('getaddrinfo');

    return NextResponse.json({
      status: 'disconnected',
      message: isConnectionError
        ? 'Cannot connect to MongoDB. Check your DATABASE_URL in .env.local'
        : error.message,
      error: error.message,
      instructions: [
        '1. Open MONGODB_SETUP.md for setup instructions',
        '2. Create free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas',
        '3. Get your connection string',
        '4. Add to .env.local: DATABASE_URL="your_connection_string"',
        '5. Restart dev server',
      ],
    });
  }
}
