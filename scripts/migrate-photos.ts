import { readdir, stat } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

/**
 * Migrate existing photos from storage/processed to MongoDB
 * This script reads photos from disk and creates records in the database
 * Run with: npx ts-node scripts/migrate-photos.ts
 */

async function migratePhotos() {
  try {
    console.log('🚀 Starting photo migration...\n');

    const processedDir = path.join(process.cwd(), 'storage', 'processed');

    // Read all files from processed directory
    const files = await readdir(processedDir);
    const jpgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

    if (jpgFiles.length === 0) {
      console.log('❌ No photos found in storage/processed/');
      return;
    }

    console.log(`📸 Found ${jpgFiles.length} photos to migrate\n`);

    for (const file of jpgFiles) {
      try {
        const photoId = file.replace(/\.(jpg|jpeg)$/i, '');
        
        // Check if already exists
        const existing = await prisma.photo.findUnique({
          where: { photoId },
        });

        if (existing) {
          console.log(`⏭️  Skipping ${file} (already in database)`);
          continue;
        }

        // Get file size
        const filePath = path.join(processedDir, file);
        const fileStats = await stat(filePath);
        const fileSizeMB = fileStats.size / (1024 * 1024);

        // Create database record
        const photo = await prisma.photo.create({
          data: {
            photoId,
            filename: file,
            storagePath: `processed/${file}`,
            title: `Photo ${jpgFiles.indexOf(file) + 1}`,
            description: 'Processed and watermarked photograph',
            category: 'landscape',
            tags: ['watermarked', 'processed'],
            featured: jpgFiles.indexOf(file) < 3, // First 3 are featured
            price: 49.99,
            licensingAvailable: true,
            width: 3200,
            height: 2400,
            processedSizeMB: fileSizeMB,
          },
        });

        console.log(`✅ Migrated: ${file}`);
      } catch (error) {
        console.error(`❌ Error migrating ${file}:`, error);
      }
    }

    console.log('\n✨ Migration complete!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run migration
migratePhotos();
