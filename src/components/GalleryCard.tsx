import { Photo } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from './Lightbox';

interface GalleryCardProps {
  photo: Photo;
}

export default function GalleryCard({ photo }: GalleryCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLightboxOpen(true);
  };

  return (
    <>
      <Link href={`/gallery/${photo.id}`}>
        <div className="group bg-gray-900 rounded-lg overflow-hidden hover-lift h-full flex flex-col cursor-pointer border border-gray-800 hover:border-blue-500 transition">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-800 aspect-square">
          {/* Image */}
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            width={photo.width}
            height={photo.height}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500 cursor-pointer"
            loading="lazy"
            placeholder="blur"
            onClick={handleImageClick}
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>

          {/* Overlay Buttons */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
              View Details
            </button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs px-3 py-1 rounded">
            {photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}
          </div>

          {/* Featured Badge */}
          {photo.featured && (
            <div className="absolute top-3 left-3 bg-yellow-500/90 text-white text-xs px-3 py-1 rounded font-semibold">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition">
            {photo.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 flex-1 truncate-lines-2">{photo.description}</p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="text-lg font-bold text-blue-400">${photo.price}</div>
            {photo.licensingAvailable && (
              <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                License Available
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
      
      {/* Lightbox */}
      <Lightbox 
        photo={photo} 
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
      />
    </>
  );
}
