'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Status {
  status: 'connected' | 'disconnected';
  message: string;
  instructions?: string[];
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/admin/test');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setStatus({
        status: 'disconnected',
        message: 'Failed to reach API',
      });
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Database Status */}
        <div className={`rounded-lg p-6 mb-8 border-2 ${
          status?.status === 'connected'
            ? 'border-green-500 bg-green-500/10'
            : 'border-red-500 bg-red-500/10'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-4 h-4 rounded-full ${
              status?.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <h2 className={`text-2xl font-bold ${
              status?.status === 'connected' ? 'text-green-400' : 'text-red-400'
            }`}>
              Database {status?.status === 'connected' ? 'Connected' : 'Disconnected'}
            </h2>
          </div>
          <p className="text-gray-300 mb-4">{status?.message}</p>

          {status?.status === 'disconnected' && status?.instructions && (
            <div className="bg-black/30 rounded-lg p-4 text-sm text-gray-300">
              <p className="font-semibold mb-2">Setup Instructions:</p>
              <ol className="space-y-1 list-decimal list-inside">
                {status.instructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ol>
              <Link
                href="/MONGODB_SETUP.md"
                className="text-blue-400 hover:text-blue-300 mt-3 inline-block"
              >
                View detailed setup guide →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/admin/photos/manage">
            <div className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-lg p-6 transition cursor-pointer">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="text-xl font-bold text-white mb-2">Manage Photos</h3>
              <p className="text-gray-400 text-sm">Edit photo details, set featured, pricing</p>
            </div>
          </Link>

          <Link href="/admin/photos/upload">
            <div className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-lg p-6 transition cursor-pointer">
              <div className="text-3xl mb-3">⬆️</div>
              <h3 className="text-xl font-bold text-white mb-2">Upload Photo</h3>
              <p className="text-gray-400 text-sm">Upload and process new photos with watermark</p>
            </div>
          </Link>

          <Link href="/admin/photos/batch-upload">
            <div className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-lg p-6 transition cursor-pointer">
              <div className="text-3xl mb-3">📁</div>
              <h3 className="text-xl font-bold text-white mb-2">Batch Upload</h3>
              <p className="text-gray-400 text-sm">Upload multiple photos at once</p>
            </div>
          </Link>

          <Link href="/gallery">
            <div className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-lg p-6 transition cursor-pointer">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="text-xl font-bold text-white mb-2">View Gallery</h3>
              <p className="text-gray-400 text-sm">See how photos appear on the site</p>
            </div>
          </Link>
        </div>

        {/* System Info */}
        <div className="mt-12 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">System Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Database</p>
              <p className="text-white font-semibold">
                {status?.status === 'connected' ? '✅ MongoDB' : '⚠️ Offline'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">ORM</p>
              <p className="text-white font-semibold">Prisma 5.19.0</p>
            </div>
            <div>
              <p className="text-gray-500">Server</p>
              <p className="text-white font-semibold">Next.js 15</p>
            </div>
            <div>
              <p className="text-gray-500">Environment</p>
              <p className="text-white font-semibold">
                {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
