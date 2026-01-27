# Photo Management Guide

## 📸 System Overview

Your website uses a **smart two-tier photo system** with automatic processing:

### Current State (Phase 1)
- ✅ Simple direct photo storage
- ✅ Manual photo management
- ✅ Basic gallery display

### Planned: Phase 2 - Smart Upload System
- 🔄 Admin uploads full resolution (originals stored securely)
- 🔄 System auto-resizes for web (3200px, 75% quality)
- 🔄 Auto-adds watermark to prevent copying
- 🔄 Generates reference copies at multiple resolutions
- 🔄 Website displays watermarked version only

**See [ADMIN_PHOTO_SYSTEM.md](ADMIN_PHOTO_SYSTEM.md) for Phase 2 technical details!**

---

## Current Implementation (Phase 1)

### 1. **Data Layer** (`src/lib/photos.ts`)
- Central photo database with metadata
- Contains: title, description, category, price, featured status, etc.
- References image URLs (currently pointing to `/images/` folder)

### 2. **Image Assets** (`public/images/`)
- Actual photo files stored here
- Accessible via URLs like `/images/mountain-sunrise.jpg`

---

## 🔧 How to Add/Update Photos

### Step 1: Add Your Photo Files
1. Save your photos to `public/images/` folder:
   ```
   C:\trungtt\PhotoPortfolio\public\images\
   ├── mountain-sunrise.jpg
   ├── forest-path.jpg
   ├── architecture.jpg
   ├── ocean-waves.jpg
   ├── eagle-flight.jpg
   └── city-night.jpg
   ```

2. **Recommended Image Format:**
   - Format: JPG or PNG
   - Quality: High resolution (4000x2667 or similar)
   - Size: Optimize for web (200-500KB per image)
   - Name: Use lowercase with hyphens (e.g., `my-photo.jpg`)

### Step 2: Update Photo Data
Edit `src/lib/photos.ts` and modify the `SAMPLE_PHOTOS` array:

```typescript
{
  id: '1',
  title: 'Your Photo Title',
  description: 'Brief description of your photo',
  imageUrl: '/images/your-photo.jpg',        // ← Your image file
  thumbnailUrl: '/images/your-photo-thumb.jpg',  // ← Optional thumbnail
  category: 'landscape',  // landscape|portrait|wildlife|architecture|nature|street|other
  tags: ['tag1', 'tag2', 'tag3'],
  date: '2026-01-25',
  width: 4000,    // Image width in pixels
  height: 2667,   // Image height in pixels
  featured: true,  // Show on home page?
  price: 45,      // Price in USD
  licensingAvailable: true,
}
```

### Step 3: Changes Apply Automatically
- Next.js will hot-reload the page
- Your photos appear instantly at http://localhost:3000

---

## 📋 Current Sample Photos

Your site currently has 6 sample photos configured:

| Photo | Category | Featured | Price |
|-------|----------|----------|-------|
| Mountain Sunrise | Landscape | ✅ Yes | $45 |
| Forest Path | Nature | ✅ Yes | $40 |
| Urban Architecture | Architecture | ❌ No | $35 |
| Ocean Waves | Landscape | ✅ Yes | $50 |
| Wildlife Portrait | Wildlife | ❌ No | $55 |
| City at Night | Street | ❌ No | $45 |

**Currently 3 photos showing on home page** (marked as `featured: true`)

---

## 🎯 Quick Actions

### Add a New Photo
1. Save image to `public/images/your-photo.jpg`
2. Add entry to `SAMPLE_PHOTOS` array in `src/lib/photos.ts`
3. Set `featured: true` to show on home page
4. Refresh browser - photo appears instantly

### Mark Photo as Featured
```typescript
featured: true,  // ← Shows on home page
```

### Hide Photo from Gallery
```typescript
featured: false,  // ← Only in gallery, not home
```

### Update Photo Price
```typescript
price: 49.99,  // Change price in USD
```

### Change Photo Category
Choose from:
- `landscape` - Landscapes, nature scenery
- `portrait` - People, faces, portraits
- `wildlife` - Animals, birds, nature
- `architecture` - Buildings, structures
- `nature` - Trees, plants, close-ups
- `street` - Urban, city, street photography
- `other` - Miscellaneous

---

## 🖼️ Why Is My Site Blank?

**Reason:** The demo images don't exist yet. The page layout is correct, but you see gradient placeholders instead of photos because:

1. Files referenced in `src/lib/photos.ts` don't exist:
   - `/images/mountain-sunrise.jpg` ❌
   - `/images/forest-path.jpg` ❌
   - etc.

2. **The placeholder fallback shows instead:**
   - Gradient background
   - Photo title text
   - Price and category

**Solution:** Add actual image files to `public/images/` folder

---

## ✨ How Photos Display

### On Home Page
- Shows **3 featured photos** (Featured Work section)
- Styled as cards with hover effects
- Shows title, description, price, category

### In Gallery (`/gallery`)
- **All photos** in responsive grid
- Search by title/description/tags
- Filter by category
- Shows featured badge on featured photos

### Photo Card Display
```
┌─────────────────┐
│  Photo Image    │ ← Placeholder if image missing
│  or Gradient    │
├─────────────────┤
│ Photo Title     │
│ Description     │
│ $Price  Category│
└─────────────────┘
```

---

## 📁 Folder Structure

```
public/
└── images/
    ├── mountain-sunrise.jpg       ← Your actual photos go here
    ├── forest-path.jpg
    ├── architecture.jpg
    ├── ocean-waves.jpg
    ├── eagle-flight.jpg
    └── city-night.jpg

src/
└── lib/
    └── photos.ts                  ← Photo metadata database
```

---

## 🚀 To See Your Photos

### Option A: Use Your Own Photos
1. Export photos from Lightroom/Capture One/etc
2. Save as JPG files to `public/images/`
3. Update `src/lib/photos.ts` with your photo details
4. Refresh browser

### Option B: Use Placeholder Images
1. Visit [unsplash.com](https://unsplash.com) or [pexels.com](https://pexels.com)
2. Download sample landscape/nature photos
3. Save to `public/images/` with matching names
4. Refresh - photos appear instantly

---

## 💡 Tips for Best Results

### Image Optimization
- **Size:** Keep images 200-500KB for fast loading
- **Dimensions:** 4000x2667 (landscape) or 3600x4800 (portrait)
- **Format:** Use JPG for photos, PNG for transparency
- **Tools:** TinyPNG, ImageOptim, or Lightroom export

### File Naming
- Use lowercase: `mountain-sunrise.jpg` ✅
- Use hyphens: `my-photo.jpg` ✅
- Avoid spaces: `my-photo.jpg` ✅ (not `my photo.jpg`)
- Descriptive names help with SEO

### Categories & Tags
- **Category:** Single primary category per photo
- **Tags:** Multiple keywords for search
- Improves gallery filtering and discovery

### Pricing
- Featured prints: $35-$60
- Digital downloads: $10-$25
- Licensing tiers: $50-$300
- Adjust to your market

---

## 📝 Example: Adding 1 New Photo

### Step 1: Save Your Photo
Save your mountain photo to:
```
C:\trungtt\PhotoPortfolio\public\images\my-mountain.jpg
```

### Step 2: Update photos.ts
Add to `SAMPLE_PHOTOS` array:
```typescript
{
  id: '7',
  title: 'Alpine Peak',
  description: 'Snow-covered mountain at dawn',
  imageUrl: '/images/my-mountain.jpg',
  thumbnailUrl: '/images/my-mountain-thumb.jpg',
  category: 'landscape',
  tags: ['mountain', 'alpine', 'dawn', 'snow'],
  date: '2026-01-25',
  width: 4000,
  height: 2667,
  featured: true,  // ← Shows on home page
  price: 55,
  licensingAvailable: true,
}
```

### Step 3: Refresh
- Go to http://localhost:3000
- Your new photo appears on home page instantly!

---

## ❌ Troubleshooting

### Photo Doesn't Appear
**Check:**
1. Image file exists in `public/images/my-photo.jpg`
2. File name matches exactly in `imageUrl`
3. No typos in `imageUrl` path
4. Browser cache cleared (Ctrl+Shift+Delete)

### "Placeholder Shows Instead"
**Reason:** Image file missing or wrong filename
**Fix:** Add the image file to `public/images/` folder

### Gallery Filter Not Working
**Check:**
1. Category name is valid (see list above)
2. At least one photo has that category
3. Server restarted after `photos.ts` change

---

## 🔄 Batch Update Example

To update all 6 photos at once:

```typescript
export const SAMPLE_PHOTOS: Photo[] = [
  {
    id: '1',
    title: 'Sunrise Over Mountains',
    description: 'Golden hour lighting on alpine peaks',
    imageUrl: '/images/sunrise.jpg',
    category: 'landscape',
    featured: true,
    price: 49,
    // ... rest of data
  },
  // ... 5 more photos
];
```

---

## ✅ You're All Set!

1. **Add photos to:** `public/images/`
2. **Update data in:** `src/lib/photos.ts`
3. **Refresh at:** http://localhost:3000
4. **Photos appear instantly!**

---

**Questions?** See [DEVELOPMENT.md](DEVELOPMENT.md) for more help.
