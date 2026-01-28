'use client';

import { useState, useEffect } from 'react';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  fileName: string;
}

export default function UploadProgress({ isUploading, progress, fileName }: UploadProgressProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!isUploading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Uploading Photo</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{fileName}</p>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">{progress}% complete</p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {progress >= 20 && <p>✓ File uploaded</p>}
          {progress >= 40 && <p>✓ Processing image</p>}
          {progress >= 60 && <p>✓ Adding watermark</p>}
          {progress >= 80 && <p>✓ Creating thumbnails</p>}
          {progress >= 95 && <p>✓ Saving to Google Drive</p>}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>

        {showDetails && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <p>• Uploading original file</p>
            <p>• Resizing to web dimensions</p>
            <p>• Applying watermark</p>
            <p>• Generating thumbnails</p>
            <p>• Saving to cloud storage</p>
          </div>
        )}
      </div>
    </div>
  );
}
