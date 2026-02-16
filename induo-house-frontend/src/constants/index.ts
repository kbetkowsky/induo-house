export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  
  // Properties (do zrobienia pozniej)
  PROPERTIES: '/properties',
  PROPERTY_BY_ID: (id: number) => `/properties/${id}`,
  MY_PROPERTIES: '/properties/my',
  CREATE_PROPERTY: '/properties',
  UPDATE_PROPERTY: (id: number) => `/properties/${id}`,
  DELETE_PROPERTY: (id: number) => `/properties/${id}`,
} as const;

export const QUERY_KEYS = {
  PROPERTIES: 'properties',
  PROPERTY: 'property',
  MY_PROPERTIES: 'my-properties',
  USER: 'user',
} as const;

export const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Mieszkanie' },
  { value: 'HOUSE', label: 'Dom' },
  { value: 'LAND', label: 'Działka' },
  { value: 'COMMERCIAL', label: 'Komercyjne' },
] as const;
