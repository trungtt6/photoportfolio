import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid photo IDs' }, { status: 400 });
    }

    const deleteResult = await prisma.photo.deleteMany({
      where: {
        photoId: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.count} photos`,
      count: deleteResult.count,
    });
  } catch (error) {
    console.error('Error during bulk deletion:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk deletion' },
      { status: 500 }
    );
  }
}
