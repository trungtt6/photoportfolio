const https = require('https');

// Test the new thumbnail URL format
const testUrl = 'https://drive.google.com/thumbnail?id=1dBNE6WFkrggWo791RB3QXlj8VTtoGoKp&sz=w1920-h1080';

console.log('Testing thumbnail URL:', testUrl);

https.get(testUrl, (res) => {
  console.log('\nStatus Code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Content-Length:', res.headers['content-length']);
  
  if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 303) {
    console.log('Redirected to:', res.headers.location);
  }
  
  if (res.statusCode === 200) {
    console.log('✅ URL is accessible!');
  }
}).on('error', (err) => {
  console.error('❌ Error:', err.message);
});
