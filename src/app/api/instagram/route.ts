import { NextResponse } from 'next/server';
import { getInstagramFeed } from '@/lib/instagram';

export async function GET() {
    try {
        const feed = await getInstagramFeed();
        return NextResponse.json(feed);
    } catch (error) {
        console.error('API Error fetching Instagram feed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Instagram feed' },
            { status: 500 }
        );
    }
}
