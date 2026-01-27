#!/usr/bin/env node

/**
 * Test MongoDB connection and import photos
 * Run: npm run test:db
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  TESTING MONGODB CONNECTION & IMPORTING PHOTOS        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  try {
    // Test database connection
    console.log('🔌 Testing MongoDB connection...');
    const result = await prisma.photo.findFirst();
    console.log('✅ Connected to MongoDB!\n');

    // Count existing photos
    const count = await prisma.photo.count();
    console.log(`📊 Photos in database: ${count}`);

    if (count > 0) {
      console.log('✅ Photos already in database - skipping import\n');
      
      // Show first few photos
      const photos = await prisma.photo.findMany({ take: 3 });
      console.log('Sample photos:');
      photos.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.title} (${p.category})`);
      });
    } else {
      console.log('📸 No photos in database - importing from storage...\n');

      // Import photos from filesystem
      const { readdir, stat } = require('fs').promises;
      const processedDir = path.join(process.cwd(), 'storage', 'processed');

      try {
        const files = await readdir(processedDir);
        const jpgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

        if (jpgFiles.length === 0) {
          console.log('❌ No photos found in storage/processed/');
        } else {
          console.log(`Found ${jpgFiles.length} photos to import:\n`);

          for (const file of jpgFiles) {
            try {
              const photoId = file.replace(/\.(jpg|jpeg)$/i, '');
              const filePath = path.join(processedDir, file);
              const fileStats = await stat(filePath);

              const photo = await prisma.photo.create({
                data: {
                  photoId,
                  filename: file,
                  storagePath: `processed/${file}`,
                  title: `Photo ${jpgFiles.indexOf(file) + 1}`,
                  description: 'Professional watermarked photograph',
                  category: 'landscape',
                  tags: ['watermarked', 'processed'],
                  featured: jpgFiles.indexOf(file) < 3,
                  price: 49.99,
                  licensingAvailable: true,
                  width: 3200,
                  height: 2400,
                  processedSizeMB: fileStats.size / (1024 * 1024),
                },
              });

              console.log(`✅ Imported: ${file}`);
            } catch (error) {
              console.log(`⚠️  Skipped: ${file} (already in database or error)`);
            }
          }
        }
      } catch (err) {
        console.log('⚠️  Could not read storage directory:', err.message);
      }
    }

    console.log('\n✨ Done!\n');
    console.log('📊 Summary:');
    const finalCount = await prisma.photo.count();
    console.log(`   Total photos: ${finalCount}`);
    
    if (finalCount > 0) {
      console.log('   ✅ Ready to manage via admin panel');
      console.log('   ✅ Photos will display in gallery');
    }

  } catch (error) {
    if (error.message.includes('getaddrinfo') || error.message.includes('ENOTFOUND')) {
      console.error('❌ Cannot connect to MongoDB');
      console.error('\nCheck your DATABASE_URL in .env.local');
      console.error('Make sure:');
      console.error('  1. MongoDB Atlas cluster is running');
      console.error('  2. Network access includes 0.0.0.0/0');
      console.error('  3. Database user credentials are correct');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
