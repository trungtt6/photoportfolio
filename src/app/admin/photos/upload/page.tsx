'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import UploadProgress from '@/components/admin/UploadProgress';

export default function UploadPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('landscape');
  const [price, setPrice] = useState(49.99);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title) {
      setMessage('❌ Please select a file and enter a title');
      return;
    }

    // Check file size only on Vercel (not localhost)
    const isVercel = window.location.hostname.includes('vercel.app');
    if (isVercel) {
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSize) {
        setMessage(`⚠️ File is ${(file.size / 1024 / 1024).toFixed(2)}MB. Vercel limits uploads to 4MB. Please compress your image first.`);
        return;
      }
    }

    setLoading(true);
    setUploadProgress(0);
    setCurrentStep('Initializing upload...');
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price.toString());
    formData.append('featured', featured.toString());

    try {
      const response = await fetch('/api/photos/upload-drive', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadProgress(100);
        setCurrentStep('Upload complete!');
        setMessage('✅ Photo uploaded successfully!');
        setFile(null);
        setTitle('');
        setDescription('');
        setCategory('landscape');
        setPrice(49.99);
        setFeatured(false);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/admin/photos/manage';
        }, 2000);
      } else {
        const error = await response.json();
        if (error.error === 'FILE_TOO_LARGE') {
          setMessage(`⚠️ ${error.message}`);
        } else {
          setMessage(`❌ Upload failed: ${error.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      setMessage(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Upload New Photo</h1>
          <Link
            href="/admin/photos/manage"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Management
          </Link>
        </div>

        {message && (
          <div className={`border rounded-lg p-4 mb-6 text-white ${
            message.includes('✅') 
              ? 'bg-green-900 border-green-700' 
              : 'bg-red-900 border-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Photo File *
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-700 hover:border-blue-500'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  {file ? (
                    <div>
                      <p className="text-white font-semibold">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm">JPG, PNG, WebP {typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') ? '(max 4MB)' : '(any size)'}</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mountain Sunrise"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your photo..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option>landscape</option>
                  <option>portrait</option>
                  <option>wildlife</option>
                  <option>architecture</option>
                  <option>nature</option>
                  <option>street</option>
                  <option>other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Featured Checkbox */}
            <div>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Mark as Featured</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold rounded-lg transition"
              >
                {loading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <Link
                href="/admin/photos/manage"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* Upload Progress Modal */}
      <UploadProgress 
        isUploading={loading}
        progress={uploadProgress}
        fileName={file?.name || ''}
      />
    </div>
  );
}
