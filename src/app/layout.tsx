import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/styles/globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geist_mono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Photo Portfolio | Professional Photography',
  description: 'Stunning photography portfolio showcasing landscape, nature, and architectural photos. Available prints and digital licenses.',
  keywords: 'photography, portfolio, fine art prints, photo licensing, professional photographer',
  authors: [{ name: 'Professional Photographer' }],
  openGraph: {
    type: 'website',
    url: 'https://yoursite.com',
    title: 'Photo Portfolio | Professional Photography',
    description: 'Stunning photography portfolio showcasing landscape, nature, and architectural photos.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Photo Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo Portfolio | Professional Photography',
    description: 'Stunning photography portfolio showcasing landscape, nature, and architectural photos.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geist_mono.variable} bg-gray-950 text-gray-100 font-sans`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
