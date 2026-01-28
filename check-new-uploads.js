require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNewUploads() {
  try {
    const photos = await prisma.photo.findMany({
      select: {
        photoId: true,
        title: true,
        googleDriveUrl: true,
        googleDriveId: true,
        uploadedAt: true
      },
      orderBy: { uploadedAt: 'desc' },
      take: 5
    });
    
    console.log('Latest 5 photos:\n');
    
    photos.forEach(p => {
      console.log(`${p.title} (${p.photoId})`);
      console.log(`  URL: ${p.googleDriveUrl || 'NULL'}`);
      console.log(`  ID: ${p.googleDriveId || 'NULL'}`);
      console.log(`  Time: ${p.uploadedAt}\n`);
    });
    
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    await prisma.$disconnect();
  }
}

checkNewUploads();
