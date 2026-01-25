# Google Drive Deployment Checklist

## ✅ Completed
- Switched upload route to Google Drive version
- Updated image URLs to use storagePath from database
- Added googleapis to package.json

## 🔄 To Deploy Google Drive Storage

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Google Drive (5 minutes)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Google Drive API"
4. Create Service Account:
   - Name: `photo-portfolio-uploader`
   - Download JSON key
5. Create Google Drive folder:
   - Name: "Photo Portfolio Uploads"
   - Share with service account email (Editor role)
6. Copy folder ID from URL

### 3. Add Vercel Environment Variables
Go to Vercel → Settings → Environment Variables:
```
GOOGLE_CLIENT_EMAIL=photo-portfolio-uploader@YOUR_PROJECT_ID.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=YOUR_FOLDER_ID
```

### 4. Deploy
```bash
git add -A
git commit -m "Switch to Google Drive storage"
git push
```

## 🎉 Benefits After Setup
- ✅ Database online (MongoDB Atlas)
- ✅ Files online (Google Drive)
- ✅ No size limitations
- ✅ Automatic backups
- ✅ Works perfectly with Vercel

## 📝 Notes
- Current upload saves metadata only (works now)
- After Google Drive setup, full uploads work
- Old photos in public/storage still work
- New photos will use Google Drive URLs
