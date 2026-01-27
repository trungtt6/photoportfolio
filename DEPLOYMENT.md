# Vercel Deployment Checklist

## ✅ Pre-deployment Steps

### 1. Environment Variables
Add these to Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=your_mongodb_connection_string

# Google Drive OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# Service Account (backup option)
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_service_account_private_key
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

### 2. Build Configuration
- ✅ Next.js app is ready
- ✅ Prisma client generation in build script
- ✅ Google Drive integration configured
- ✅ File size restrictions removed

## 🚀 Deployment Steps

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** or import from GitHub
3. **Go to Settings → Environment Variables**
4. **Add all environment variables** above
5. **Go to Deployments**
6. **Click "Redeploy"** or push new commit to trigger deployment

## 📋 Post-deployment Checks

- [ ] Gallery loads and shows images from Google Drive
- [ ] Admin panel works
- [ ] Photo upload works (test with a small image first)
- [ ] Images display with "© TrungTT" watermark
- [ ] No 404 errors for images

## 🔧 Troubleshooting

If images don't show:
1. Check environment variables in Vercel
2. Check Vercel function logs
3. Ensure Google Drive folder is shared correctly
4. Verify refresh token is valid

## 📝 Notes

- The app now uses Google Drive for all image storage
- No file size limits (Google Drive handles large files)
- Images are served directly from Google Drive
- Watermark shows "© TrungTT" in handwriting font
