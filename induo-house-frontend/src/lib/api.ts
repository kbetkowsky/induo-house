import {
  Property,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  LoginRequest,
  LoginResponse
} from './types';

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

export async function getProperties(): Promise<Property[]> {
  const response = await fetchAPI<any>('/properties');
  return response.content || [];
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

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return fetchAPI<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}