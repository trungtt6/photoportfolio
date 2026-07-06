'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wider hover:text-gray-300 transition">
          Trungtt Photography
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="hover:text-gray-300 transition">
            Home
          </Link>
          <Link href="/gallery" className="hover:text-gray-300 transition">
            Gallery
          </Link>
          <Link href="/blog" className="hover:text-gray-300 transition">
            Blog
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition">
            Contact
          </Link>
          <Link href="/checkout" className="relative hover:text-gray-300 transition">
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Menu & Theme */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/checkout" className="relative hover:text-gray-300 transition">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            className="flex flex-col gap-1.5 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 px-4 py-4 space-y-3 border-t border-gray-800">
          <Link
            href="/"
            className="block py-2 hover:text-gray-300 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/gallery"
            className="block py-2 hover:text-gray-300 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            href="/blog"
            className="block py-2 hover:text-gray-300 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="block py-2 hover:text-gray-300 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block py-2 hover:text-gray-300 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/checkout"
            className="block py-2 hover:text-gray-300 transition font-bold text-blue-400"
            onClick={() => setIsMenuOpen(false)}
          >
            View Cart ({cart.length})
          </Link>
        </div>
      )}
    </header>
  );
}
