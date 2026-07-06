import { Photo } from '@/types';

interface StructuredDataProps {
  photo: Photo;
}

export default function StructuredData({ photo }: StructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Photograph',
    name: photo.title,
    description: photo.description || '',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}${photo.imageUrl}`,
    dateCreated: photo.date,
    author: {
      '@type': 'Person',
      name: 'Trungtt Photography',
    },
    offers: {
      '@type': 'Offer',
      price: photo.price,
      priceCurrency: 'USD',
      availability: photo.licensingAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
