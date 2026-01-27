import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Return the tokens as HTML for easy copying
    const html = `
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #4CAF50; }
            .token { background: #f0f0f0; padding: 15px; border-radius: 4px; word-break: break-all; margin: 20px 0; }
            button { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Authorization Successful!</h1>
            <p>Add this refresh token to your .env.local file:</p>
            <div class="token">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</div>
            <button onclick="navigator.clipboard.writeText('GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}')">Copy to Clipboard</button>
            <p style="margin-top: 30px;">You can close this window and restart your server.</p>
          </div>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.json({ error: 'Failed to get tokens' }, { status: 500 });
  }
}
