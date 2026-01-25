# MongoDB Atlas Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Free MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign Up"
3. Create account with email (or use Google)

### Step 2: Create a Free Cluster
1. After signing in, click "Create"
2. Select **M0 (Free)** tier
3. Choose your region (closest to you)
4. Click "Create Cluster"
5. Wait 2-3 minutes for deployment

### Step 3: Get Connection String
1. Click "Connect"
2. Click "Drivers"
3. Select "Node.js" and version "4.0 or higher"
4. Copy the connection string
5. Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### Step 4: Add Connection String
1. Open `.env.local` file in project root
2. Replace the `DATABASE_URL` with your connection string:
   ```
   DATABASE_URL="mongodb+srv://youruser:yourpass@yourcluster.mongodb.net/photo-portfolio?retryWrites=true&w=majority"
   ```

### Step 5: Add Network Access
In MongoDB Atlas:
1. Go to "Network Access"
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (allows connections from anywhere)
4. ✅ Done!

### Step 6: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Username and Password" auth
4. Create username and password
5. Copy to `.env.local`

## ⚠️ Important

- **NEVER** commit `.env.local` to Git (it's in `.gitignore`)
- Keep your connection string SECRET
- On Vercel/Netlify, add `DATABASE_URL` as environment variable in project settings

## ✅ Test Connection

Once configured, the app will:
1. Connect to MongoDB automatically
2. Create `photos` collection
3. You can manage photos via admin panel

## 🆘 Troubleshooting

**"connection refused"?**
- Check IP address is added (0.0.0.0/0)
- Verify DATABASE_URL in .env.local

**"authentication failed"?**
- Verify username/password in connection string
- Make sure database user exists in "Database Access"

**Still not working?**
- Delete `.env.local` and try again
- Restart dev server after updating `.env.local`
