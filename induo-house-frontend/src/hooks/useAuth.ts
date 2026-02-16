'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginApi, register as registerApi, logout as logoutApi, getCurrentUser } from '@/lib/auth';
import { LoginCredentials, RegisterCredentials } from '@/types';
import { QUERY_KEYS } from '@/constants';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (userData) => {
      queryClient.setQueryData([QUERY_KEYS.USER], userData);

      toast.success(`Witaj ${userData.email}!`);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     'Nieprawidłowy email lub hasło';
      toast.error(message);
      console.error('Login error:', error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerApi(credentials),
    onSuccess: (userData) => {
      queryClient.setQueryData([QUERY_KEYS.USER], userData);

      toast.success('Rejestracja pomyślna! Witaj w InduoHouse 🏠');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     'Błąd rejestracji. Spróbuj ponownie.';
      toast.error(message);
      console.error('Register error:', error);
    },
  });

  const logout = async () => {
    try {
      await logoutApi();
      queryClient.clear();

      toast.success('Wylogowano pomyślnie');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      queryClient.clear();
      router.push('/');
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
