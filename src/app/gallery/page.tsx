'use client';

import { useState, useEffect } from 'react';
import GalleryCard from '@/components/GalleryCard';
import { PHOTO_CATEGORIES } from '@/lib/photos';
import type { Photo, PhotoCategory } from '@/types';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    async function loadPhotos() {
      try {
        // Call API to get photos instead of client-side getPhotos()
        const response = await fetch('/api/photos');
        if (response.ok) {
          const loadedPhotos = await response.json();
          setPhotos(loadedPhotos);
        } else {
          setPhotos([]);
        }
      } catch (err) {
        console.warn('Could not load photos', err);
        setPhotos([]);
      }
    }
    loadPhotos();
  }, []);

  // Filter photos
  let filteredPhotos: Photo[] = photos;

  if (selectedCategory !== 'all') {
    filteredPhotos = filteredPhotos.filter((photo) => photo.category === selectedCategory);
  }

  if (searchTerm) {
    filteredPhotos = filteredPhotos.filter(
      (photo) =>
        photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Photo Gallery</h1>
          <p className="text-gray-400">Browse my complete collection of photographs</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-900 border-b border-gray-800 py-8 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Photos
            </button>
            {Object.entries(PHOTO_CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as PhotoCategory)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {filteredPhotos.length > 0 ? (
            <>
              <p className="text-gray-400 mb-8">
                Showing {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => (
                  <GalleryCard key={photo.id} photo={photo} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No photos found matching your criteria</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <section className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">About These Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-2">🖼️ Fine Art Prints</h3>
              <p className="text-gray-400">
                All photos available as premium prints on canvas, metal, or fine art paper.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">💾 Digital Downloads</h3>
              <p className="text-gray-400">
                Purchase high-resolution files for web use, printing, or commercial projects.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">📜 Licensing</h3>
              <p className="text-gray-400">
                Commercial and exclusive licenses available for business use.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
