'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Photo } from '@/types';

interface LightboxProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ photo, isOpen, onClose }: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Photo Container */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Full Size Image */}
        <div className="relative max-w-full max-h-full">
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            width={photo.width}
            height={photo.height}
            className="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] object-contain"
            priority
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>

        {/* Photo Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">{photo.title}</h2>
            <p className="text-gray-200 mb-4">{photo.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-400">Category:</span>
                <span className="ml-2 text-white">{photo.category}</span>
              </div>
              <div>
                <span className="text-gray-400">Size:</span>
                <span className="ml-2 text-white">{photo.width} × {photo.height}px</span>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="ml-2 text-white">{photo.date}</span>
              </div>
            </div>

            {/* Tags */}
            {photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {photo.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Pricing and Licensing */}
            <div className="flex items-center gap-6 mt-6">
              <div className="text-xl font-bold text-blue-400">
                From ${photo.price}
              </div>
              {photo.licensingAvailable && (
                <span className="text-xs bg-green-600/30 text-green-400 px-3 py-1 rounded-full">
                  License Available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Hints */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        Press ESC to close • Click outside to close
      </div>
    </div>
  );
}
