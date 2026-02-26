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

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  area: number;
  city: string;
  street?: string;
  postalCode?: string;
  propertyType: string;
  transactionType: string;
  status: string;
  numberOfRooms: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  thumbnailUrl: string | null;
  images?: PropertyImage[];
  createdAt: string;
  owner: PropertyOwner;
}

// Alias dla list — ta sama struktura co Property ale bez images/owner
export interface PropertyListResponse {
  id: number;
  title: string;
  price: number;
  area: number;
  city: string;
  numberOfRooms: number | null;
  transactionType: string;
  propertyType: string;
  status: string;
  thumbnailUrl: string | null;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhoneNumber: string;
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
