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
  type: 'price_drop' | 'back_in_stock';
  partName: string;
  partNumber: string;
  currentPrice: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}
