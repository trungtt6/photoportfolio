'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Photo } from '@/types';

export default function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const response = await fetch('/api/photos');
        if (response.ok) {
          const photos = await response.json();
          setAllPhotos(photos);
          
          // Find the photo with matching ID
          const found = photos.find((p: Photo) => p.id === decodeURIComponent(id));
          setPhoto(found || null);
        }
      } catch (err) {
        console.error('Error loading photos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPhotos();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Photo Not Found</h1>
          <Link href="/gallery" className="text-blue-400 hover:text-blue-300">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
  const nextPhoto = currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1] : null;
  const prevPhoto = currentIndex > 0 ? allPhotos[currentIndex - 1] : null;

  return (
    <div className="bg-gray-950 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Back Link */}
        <Link href="/gallery" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Gallery
        </Link>

        {/* Main Photo */}
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 mb-12">
          <div className="relative aspect-video">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2">
            <h1 className="text-5xl font-black text-white mb-4">{photo.title}</h1>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">About This Photo</h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">{photo.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Category</p>
                  <p className="text-white font-semibold text-lg capitalize">{photo.category}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Date</p>
                  <p className="text-white font-semibold text-lg">{photo.date}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Resolution</p>
                  <p className="text-white font-semibold text-lg">{photo.width} x {photo.height}px</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Featured</p>
                  <p className="text-white font-semibold text-lg">{photo.featured ? '⭐ Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {photo.tags && photo.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Purchase */}
          <div>
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl p-8 sticky top-24">
              <div className="text-white">
                <p className="text-gray-200 text-sm uppercase tracking-wide mb-2">Starting From</p>
                <h2 className="text-4xl font-black mb-6">${photo.price}</h2>

                {photo.licensingAvailable && (
                  <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <p className="text-sm text-white/80 mb-2">✓ Commercial License</p>
                    <p className="text-sm text-white/80">✓ High-Resolution Download</p>
                  </div>
                )}

                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition mb-3">
                  Purchase License
                </button>

                <Link
                  href="/contact"
                  className="w-full block text-center border-2 border-white text-white font-bold py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
                >
                  Custom Inquiry
                </Link>

                <p className="text-xs text-white/60 mt-4 text-center">
                  All photos include copyright protection and are watermarked.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {(prevPhoto || nextPhoto) && (
          <div className="mt-16 pt-12 border-t border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-8">More Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {prevPhoto && (
                <Link href={`/gallery/${prevPhoto.id}`} className="group">
                  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500 transition">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={prevPhoto.imageUrl}
                        alt={prevPhoto.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-gray-400 text-sm mb-1">← Previous</p>
                      <h4 className="text-white font-semibold group-hover:text-blue-400 transition">
                        {prevPhoto.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              )}
              {nextPhoto && (
                <Link href={`/gallery/${nextPhoto.id}`} className="group">
                  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500 transition">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={nextPhoto.imageUrl}
                        alt={nextPhoto.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-gray-400 text-sm mb-1">Next →</p>
                      <h4 className="text-white font-semibold group-hover:text-blue-400 transition">
                        {nextPhoto.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
