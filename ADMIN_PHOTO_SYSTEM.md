# Photo Upload & Watermark System - Technical Specification

## Overview
When admin uploads full-resolution photos, the system automatically:
1. Stores originals in secure folder (for sales/licensing)
2. Resizes and optimizes for web (3200px, 75% quality)
3. Adds photographer watermark
4. Serves watermarked version on website
5. Stores reference copies at multiple resolutions

---

## Folder Structure

```
PhotoPortfolio/
├── public/
│   └── images/              # Current (to be refactored)
│       ├── mountain.jpg
│       ├── forest.jpg
│       └── ocean.jpg
│
└── storage/                 # NEW - Private file storage
    ├── originals/           # NOT accessible via web
    │   ├── 2026-01/
    │   │   ├── mountain-original.NEF
    │   │   ├── forest-original.CR2
    │   │   └── ocean-original.Canon
    │   ├── 2026-02/
    │   │   └── [more photos]
    │   └── metadata.json
    │
    ├── processed/           # Web-ready files (with watermark)
    │   ├── mountain.jpg     # 3200px, 75% quality, watermarked
    │   ├── forest.jpg
    │   ├── ocean.jpg
    │   └── manifest.json    # Track processed files
    │
    ├── references/          # Multiple resolution samples
    │   ├── mountain/
    │   │   ├── thumb.jpg        (800px)
    │   │   ├── medium.jpg       (1600px)
    │   │   ├── high.jpg         (3200px)
    │   │   └── preview.jpg      (for lightbox)
    │   ├── forest/
    │   │   └── [similar structure]
    │   └── ocean/
    │       └── [similar structure]
    │
    └── temp/                # Temporary upload processing
        ├── uploads/         # Temp upload staging
        └── processing/      # Currently being processed
```

---

## Data Models

### Photo Metadata (TypeScript)
```typescript
interface OriginalPhoto {
  id: string;
  filename: string;
  originalPath: string;        // storage/originals/2026-01/mountain.NEF
  processedPath: string;        // storage/processed/mountain.jpg
  uploadDate: Date;
  photographer: string;
  camera: {
    model: string;
    lens: string;
  };
  originalDimensions: {
    width: number;
    height: number;
  };
  fileSize: {
    original: number;           // bytes
    processed: number;          // bytes
    compressed: number;         // bytes (if further compressed)
  };
  location?: string;
  title: string;
  description: string;
  category: PhotoCategory;
  tags: string[];
  featured: boolean;
  licensing: {
    available: boolean;
    tiers: LicenseOption[];
  };
  references: {                 // Multiple resolution copies
    thumb: { path: string; size: number };
    medium: { path: string; size: number };
    high: { path: string; size: number };
    preview: { path: string; size: number };
  };
  watermark: {
    applied: boolean;
    style: 'text' | 'logo';
    opacity: number;            // 0-100
    position: 'bottom-right' | 'center' | 'bottom-left';
  };
  locked: boolean;              // Prevent accidental deletion
}

interface ProcessingJob {
  id: string;
  photoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  error?: string;
  steps: {
    upload: boolean;
    validate: boolean;
    resize: boolean;
    watermark: boolean;
    generateReferences: boolean;
  };
}
```

---

## Upload & Processing Flow

### Step 1: Admin Initiates Upload
```
Admin selects photo file
        ↓
Client validates (size, format, dimensions)
        ↓
File uploaded to /storage/temp/uploads/
```

### Step 2: Validation
```
Check file type: JPG, PNG, NEF, CR2, Canon RAW
Check file size: Max 500MB
Check dimensions: Min 3000px width
Check for duplicates: Compare hash with existing originals
```

### Step 3: Background Processing Job
```
1. STORE ORIGINAL
   - Copy to storage/originals/YYYY-MM/
   - Generate file hash for deduplication
   - Store metadata in database

2. RESIZE FOR WEB
   - Load original file
   - Resize to 3200px max width (maintain aspect ratio)
   - Output as JPG with 75% quality
   - Save to storage/processed/

3. ADD WATERMARK
   - Load resized image
   - Create watermark text/logo
   - Set opacity to 18%
   - Overlay on bottom-right corner
   - Save back to storage/processed/

4. GENERATE REFERENCES
   - Create thumbnail: 800px width
   - Create medium: 1600px width
   - Create preview: for lightbox (full but watermarked)
   - Save to storage/references/{photoId}/

5. UPDATE MANIFEST
   - Record all file paths
   - Store file sizes
   - Mark as completed
```

### Step 4: Website Display
```
User visits /gallery
        ↓
Database query fetches photos
        ↓
Serve: storage/processed/{photo}.jpg  (watermarked)
        ↓
Gallery displays optimized image
```

---

## Implementation Details

### Libraries Required
```json
{
  "sharp": "^0.32.0",              // Image resizing/processing
  "jimp": "^0.22.0",               // Watermark overlay (alternative)
  "canvas": "^2.11.0",             // Advanced watermarking
  "bull": "^4.11.0",               // Job queue for background processing
  "multer": "^1.4.5-lts.1",        // File upload handling
  "node-cron": "^3.0.2"            // Scheduled cleanup jobs
}
```

### Image Processing Code Example
```typescript
import sharp from 'sharp';

async function processPhoto(originalPath: string, photoId: string) {
  try {
    const resizedPath = `storage/processed/${photoId}.jpg`;
    
    // Resize and optimize
    await sharp(originalPath)
      .resize(3200, 2400, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 75, progressive: true })
      .toFile(resizedPath);
    
    // Add watermark
    await addWatermark(resizedPath, `© 2026 Photographer`);
    
    // Generate references
    await generateReferences(resizedPath, photoId);
    
    return { success: true, path: resizedPath };
  } catch (error) {
    console.error(`Failed to process photo ${photoId}:`, error);
    return { success: false, error: error.message };
  }
}

async function addWatermark(imagePath: string, text: string) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  
  // Create SVG watermark
  const watermarkSvg = `
    <svg width="${metadata.width}" height="${metadata.height}">
      <text 
        x="${metadata.width - 20}" 
        y="${metadata.height - 20}"
        font-size="24"
        fill="white"
        opacity="0.18"
        text-anchor="end"
      >
        ${text}
      </text>
    </svg>
  `;
  
  // Overlay on image
  return sharp(imagePath)
    .composite([{
      input: Buffer.from(watermarkSvg),
      top: 0,
      left: 0,
    }])
    .toFile(imagePath);
}

async function generateReferences(imagePath: string, photoId: string) {
  const sizes = [
    { name: 'thumb', width: 800 },
    { name: 'medium', width: 1600 },
    { name: 'preview', width: 3200 }
  ];
  
  for (const size of sizes) {
    await sharp(imagePath)
      .resize(size.width, null, { withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toFile(`storage/references/${photoId}/${size.name}.jpg`);
  }
}
```

### Upload API Endpoint
```typescript
// app/api/admin/photos/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadQueue } from '@/lib/queue';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  
  try {
    // Save to temp folder
    const tempPath = `storage/temp/uploads/${Date.now()}-${file.name}`;
    const buffer = await file.arrayBuffer();
    // ... save buffer to tempPath
    
    // Queue processing job
    const job = await uploadQueue.add('process-photo', {
      tempPath,
      filename: file.name,
      uploadedBy: request.user?.id,
    });
    
    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Photo queued for processing'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Watermark Settings

### Default Configuration
```typescript
const watermarkConfig = {
  text: `© ${new Date().getFullYear()} [Photographer Name]`,
  font: 'sans-serif',
  fontSize: 24,
  fontColor: '#FFFFFF',
  opacity: 0.18,              // 18% opacity = visible but not intrusive
  position: 'bottom-right',   // bottom-right | center | bottom-left
  padding: 20,                // pixels from edge
  style: 'text',              // 'text' | 'logo'
};
```

### Logo Watermark Alternative
```typescript
// If using logo instead of text
const logoWatermark = {
  logoPath: 'public/assets/watermark-logo.png',
  opacity: 0.2,
  size: 120,  // pixels
  position: 'bottom-right',
};
```

---

## File Size Optimization

### Before & After
| Step | File | Size | Reduction |
|------|------|------|-----------|
| Original | mountain.NEF | 45 MB | — |
| Converted to JPG (no resize) | mountain.jpg | 22 MB | 51% |
| Resized to 3200px | mountain-3200.jpg | 4.2 MB | 81% |
| With 75% quality | mountain-opt.jpg | 2.1 MB | 90% |
| With watermark | mountain-final.jpg | 2.2 MB | 95% |

**Result:** 45 MB → 2.2 MB (95% reduction! ✅)

---

## Security Considerations

### Access Control
- **Originals** (/storage/originals/) - NOT accessible via web
  - Only accessible to admin with special token
  - Served through secure download endpoint with logging
  
- **Processed** (/storage/processed/) - Accessible via web
  - Watermarked version only
  - Can be viewed without auth
  
- **References** (/storage/references/) - For sampling
  - Used for lightbox/modal previews
  - Watermark visible on all sizes

### Anti-Piracy
- All web-displayed images watermarked
- Original files never served to web
- Download links have expiration (24 hours)
- Usage logging on all downloads
- Prevent direct file access (use streaming endpoints)

### Backup Strategy
- Originals backed up to cloud (AWS S3, Backblaze)
- Automated daily backups
- 30-day retention policy
- Encrypted backups

---

## Admin Dashboard Features

### Photo Management
- [x] Upload interface (drag & drop)
- [x] Batch upload multiple photos
- [x] View upload progress
- [x] Delete photos (soft delete originals)
- [x] Re-process photos (redo watermark, resize)
- [x] Download original (admin only)

### Monitoring
- [x] Processing queue status
- [x] Storage usage (originals vs processed)
- [x] Failed jobs log
- [x] Processing time statistics

### Configuration
- [x] Watermark text customization
- [x] Watermark position/opacity
- [x] Quality settings (% and dimensions)
- [x] Auto-cleanup old temp files

---

## Deployment Checklist

- [ ] Create storage folder structure
- [ ] Set environment variables (storage paths)
- [ ] Configure job queue (Redis or local)
- [ ] Set up file permissions (read/write)
- [ ] Enable background job processing
- [ ] Configure backup strategy
- [ ] Test upload workflow end-to-end
- [ ] Monitor initial uploads
- [ ] Set up log alerts

---

## Future Enhancements

### Phase 2+
- [ ] Cloud storage integration (AWS S3, Google Cloud Storage)
- [ ] CDN delivery (CloudFlare, Fastly)
- [ ] Image AI tagging (auto-categorize photos)
- [ ] EXIF data preservation and display
- [ ] Batch watermark customization per shoot
- [ ] Smart cropping detection (remove excess sky/ground)
- [ ] Format conversion (WebP for better compression)

---

## FAQ

**Q: Why keep originals if we don't display them?**
A: For premium sales. Customers pay extra for:
  - RAW files (unedited, full control)
  - Full resolution downloads (for prints)
  - License certificates (for commercial use)

**Q: How long are originals stored?**
A: Indefinitely for active photos. For deleted photos:
  - Soft delete: 90-day recovery window
  - Hard delete: Purge from all backups

**Q: Can watermark be removed by users?**
A: It's added to JPEG data, not a layer, so removing requires rebuilding the image (detectable piracy).

**Q: What if upload fails?**
A: Job retries 3x automatically, then alerts admin. Manual retry available.

**Q: Mobile-friendly upload?**
A: Yes - responsive upload form, progress bar, works on phones/tablets.

