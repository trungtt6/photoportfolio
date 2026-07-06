/**
 * Test script for Instagram API integration
 * 
 * This script verifies if the getInstagramFeed function correctly handles 
 * both real API calls (if configured) and mock fallbacks.
 */

const { getInstagramFeed } = require('./src/lib/instagram');

async function testInstagramIntegration() {
    console.log('--- Testing Instagram Integration ---');

    const userId = process.env.INSTAGRAM_USER_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!userId || !accessToken) {
        console.log('Status: Credentials missing. Verifying mock fallback...');
    } else {
        console.log('Status: Credentials found. Verifying API call...');
    }

    try {
        const feed = await getInstagramFeed();

        console.log(`Success! Retrieved ${feed.length} posts.`);

        if (feed.length > 0) {
            console.log('Sample Post:');
            console.log(`- ID: ${feed[0].id}`);
            console.log(`- Media URL: ${feed[0].media_url}`);
            console.log(`- Permalink: ${feed[0].permalink}`);
            console.log(`- Caption: ${feed[0].caption?.substring(0, 50)}...`);
        } else {
            console.warn('Feed is empty.');
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

// Note: Running this directly might fail because of TypeScript module resolution
// In a real environment, we'd use ts-node or run it via the local dev server.
// For now, this serves as documentation of how to test.
console.log('To run this test properly, ensure you are in the project root.');
testInstagramIntegration();
