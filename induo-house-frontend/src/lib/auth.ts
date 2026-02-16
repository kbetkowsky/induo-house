import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants';
import { LoginCredentials, RegisterCredentials, User } from '@/types';

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await apiClient.post<User>(
    API_ENDPOINTS.LOGIN,
    credentials
  );
  return response.data;
}

export async function register(credentials: RegisterCredentials): Promise<User> {
  const response = await apiClient.post<User>(
    API_ENDPOINTS.REGISTER,
    credentials
  );

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get<User>(API_ENDPOINTS.ME);
    return response.data;
  } catch (error) {
    console.log('User not authenticated');
    return null;
  }
}
