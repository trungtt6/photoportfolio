describe('getInstagramFeed', () => {
    const originalEnv = process.env;
    let originalFetch: typeof global.fetch;
    let getInstagramFeed: typeof import('@/lib/instagram').getInstagramFeed;

    beforeAll(() => {
        originalFetch = global.fetch;
    });

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
        // Clean and prepare mock fetch
        global.fetch = jest.fn();

        // Dynamically load feed function for clean module state cache
        const instagramModule = require('@/lib/instagram');
        getInstagramFeed = instagramModule.getInstagramFeed;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        process.env = originalEnv;
        global.fetch = originalFetch;
    });

    it('returns mock data when credentials are missing', async () => {
        delete process.env.INSTAGRAM_USER_ID;
        delete process.env.INSTAGRAM_ACCESS_TOKEN;

        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        const feed = await getInstagramFeed();
        expect(feed).toBeDefined();
        expect(feed.length).toBeGreaterThan(0);
        expect(feed[0].id).toContain('mock-');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Instagram credentials not found')
        );

        consoleWarnSpy.mockRestore();
    });

    it('fetches from API when credentials are provided', async () => {
        process.env.INSTAGRAM_USER_ID = 'test-user-id';
        process.env.INSTAGRAM_ACCESS_TOKEN = 'test-access-token';

        const mockApiResponse = {
            data: [
                {
                    id: 'api-1',
                    media_url: 'https://example.com/image.jpg',
                    permalink: 'https://instagram.com/p/api-1',
                    caption: 'Beautiful photo!',
                    media_type: 'IMAGE',
                    timestamp: new Date().toISOString()
                }
            ]
        };

        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => mockApiResponse,
        } as Response);

        const feed = await getInstagramFeed();
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('https://graph.instagram.com/test-user-id/media')
        );
        expect(feed).toEqual(mockApiResponse.data);
    });

    it('falls back to mock data if API response is not ok', async () => {
        process.env.INSTAGRAM_USER_ID = 'test-user-id';
        process.env.INSTAGRAM_ACCESS_TOKEN = 'test-access-token';

        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValue({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            json: async () => ({ error: { message: 'OAuthException' } })
        } as Response);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const feed = await getInstagramFeed();
        expect(mockFetch).toHaveBeenCalled();
        // Should fall back to mock photos
        expect(feed).toBeDefined();
        expect(feed[0].id).toContain('mock-');
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    it('falls back to mock data on fetch network failure', async () => {
        process.env.INSTAGRAM_USER_ID = 'test-user-id';
        process.env.INSTAGRAM_ACCESS_TOKEN = 'test-access-token';

        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockRejectedValue(new Error('Network error'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const feed = await getInstagramFeed();
        expect(mockFetch).toHaveBeenCalled();
        expect(feed).toBeDefined();
        expect(feed[0].id).toContain('mock-');
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
