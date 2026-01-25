'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  price: number;
  visible: boolean;
  imageUrl?: string;
  filename?: string;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Photo>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await fetch('/api/admin/photos/list');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (err) {
      console.error('Error loading photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (photo: any) => {
    setEditingId(photo.id);
    setEditData({
      title: photo.title,
      description: photo.description,
      category: photo.category,
      featured: photo.featured,
      price: photo.price,
      visible: photo.visible,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      const response = await fetch(`/api/admin/photos/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setMessage('✅ Photo updated!');
        setEditingId(null);
        loadPhotos();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Error updating photo');
      }
    } catch (err) {
      setMessage('❌ Error updating photo');
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('✅ Photo deleted!');
        loadPhotos();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Error deleting photo');
      }
    } catch (err) {
      setMessage('❌ Error deleting photo');
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Photo Management</h1>
          <Link
            href="/admin/photos/upload"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            + Upload New Photo
          </Link>
        </div>

        {message && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 text-white">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="bg-gray-900 border-2 border-dashed border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">No photos found</p>
            <Link
              href="/admin/photos/upload"
              className="text-blue-400 hover:text-blue-300"
            >
              Upload your first photo →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition"
              >
                {editingId === photo.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    {/* Photo Preview */}
                    <div className="flex gap-4 pb-4 border-b border-gray-800">
                      <img
                        src={photo.imageUrl || `/api/storage/processed/${photo.id}.jpg`}
                        alt={photo.title}
                        className="w-40 h-40 object-cover rounded-lg border border-gray-700"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{photo.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{photo.filename}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>ID: <span className="text-gray-400 font-mono">{photo.id}</span></p>
                          <p>File: <span className="text-gray-400">{photo.filename}</span></p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, description: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">
                          Category
                        </label>
                        <select
                          value={editData.category || 'landscape'}
                          onChange={(e) =>
                            setEditData({ ...editData, category: e.target.value })
                          }
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
                          value={editData.price || 49.99}
                          onChange={(e) =>
                            setEditData({ ...editData, price: parseFloat(e.target.value) })
                          }
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <label className="flex items-center gap-2 text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.featured || false}
                          onChange={(e) =>
                            setEditData({ ...editData, featured: e.target.checked })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Featured</span>
                      </label>

                      <label className="flex items-center gap-2 text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.visible !== false}
                          onChange={(e) =>
                            setEditData({ ...editData, visible: e.target.checked })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Visible</span>
                      </label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={saveEdit}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex gap-6 items-start">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={photo.imageUrl || `/api/storage/processed/${photo.id}.jpg`}
                        alt={photo.title}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {photo.title}
                        {photo.featured && <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-1 rounded">⭐ Featured</span>}
                      </h3>
                      <p className="text-gray-400 mb-3 line-clamp-2">{photo.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 mb-4">
                        <span>Category: <span className="text-white font-medium">{photo.category}</span></span>
                        <span>Price: <span className="text-white font-medium">${photo.price}</span></span>
                        <span>Visible: <span className="text-white font-medium">{photo.visible ? '✓ Yes' : '✗ No'}</span></span>
                        <span>ID: <span className="text-white font-mono text-xs">{photo.id}</span></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(photo)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition whitespace-nowrap"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
