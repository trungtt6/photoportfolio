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

## Testing Process

See [TESTING.md](TESTING.md) for complete testing checklist.

**Quick test:**
1. [ ] Home page loads
2. [ ] Gallery shows photos
3. [ ] Filters work
4. [ ] Contact form submits
5. [ ] Mobile menu works
6. [ ] No console errors

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
