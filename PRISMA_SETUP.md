# Prisma + MongoDB Setup Complete! 🎉

## ✅ What's Been Set Up

1. **Prisma ORM** - Type-safe database queries
2. **MongoDB Atlas** - Free cloud database (512MB tier)
3. **Photo Model** - Database schema for managing photos
4. **API Endpoints** - CRUD operations for photos
5. **Migration Script** - Auto-import existing photos

## 🚀 Next Steps (3 steps to go live!)

### Step 1️⃣: Create MongoDB Atlas Account
**Time: 5 minutes**

See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed instructions

**Quick version:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster (M0 free tier)
4. Get connection string
5. Add to `.env.local`

### Step 2️⃣: Update `.env.local`

Open `.env.local` and replace with your MongoDB connection string:

```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/photo-portfolio?retryWrites=true&w=majority"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Save the file!**

### Step 3️⃣: Test Connection & Migrate Photos

Restart dev server (Ctrl+C and npm run dev), then migration happens automatically on first API call.

## 📊 Database Schema

```
Photo Collection:
├─ id (ObjectId)
├─ photoId (unique ID)
├─ filename (e.g., mountain.jpg)
├─ storagePath
├─ title
├─ description
├─ category (landscape, portrait, wildlife, etc)
├─ tags (array)
├─ featured (boolean)
├─ visible (boolean)
├─ price (number)
├─ licensingAvailable (boolean)
├─ width/height
├─ dateTaken (when photo was taken)
├─ location (where photo was taken)
├─ uploadedAt (when uploaded)
└─ notes (admin notes)
```

## 🎯 API Endpoints

### Get All Photos
```
GET /api/photos
Query params:
  - featured=true (only featured)
  - category=landscape (filter by category)
  - visible=true (default)
```

### Get All Photos (Admin)
```
GET /api/admin/photos/list
```

### Get Specific Photo
```
GET /api/admin/photos/{photoId}
```

### Update Photo
```
PUT /api/admin/photos/{photoId}
Body: { title, description, category, tags, featured, price, location, dateTaken, ... }
```

### Delete Photo
```
DELETE /api/admin/photos/{photoId}
```

## 💾 How It Works

1. **First time**: When `/api/photos` is called, it tries database. If empty, reads from `storage/processed/`
2. **After migration**: Photos stored in MongoDB, filesystem is backup only
3. **Admin uploads**: New photos saved to storage AND database record created
4. **Vercel/Netlify**: Only needs `DATABASE_URL` env variable

## 🔑 Environment Variables

### Local Development
- Create `.env.local` with `DATABASE_URL`

### Vercel Deployment
1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL` with your MongoDB connection string
3. Deploy!

### Netlify Deployment
1. Go to Site Settings → Build & Deploy → Environment
2. Add `DATABASE_URL`
3. Deploy!

## ✨ Features Now Available

✅ **Photo Management**
- Add/edit/delete photos via API
- Set featured, visible, category
- Add location and date taken
- Price management

✅ **Flexible Queries**
- Filter by featured, category, visible
- Sort by upload date
- Full search capability

✅ **Scalable**
- Start with free MongoDB tier
- Upgrade anytime (no code changes!)
- Easy migration to PostgreSQL if needed

✅ **Production Ready**
- Type-safe queries (Prisma)
- Connection pooling
- Error handling

## 🆘 Troubleshooting

### "Cannot connect to database"
- Check `.env.local` has correct DATABASE_URL
- Restart dev server after changing `.env.local`
- Verify MongoDB Atlas IP whitelist (should be 0.0.0.0/0)

### "Photos not showing"
- Check if photos exist in `storage/processed/`
- API falls back to filesystem if database unavailable
- Check browser console for errors

### "Migration not working"
- Database must be connected first
- First API call triggers auto-import from filesystem
- Or manually run: `npx ts-node scripts/migrate-photos.ts`

## 📚 Next: Admin Dashboard

Once database is working, we can create:
- ✨ Admin dashboard to manage photos
- 📝 Edit photo properties in UI
- 🖼️ Upload handler that saves to database
- 📊 Admin analytics

## 🎓 Learn More

- [Prisma Docs](https://www.prisma.io/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Ready?** First, set up MongoDB Atlas following [MONGODB_SETUP.md](MONGODB_SETUP.md) 🚀
