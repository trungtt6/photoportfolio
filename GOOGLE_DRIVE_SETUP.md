# Google Drive Integration Setup

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Name: `photo-portfolio-uploader`
4. Click "Create and Continue"
5. Skip granting permissions (we'll set folder sharing)
6. Click "Done"

## Step 3: Create JSON Key

1. Find your service account in the list
2. Click the three dots → "Manage keys"
3. Click "Add Key" → "Create new key"
4. Select "JSON"
5. Download the key file (keep it secure!)

## Step 4: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder: "Photo Portfolio Uploads"
3. Right-click the folder → "Share"
4. Add the service account email:
   - Email: `photo-portfolio-uploader@YOUR_PROJECT_ID.iam.gserviceaccount.com`
   - Role: "Editor"
5. Copy the folder ID from URL:
   - URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy `FOLDER_ID_HERE`

## Step 5: Add Environment Variables to Vercel

Go to your Vercel project → Settings → Environment Variables and add:

```
GOOGLE_CLIENT_EMAIL=photo-portfolio-uploader@YOUR_PROJECT_ID.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=FOLDER_ID_HERE
```

Note: Replace the private key with the entire key from the JSON file, replacing `\n` with actual new lines.

## Step 6: Update Upload Route

Replace the current upload route with the Google Drive version:

```bash
mv src/app/api/admin/photos/upload/route.ts src/app/api/admin/photos/upload/route-backup.ts
mv src/app/api/admin/photos/upload/route-google-drive.ts src/app/api/admin/photos/upload/route.ts
```

## Benefits of Google Drive Storage

✅ Unlimited storage (15GB free, then $1.99/100GB)
✅ No file size limitations
✅ Built-in CDN capabilities
✅ Easy to manage files
✅ Automatic backups
✅ Public URL generation
✅ Works perfectly with Vercel

## Usage

1. Upload photos through admin panel
2. Images are stored in Google Drive
3. Public URLs are generated automatically
4. Photos appear in your gallery

## Security Notes

- Keep your private key secure!
- The folder should be shared only with the service account
- Consider setting up additional permissions if needed
