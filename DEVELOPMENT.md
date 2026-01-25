# Local Development Guide

## Current Status

✅ **Development Server Running**
- **URL:** http://localhost:3000
- **Port:** 3000
- **Hot Reload:** Enabled (changes auto-reload)

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run ESLint checks
npm run lint

# Install new dependencies
npm install <package-name>
```

## Development Tips

### File Structure
All source code is in `src/` folder:
- `src/app/` - Pages and routing
- `src/components/` - Reusable components
- `src/lib/` - Utilities and data
- `src/types/` - TypeScript interfaces
- `src/styles/` - Global CSS

### Making Changes

1. **Edit a file** - e.g., `src/app/page.tsx`
2. **Save** - Ctrl+S
3. **See changes** - Automatically hot-reloads in browser
4. **Check console** - F12 to see any errors

### Adding New Photos

Edit `src/lib/photos.ts`:
```typescript
{
  id: '7',
  title: 'Photo Title',
  description: 'Description here',
  imageUrl: '/images/photo-name.jpg',
  thumbnailUrl: '/images/photo-name-thumb.jpg',
  category: 'landscape',
  tags: ['tag1', 'tag2'],
  date: '2025-01-25',
  width: 4000,
  height: 2667,
  featured: true,
  price: 50,
  licensingAvailable: true,
}
```

### Customizing Colors

Edit `tailwind.config.ts`:
```typescript
theme: {
  colors: {
    primary: '#your-color',
    // etc
  }
}
```

### Adding Pages

Create new file in `src/app/`:
- `src/app/new-page/page.tsx` creates `/new-page` route
- `src/app/new-page/another/page.tsx` creates `/new-page/another` route

## Environment Variables

Create `.env.local` file in project root:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Photo Portfolio
```

Variables starting with `NEXT_PUBLIC_` are available in browser.

## Debugging

### Console Errors
1. Open DevTools (F12)
2. Check Console tab (red X icons show errors)
3. Click error to see which file/line

### Network Issues
1. DevTools > Network tab
2. Reload page
3. Check for failed requests (red X)

### TypeScript Errors
1. Terminal shows TypeScript errors
2. Fix in editor - they'll auto-compile
3. Page reloads when fixed

## Personalization Setup

### Step 1: Configure Personal Information

**Required files to update:**

#### 1. About Page (`src/app/about/page.tsx`)
```typescript
// Update your bio (lines 24-36)
<p className="text-gray-400 mb-4 leading-relaxed">
  With over [X] years of professional photography experience...
</p>

// Update equipment list (lines 66-87)
<li>• [Your Camera Model]</li>
<li>• [Your Lens Model]</li>

// Update achievements (lines 100-103)
{ number: '[Your Number]', label: 'Photos Sold' },

// Update social media links (lines 39-50)
<a href="[Your Instagram URL]" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
  Instagram
</a>
```

#### 2. Header Logo (`src/components/Header.tsx`)
```typescript
// Update brand name (lines 13-15)
<Link href="/" className="text-2xl font-bold tracking-wider hover:text-gray-300 transition">
  [Your Brand Name]
</Link>
```

#### 3. Footer (`src/components/Footer.tsx`)
```typescript
// Update brand info (lines 12-15)
<h3 className="text-white font-bold mb-4">[Your Brand Name]</h3>
<p className="text-sm text-gray-500">
  [Your brand description]
</p>

// Update copyright (lines 87-92)
&copy; {currentYear} [Your Name/Brand]. All rights reserved.

// Update social media URLs (lines 67-79)
<a href="[Your Facebook URL]" className="hover:text-white transition">Facebook</a>
<a href="[Your Instagram URL]" className="hover:text-white transition">Instagram</a>
<a href="[Your 500px URL]" className="hover:text-white transition">500px</a>
```

#### 4. Site Metadata (`src/app/layout.tsx`)
```typescript
// Update site information (lines 17-43)
title: '[Your Site Name] | Professional Photography'
description: '[Your site description]'
authors: [{ name: '[Your Name]' }]
```

### Step 2: Configure Contact Information

#### Email Setup (Optional)
Update `.env.local` file:
```env
# Contact form email settings
EMAIL_FROM=your-email@domain.com
EMAIL_TO=your-email@domain.com
NEXT_PUBLIC_EMAIL_SERVICE=sendgrid  # or nodemailer
SENDGRID_API_KEY=your_api_key_here  # if using SendGrid
```

#### Contact Page Updates
Edit `src/app/contact/page.tsx` to update:
- Your email address
- Phone number
- Physical address (if applicable)
- Business hours

### Step 3: Add Your Photos

#### Method 1: Admin Dashboard (Recommended)
1. Visit `http://localhost:3000/admin`
2. Use photo upload interface
3. Photos automatically processed with watermark

#### Method 2: Manual Upload
1. Add photos to `storage/originals/` folder
2. Run processing script
3. Update database via admin panel

### Step 4: Test Personalization

**Checklist:**
- [ ] Your name appears in footer copyright
- [ ] Your brand name shows in header
- [ ] About page shows your bio and equipment
- [ ] Social media links work
- [ ] Contact form sends to your email
- [ ] Your photos display in gallery

## Testing Process

See [TESTING.md](TESTING.md) for complete testing checklist.

**Quick test:**
1. [ ] Home page loads
2. [ ] Gallery shows photos
3. [ ] Filters work
4. [ ] Contact form submits
5. [ ] Mobile menu works
6. [ ] No console errors
7. [ ] Personal information displays correctly

## Common Issues

### Port 3000 Already in Use
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with number from above)
taskkill /PID <PID> /F

# Restart dev server
npm run dev
```

### Node Modules Issues
```bash
# Clear cache and reinstall
npm ci --legacy-peer-deps

# Or if that fails
rm -r node_modules
npm install
```

### TypeScript Errors
```bash
# Check tsconfig.json is valid
npm run lint
```

## Performance Tips

- Use Next.js Image component for images
- Lazy load components with `dynamic()`
- Check Lighthouse scores (Chrome DevTools)

## Next Steps

1. ✅ Test all pages (see [TESTING.md](TESTING.md))
2. ✅ Verify forms work
3. ✅ Check mobile responsiveness
4. ✅ Fix any issues
5. ✅ Deploy to Vercel

---

**Questions?** Check:
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
