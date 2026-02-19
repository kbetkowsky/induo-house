export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  propertyType: 'APARTMENT' | 'HOUSE' | 'LAND' | 'COMMERCIAL';
  area: number;
  bedrooms: number;
  bathrooms: number;
  thumbnailUrl: string | null;
  images?: string[];
  createdAt: string;
  userId: number;
  userEmail?: string;
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: 'USER' | 'AGENT' | 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  propertyType: Property['propertyType'];
  area: number;
  bedrooms: number;
  bathrooms: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface PropertyImage {
  id: number;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface PropertyOwner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
}
