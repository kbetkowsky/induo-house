import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants';
import { Property, PaginatedResponse } from '@/types';
import { PropertyListResponse } from '@/types/property';

export interface PropertyFilters {
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  page?: number;
  size?: number;
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedResponse<PropertyListResponse>> {
  const params = new URLSearchParams();

  if (filters.city) params.append('city', filters.city);
  if (filters.propertyType) params.append('propertyType', filters.propertyType);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.minArea !== undefined) params.append('minArea', filters.minArea.toString());
  if (filters.maxArea !== undefined) params.append('maxArea', filters.maxArea.toString());
  if (filters.bedrooms !== undefined) params.append('bedrooms', filters.bedrooms.toString());

  params.append('page', (filters.page || 0).toString());
  params.append('size', (filters.size || 12).toString());

  const response = await apiClient.get<PaginatedResponse<PropertyListResponse>>(
    `${API_ENDPOINTS.PROPERTIES}?${params.toString()}`
  );

  return response.data;
}

export async function getPropertyById(id: number): Promise<Property> {
  const response = await apiClient.get<Property>(
    API_ENDPOINTS.PROPERTY_BY_ID(id)
  );
  return response.data;
}

export async function getMyProperties(): Promise<Property[]> {
  const response = await apiClient.get<Property[]>(API_ENDPOINTS.MY_PROPERTIES);
  return response.data;
}

export async function createProperty(data: FormData): Promise<Property> {
  const response = await apiClient.post<Property>(
    API_ENDPOINTS.CREATE_PROPERTY,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export async function updateProperty(
  id: number,
  data: FormData
): Promise<Property> {
  const response = await apiClient.put<Property>(
    API_ENDPOINTS.UPDATE_PROPERTY(id),
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export async function deleteProperty(id: number): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.DELETE_PROPERTY(id));
}
