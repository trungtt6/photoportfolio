const { google } = require('googleapis');
const readline = require('readline');

// Load credentials from .env.local
require('dotenv').config({ path: '.env.local' });

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAccessToken() {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'],
    prompt: 'consent'
  });

  console.log('\n=== Google Drive Authorization ===\n');
  console.log('1. Open this URL in your browser:\n');
  console.log(url);
  console.log('\n2. Accept the permissions');
  console.log('3. Copy the authorization code from the URL\n');

  rl.question('4. Paste the authorization code here: ', (code) => {
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token:', err);
        return;
      }

      console.log('\n✅ Success! Add this to your .env.local file:\n');
      console.log('GOOGLE_REFRESH_TOKEN=' + token.refresh_token);
      console.log('\nAlso make sure you have:');
      console.log('GOOGLE_CLIENT_ID=' + process.env.GOOGLE_CLIENT_ID);
      console.log('GOOGLE_CLIENT_SECRET=' + process.env.GOOGLE_CLIENT_SECRET);
      console.log('GOOGLE_REDIRECT_URI=' + process.env.GOOGLE_REDIRECT_URI);
      
      rl.close();
    });
  });
}

getAccessToken();
