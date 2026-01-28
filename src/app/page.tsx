import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import Testimonials from '@/components/Testimonials';
import prisma from '@/lib/prisma';
import { Photo } from '@/types';

export default async function Home() {
  let photos: Photo[] = [];
  
  try {
    const dbPhotos = await prisma.photo.findMany({
      where: { visible: true },
      orderBy: { uploadedAt: 'desc' },
    });

    // Transform database photos to match Photo interface
    photos = dbPhotos.map((p: any) => ({
      id: p.photoId,
      title: p.title,
      description: p.description || '',
      imageUrl: `/api/image/${p.photoId}`,
      thumbnailUrl: `/api/image/${p.photoId}?size=thumb`,
      category: p.category || 'landscape',
      tags: p.tags || [],
      date: p.uploadedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      width: p.width || 3200,
      height: p.height || 2400,
      featured: p.featured,
      price: p.price,
      licensingAvailable: p.licensingAvailable,
    }));
  } catch (err) {
    console.warn('Could not load photos from database');
  }

  const featuredPhotos = photos.filter((photo) => photo.featured);

  return (
    <div className="bg-gray-950">
      {/* Hero Slider */}
      <HeroSlider photos={featuredPhotos} />

      {/* Featured Photos Section */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <span className="text-blue-400 font-semibold tracking-widest text-sm uppercase">Gallery Showcase</span>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 mt-2">Featured Work</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Each image showcases watermarked versions to protect my work. 
              Purchase originals and commercial licenses available.
            </p>
          </div>

          {featuredPhotos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {featuredPhotos.map((photo) => (
                  <Link key={photo.id} href="/gallery">
                    <div className="group bg-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-blue-500 transition transform hover:scale-105 h-full flex flex-col shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
                      {/* Image */}
                      <div className="relative overflow-hidden bg-gray-800 aspect-square">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        
                        {/* Badge */}
                        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-full">
                          {photo.category}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                          {photo.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-2">
                          {photo.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <span className="text-lg font-bold text-blue-400">From ${photo.price}</span>
                          <span className="text-white group-hover:text-blue-400 transition">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/gallery"
                  className="inline-block px-8 py-4 bg-gray-900 border-2 border-blue-600 hover:bg-blue-600 text-white font-bold rounded-lg transition text-lg"
                >
                  View All {photos.length} Photos →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-gray-400 text-xl">No featured photos yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <span className="text-blue-400 font-semibold tracking-widest text-sm uppercase">What I Offer</span>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 mt-2">Services & Products</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Fine Art Prints', description: 'High-quality museum-grade prints on premium paper. Perfect for home or office.' },
              { title: 'Digital Downloads', description: 'High-resolution digital files with commercial usage rights available.' },
              { title: 'Commercial License', description: 'Editorial, advertising, and corporate usage rights. Custom pricing available.' }
            ].map((service, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition">
                <div className="text-4xl mb-4">
                  {i === 0 ? '🖼️' : i === 1 ? '💾' : '🏢'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse my portfolio, find the perfect image, or discuss your project needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/gallery"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Browse Gallery
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold rounded-lg transition"
            >
              Send Message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
