/**
 * Instagram Service
 * 
 * This service handles fetching your latest Instagram media using the Instagram Graph API.
 * It requires INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN in .env.local.
 */

export interface InstagramMedia {
  id: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp: string;
}

// Simple in-memory cache for the Instagram feed
let cachedFeed: InstagramMedia[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function getInstagramFeed(): Promise<InstagramMedia[]> {
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  // Use dummy data if credentials are not configured
  if (!userId || !accessToken) {
    console.warn('Instagram credentials not found. Returning mock data.');
    return getMockInstagramData();
  }

  // Check cache
  const now = Date.now();
  if (cachedFeed && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedFeed;
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,media_url,permalink,thumbnail_url,caption,media_type,timestamp&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Instagram API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    cachedFeed = data.data as InstagramMedia[];
    lastFetchTime = now;

    return cachedFeed;
  } catch (error) {
    console.error('Failed to fetch Instagram feed:', error);
    // Return mock data as fallback if API call fails
    return getMockInstagramData();
  }
}

/**
 * Provides high-quality mock data for development when credentials are missing.
 */
function getMockInstagramData(): InstagramMedia[] {
  return [
    {
      id: 'mock-1',
      media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      permalink: 'https://instagram.com',
      caption: 'Mountain peak at sunrise. #photography #landscape',
      media_type: 'IMAGE',
      timestamp: new Date().toISOString()
    },
    {
      id: 'mock-2',
      media_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&q=80',
      permalink: 'https://instagram.com',
      caption: 'Wildlife in the deep forest. #wildlife #nature',
      media_type: 'IMAGE',
      timestamp: new Date().toISOString()
    },
    {
      id: 'mock-3',
      media_url: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c1e?w=800&q=80',
      permalink: 'https://instagram.com',
      caption: 'Calm lake reflection. #vibe #serenity',
      media_type: 'IMAGE',
      timestamp: new Date().toISOString()
    },
    {
      id: 'mock-4',
      media_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      permalink: 'https://instagram.com',
      caption: 'Ancient trees. #forest #oldgrowth',
      media_type: 'IMAGE',
      timestamp: new Date().toISOString()
    },
    {
      id: 'mock-5',
      media_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
      permalink: 'https://instagram.com',
      caption: 'Sunset over the valley.',
      media_type: 'IMAGE',
      timestamp: new Date().toISOString()
    },
    {
      id: 'mock-6',
      media_url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
      permalink: 'https://instagram.com',
      caption: 'Through the lens. #photoportfolio',
      media_type: 'IMAGE',
      timestamp: new Date().toISOString()
    }
  ];
}
