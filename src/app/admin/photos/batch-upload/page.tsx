'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export default function BatchUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [category, setCategory] = useState('landscape');
  const [featured, setFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.tiff', '.raw']
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFile = async (uploadedFile: UploadedFile) => {
    setFiles(prev => prev.map(f => 
      f.id === uploadedFile.id ? { ...f, status: 'uploading', progress: 0 } : f
    ));

    const formData = new FormData();
    formData.append('file', uploadedFile.file);
    formData.append('title', uploadedFile.file.name.replace(/\.[^/.]+$/, ''));
    formData.append('category', category);
    formData.append('featured', featured.toString());

    // Simulate progress
    const progressInterval = setInterval(() => {
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id ? { 
          ...f, 
          progress: Math.min(f.progress + 10, 90) 
        } : f
      ));
    }, 200);

    try {
      const response = await fetch('/api/photos/upload-drive', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (response.ok) {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { ...f, status: 'success', progress: 100 } : f
        ));
      } else {
        const error = await response.json();
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { ...f, status: 'error', error: error.message } : f
        ));
      }
    } catch (err) {
      clearInterval(progressInterval);
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id ? { 
          f, 
          status: 'error', 
          error: err instanceof Error ? err.message : 'Upload failed' 
        } : f
      ));
    }
  };

  const uploadAll = async () => {
    setIsUploading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (const file of pendingFiles) {
      await uploadFile(file);
      // Small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsUploading(false);
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'success'));
  };

  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const pendingCount = files.filter(f => f.status === 'pending').length;

  return (
    <div className="bg-gray-950 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Batch Upload Photos</h1>
          <Link
            href="/admin/photos/manage"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Management
          </Link>
        </div>

        {/* Stats */}
        {files.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
            <div className="flex gap-6 text-sm">
              <span className="text-gray-400">Total: {files.length}</span>
              <span className="text-green-400">Success: {successCount}</span>
              <span className="text-red-400">Errors: {errorCount}</span>
              <span className="text-yellow-400">Pending: {pendingCount}</span>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition mb-6 ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-gray-400">
            <p className="text-2xl mb-2">
              {isDragActive ? 'Drop the files here...' : 'Drag & drop photos here'}
            </p>
            <p>or click to select files</p>
            <p className="text-sm mt-2">Supports: JPEG, PNG, WebP, TIFF, RAW</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upload Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="street">Street</option>
                <option value="nature">Nature</option>
                <option value="wildlife">Wildlife</option>
                <option value="architecture">Architecture</option>
                <option value="macro">Macro</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Mark all as Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Files to Upload</h3>
              <div className="flex gap-2">
                <button
                  onClick={clearCompleted}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition"
                >
                  Clear Completed
                </button>
                <button
                  onClick={uploadAll}
                  disabled={isUploading || pendingCount === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white text-sm rounded-lg transition"
                >
                  {isUploading ? 'Uploading...' : `Upload All (${pendingCount})`}
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {files.map((uploadedFile) => (
                <div key={uploadedFile.id} className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium">{uploadedFile.file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {uploadedFile.status === 'error' && (
                      <p className="text-sm text-red-400">{uploadedFile.error}</p>
                    )}
                    {uploadedFile.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{uploadedFile.progress}%</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadedFile.status === 'pending' && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                        Pending
                      </span>
                    )}
                    {uploadedFile.status === 'uploading' && (
                      <span className="px-2 py-1 bg-blue-900 text-blue-400 text-xs rounded">
                        Uploading...
                      </span>
                    )}
                    {uploadedFile.status === 'success' && (
                      <span className="px-2 py-1 bg-green-900 text-green-400 text-xs rounded">
                        Success
                      </span>
                    )}
                    {uploadedFile.status === 'error' && (
                      <span className="px-2 py-1 bg-red-900 text-red-400 text-xs rounded">
                        Error
                      </span>
                    )}
                    <button
                      onClick={() => removeFile(uploadedFile.id)}
                      className="text-gray-400 hover:text-red-400 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
