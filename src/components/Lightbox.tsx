'use client';
import StructuredData from "./StructuredData";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Photo } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { LICENSE_TIERS } from '@/lib/photos';

interface LightboxProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ photo, isOpen, onClose }: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState(LICENSE_TIERS[0]);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
      setIsAdded(false); // Reset added state when opened
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    addToCart(photo, selectedLicense.name, photo.price + selectedLicense.price);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

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
            className="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-16rem)] object-contain"
            priority
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Photo Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/70 p-6 max-h-[40vh] overflow-y-auto">
          <div className="text-white max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <StructuredData photo={photo} />
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
              </div>
            </div>

            {/* E-commerce Actions */}
            {photo.licensingAvailable && (
              <div className="flex-1 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <h3 className="font-bold text-lg mb-3">Purchase License</h3>
                <select
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedLicense.id}
                  onChange={(e) => setSelectedLicense(LICENSE_TIERS.find(t => t.id === e.target.value) || LICENSE_TIERS[0])}
                >
                  {LICENSE_TIERS.map(tier => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name} (+${tier.price})
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-400">
                    ${(photo.price + selectedLicense.price).toFixed(2)}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${
                      isAdded ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isAdded ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
