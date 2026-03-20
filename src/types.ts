export type Role = 'individual' | 'worker' | 'director' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyName?: string;
  createdAt: string;
}

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  supplier: string;
  price: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  compatibilityVerified: boolean;
  image?: string;
}

export interface ScoringDetails {
  partNumberMatch: number;
  priceCompetitiveness: number;
  supplierReliability: number;
  historicalSuccess: number;
  userRating: number;
  aiConfidence: number;
}

export interface GeminiSearchResult {
  partName: string;
  partNumber: string;
  compatibility: string;
  price: string;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  supplier: string;
  confidence: number;
  description: string;
  rating: number;
  reviewsCount: number;
  sourceUrl?: string;
  trustScore: number;
  scoringDetails: ScoringDetails;
}

export interface SearchResponse {
  results: GeminiSearchResult[];
  groundingMetadata?: any;
}

export interface VinDetails {
  year: string;
  make: string;
  model: string;
  engine: string;
  trim: string;
  transmission: string;
  driveType: string;
  bodyStyle: string;
  manufacturedIn: string;
}

export interface SearchResult {
  query: string;
  vehicle: {
    type: 'TRUCK' | 'CAR';
    make: string;
    model: string;
    year: string;
    engine: string;
  };
  parts: Part[];
  timestamp: string;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Pending Payment';
  searchCount: number;
  joinedAt: string;
}

export interface Vehicle {
  id: string;
  type: 'TRUCK' | 'CAR';
  make: string;
  model: string;
  year: string;
  engine: string;
  vin?: string;
  nickname?: string;
}

export interface Alert {
  id: string;
  user_id: string;
  type: 'price_drop' | 'maintenance' | 'new_part';
  title: string;
  description: string;
  is_read: boolean;
  metadata: any;
  created_at: string;
}
