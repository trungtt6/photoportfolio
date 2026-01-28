# Google Refresh Token Generation Guide

## Option 1: Using the Node.js Script (Recommended)

1. Edit `scripts/generate-refresh-token.js`
2. Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET`
3. Run: `node scripts/generate-refresh-token.js`
4. Follow the instructions

## Option 2: Manual Steps with curl

### Step 1: Get Authorization URL
Open this URL in browser (replace YOUR_CLIENT_ID):
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000&response_type=code&scope=https://www.googleapis.com/auth/drive.file&access_type=offline&prompt=consent
```

### Step 2: Get Authorization Code
After authorizing, you'll be redirected to:
```
http://localhost:3000?code=4/AABBCC... (copy this code)
```

### Step 3: Exchange for Refresh Token
Run this curl command (replace values):
```bash
curl -X POST "https://oauth2.googleapis.com/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE_FROM_STEP_2" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=http://localhost:3000"
```

### Step 4: Save the Refresh Token
The response will include:
```json
{
  "access_token": "...",
  "expires_in": 3599,
  "refresh_token": "1//...",
  "scope": "...",
  "token_type": "Bearer"
}
```

Copy the `refresh_token` value!

## Add to Vercel

Go to Vercel → Settings → Environment Variables and add:
```
GOOGLE_REFRESH_TOKEN=1//...
```

## Important Notes

- Use `prompt=consent` to force refresh token generation
- Use `access_type=offline` to get refresh token
- Store refresh token securely - it's long-lived!
- You only need to generate it once per application
