import { api, API_BASE } from './api';
import {
  CreatePropertyPayload,
  PageResponse,
  PropertyDetail,
  PropertyFilters,
  PropertyImage,
  PropertyListItem,
} from '@/types';

function toParams(filters: PropertyFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) params.set(key, String(value));
  });
  params.set('page', String(filters.page ?? 0));
  params.set('size', String(filters.size ?? 12));
  return params.toString();
}

export function getProperties(filters: PropertyFilters = {}) {
  return api<PageResponse<PropertyListItem>>(`/properties?${toParams(filters)}`);
}

export function getProperty(id: number) {
  return api<PropertyDetail>(`/properties/${id}`);
}

export function getMyProperties() {
  return api<PageResponse<PropertyListItem>>('/properties/my?page=0&size=50');
}

export function createProperty(payload: CreatePropertyPayload) {
  return api<PropertyDetail>('/properties', {
    method: 'POST',
    json: payload,
  });
}

export async function uploadPropertyImage(propertyId: number, file: File, isPrimary: boolean) {
  const form = new FormData();
  form.append('file', file);
  form.append('isPrimary', String(isPrimary));
  const response = await fetch(`${API_BASE}/properties/${propertyId}/images`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!response.ok) throw new Error('Nie udało się wysłać zdjęcia');
  return response.json() as Promise<PropertyImage>;
}

export function deleteProperty(id: number) {
  return api<void>(`/properties/${id}`, { method: 'DELETE' });
}
