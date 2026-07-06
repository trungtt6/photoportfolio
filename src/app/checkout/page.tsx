'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API call to Stripe/payment gateway
    setTimeout(() => {
      setIsCheckingOut(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-800">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase. We have sent the high-resolution files and licensing documentation to your email.
          </p>
          <Link href="/gallery" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-lg mb-6">Your cart is empty.</p>
            <Link href="/gallery" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Browse Photos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex gap-4 items-center">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.photo.imageUrl} alt={item.photo.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg truncate">{item.photo.title}</h3>
                    <p className="text-gray-400 text-sm">{item.licenseTier}</p>
                    <div className="text-blue-400 font-bold mt-1">${item.price.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3 mt-3 flex justify-between text-white font-bold text-xl">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>

                <p className="text-gray-500 text-xs text-center mt-4 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Secure encrypted payment
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
