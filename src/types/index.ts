// Photo Portfolio TypeScript Types

export interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  storagePath?: string;
  category: PhotoCategory;
  tags: string[];
  date: string;
  width: number;
  height: number;
  featured: boolean;
  price?: number;
  licensingAvailable?: boolean;
}

export type PhotoCategory = 
  | 'landscape' 
  | 'portrait' 
  | 'wildlife' 
  | 'architecture' 
  | 'nature' 
  | 'street' 
  | 'other';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface LicenseOption {
  id: string;
  name: string;
  description: string;
  price: number;
  rights: string[];
}

export interface ProductTier {
  id: string;
  name: string;
  price: number;
  description: string;
  downloadResolution?: string;
}

export interface GalleryFilters {
  category?: PhotoCategory;
  search?: string;
  sortBy?: 'date' | 'title' | 'featured';
  orderBy?: 'asc' | 'desc';
}
