export type TransactionType = 'SALE' | 'RENT';
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'LAND';

export type User = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  role: 'USER' | 'AGENT' | 'ADMIN';
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
};

export type PropertyListItem = {
  id: number;
  title: string;
  price: number;
  area: number;
  city: string;
  numberOfRooms: number | null;
  transactionType: TransactionType | string;
  propertyType: PropertyType | string;
  status: string;
  thumbnailUrl: string | null;
  ownerFirstName?: string;
  ownerLastName?: string;
  ownerPhoneNumber?: string;
};

export type PropertyImage = {
  id: number;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type PropertyOwner = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
};

export type PropertyDetail = {
  id: number;
  title: string;
  description?: string;
  price: number;
  area: number;
  city: string;
  street?: string;
  postalCode?: string;
  numberOfRooms: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  transactionType: TransactionType | string;
  propertyType: PropertyType | string;
  status: string;
  images?: PropertyImage[];
  createdAt?: string;
  updatedAt?: string;
  owner?: PropertyOwner;
};

export type PageResponse<T> = {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type PropertyFilters = {
  city?: string;
  propertyType?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  page?: number;
  size?: number;
};

export type CreatePropertyPayload = {
  title: string;
  description: string;
  price: number;
  area: number;
  city: string;
  street: string;
  postalCode: string;
  numberOfRooms: number | null;
  floor: number | null;
  totalFloors: number | null;
  propertyType: PropertyType;
  transactionType: TransactionType;
};

export type ChatStatus = {
  enabled: boolean;
  ragEnabled?: boolean;
  assistantName?: string;
};

export type ChatMessage = {
  id?: number;
  role?: string;
  content?: string;
  message?: string;
  createdAt?: string;
};

export type ChatResponse = {
  sessionId?: string;
  message?: string;
  response?: string;
  content?: string;
};
