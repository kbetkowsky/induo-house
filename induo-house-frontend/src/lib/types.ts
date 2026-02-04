export interface Property {
  id: number;
  title: string;
  area: number;
  city: string;
  numberOfRooms: number | null;
  price: number;
  propertyType: 'APARTMENT' | 'HOUSE' | 'LAND';
  status: 'ACTIVE' | 'SOLD' | 'RENTED';
  transactionType: 'SALE' | 'RENT';
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhoneNumber: string;
}

export interface CreatePropertyRequest {
  title: string;
  area: number;
  city: string;
  numberOfRooms?: number;
  price: number;
  propertyType: 'APARTMENT' | 'HOUSE' | 'LAND';
  transactionType: 'SALE' | 'RENT';
}

export interface UpdatePropertyRequest {
  title?: string;
  area?: number;
  city?: string;
  numberOfRooms?: number;
  price?: number;
  propertyType?: 'APARTMENT' | 'HOUSE' | 'LAND';
  transactionType?: 'SALE' | 'RENT';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
}
