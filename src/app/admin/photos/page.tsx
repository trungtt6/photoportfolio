'use client';

import { useState } from 'react';
import Link from 'next/link';

interface UploadResult {
  success: boolean;
  photoId?: string;
  message?: string;
  sizes?: { original: string; processed: string };
  paths?: {
    processed: string;
    thumb: string;
    medium: string;
    high: string;
  };
  error?: string;
}

export default function AdminPhotosPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/photos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as UploadResult;

      if (!response.ok) {
        setUploadResult({
          success: false,
          error: data.error || 'Upload failed',
        });
      } else {
        setUploadResult(data);
        setSelectedFile(null);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Gallery
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Admin: Upload Photos</h1>
          <p className="text-gray-400">Upload high-resolution photos for processing</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="text-5xl mb-4">📸</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {selectedFile ? selectedFile.name : 'Drop your photo here'}
            </h2>
            <p className="text-gray-400 mb-6">or click to select</p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <button
                type="button"
                onClick={() => document.getElementById('file-input')?.click()}
                disabled={isUploading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select File
              </button>
            </label>

            {selectedFile && (
              <div className="mt-4 text-sm text-gray-400">
                <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Type: {selectedFile.type}</p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? '⏳ Processing...' : '✓ Upload & Process'}
            </button>
            <button
              onClick={() => {
                setSelectedFile(null);
                setUploadResult(null);
              }}
              disabled={!selectedFile || isUploading}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        {uploadResult && (
          <div
            className={`border rounded-lg p-6 ${
              uploadResult.success
                ? 'border-green-600/50 bg-green-600/10'
                : 'border-red-600/50 bg-red-600/10'
            }`}
          >
            {uploadResult.success ? (
              <>
                <h3 className="text-xl font-bold text-green-400 mb-4">✅ Processing Complete!</h3>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Photo ID:</span>
                    <span className="text-white font-mono bg-gray-800 px-3 py-1 rounded">
                      {uploadResult.photoId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Original Size:</span>
                    <span className="text-white font-semibold">{uploadResult.sizes?.original}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Processed Size:</span>
                    <span className="text-white font-semibold">{uploadResult.sizes?.processed}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="text-gray-300">Result:</span>
                    <span className="text-green-400 font-semibold">
                      {uploadResult.message}
                    </span>
                  </div>
                </div>

                {uploadResult.paths && (
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-2">Generated files:</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-gray-800 p-2 rounded border border-gray-700">
                        <p className="text-gray-500">Watermarked (3200px):</p>
                        <p className="text-blue-400 break-all">{uploadResult.paths.processed}</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded border border-gray-700">
                        <p className="text-gray-500">References:</p>
                        <p className="text-blue-400 break-all">{uploadResult.paths.thumb}</p>
                        <p className="text-blue-400 break-all">{uploadResult.paths.medium}</p>
                        <p className="text-blue-400 break-all">{uploadResult.paths.high}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadResult(null);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Upload Another Photo
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-red-400 mb-4">❌ Upload Failed</h3>
                <p className="text-red-300 mb-4">{uploadResult.error}</p>
                <button
                  onClick={() => setUploadResult(null)}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">📋 Instructions</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>✓ Upload any JPG, PNG, or RAW image</li>
            <li>✓ System auto-resizes to 3200px (optimal web size)</li>
            <li>✓ Adds "© 2026 TrungTT" watermark</li>
            <li>✓ Generates thumbnail (800px), medium (1600px), and high (3200px) versions</li>
            <li>✓ Original stored securely for sales/licensing</li>
            <li>✓ All processed files watermarked to protect your work</li>
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <h4 className="font-semibold text-white mb-2">📊 Expected Results</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-500">If you upload:</p>
                <p className="text-blue-400 font-mono">~40-50 MB</p>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-500">You'll get:</p>
                <p className="text-green-400 font-mono">~2-3 MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
