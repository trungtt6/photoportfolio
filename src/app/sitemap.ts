import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Fetch all photos for dynamic routes
  let photoUrls: MetadataRoute.Sitemap = [];
  try {
    const photos = await prisma.photo.findMany({
      where: { visible: true },
      select: { photoId: true, updatedAt: true },
    });

    photoUrls = photos.map((photo) => ({
      url: `${baseUrl}/gallery/${photo.photoId}`,
      lastModified: photo.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap photo fetch error:', error);
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  return [...staticRoutes, ...photoUrls];
}
