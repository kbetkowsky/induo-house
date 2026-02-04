import { Property, CreatePropertyRequest, UpdatePropertyRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getProperties(page: number = 0, size: number = 20): Promise<{ content: Property[] }> {
  const response = await fetchAPI<any>(`/properties?page=${page}&size=${size}`);
  return response;
}

export async function getPropertiesByCity(city: string, page: number = 0, size: number = 20): Promise<{ content: Property[] }> {
  const response = await fetchAPI<any>(`/properties/city/${city}?page=${page}&size=${size}`);
  return response;
}

export async function getPropertiesByType(type: string, page: number = 0, size: number = 20): Promise<{ content: Property[] }> {
  const response = await fetchAPI<any>(`/properties/type/${type}?page=${page}&size=${size}`);
  return response;
}

export async function getPropertiesByPriceRange(minPrice: number, maxPrice: number, page: number = 0, size: number = 20): Promise<{ content: Property[] }> {
  const response = await fetchAPI<any>(`/properties/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=${size}`);
  return response;
}

export async function getPropertyById(id: number): Promise<Property> {
  return fetchAPI<Property>(`/properties/${id}`);
}

export async function createProperty(data: CreatePropertyRequest): Promise<Property> {
  return fetchAPI<Property>('/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProperty(id: number, data: UpdatePropertyRequest): Promise<Property> {
  return fetchAPI<Property>(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProperty(id: number): Promise<void> {
  return fetchAPI<void>(`/properties/${id}`, {
    method: 'DELETE',
  });
}
