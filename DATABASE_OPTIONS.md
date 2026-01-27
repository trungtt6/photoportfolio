# Database Configuration Options

## Option 1: MongoDB Atlas (Current)
- Update Network Access in MongoDB Atlas
- Add IP: 0.0.0.0/0
- Update Vercel env var with correct DATABASE_URL

## Option 2: Vercel Postgres (Recommended for Vercel)
1. In Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Update DATABASE_URL in Vercel env vars
4. Update prisma/schema.prisma:
   provider = "postgresql"

## Option 3: Deploy without Database
- Site will work but gallery will be empty
- Can add database later
