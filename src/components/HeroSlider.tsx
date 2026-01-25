'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/types';
import Link from 'next/link';

interface HeroSliderProps {
  photos: Photo[];
}

export default function HeroSlider({ photos }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay || photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, photos.length]);

  if (photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000); // Resume auto-play after 10 seconds
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % photos.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + photos.length) % photos.length);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Slides */}
      <div className="absolute inset-0 z-0">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="mb-4 inline-block">
          <span className="text-blue-400 font-semibold text-lg tracking-widest">PROFESSIONAL PHOTOGRAPHER</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white leading-tight drop-shadow-lg">
          TrungTT Photography
        </h1>

        <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Capturing stunning landscapes, nature, and architectural photography.
          Premium prints, digital downloads, and commercial licensing.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-8">
          <Link
            href="/gallery"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-xl text-lg"
          >
            Explore Gallery
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-lg transition text-lg"
          >
            Get In Touch
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentIndex ? 'bg-blue-500 w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-gray-300 text-sm animate-bounce">
        ↓ Scroll to see featured work
      </div>
    </section>
  );
}
