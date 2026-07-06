'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Photo } from '@/types';

export interface CartItem {
  id: string; // unique cart item id
  photo: Photo;
  licenseTier: string;
  price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (photo: Photo, licenseTier: string, price: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('photo-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('photo-cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (photo: Photo, licenseTier: string, price: number) => {
    setCart((prev) => [
      ...prev,
      { id: `${photo.id}-${licenseTier}-${Date.now()}`, photo, licenseTier, price },
    ]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
