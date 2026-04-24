'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { login as loginApi, register as registerApi, logout as logoutApi, getCurrentUser } from '@/lib/auth';
import { QUERY_KEYS } from '@/constants';
import { LoginCredentials, RegisterCredentials } from '@/types';

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as { message?: string; error?: string } | undefined;
    return responseData?.message ?? responseData?.error ?? fallback;
  }

  return fallback;
}

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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Nieprawidłowy email lub hasło'));
      console.error('Login error:', error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerApi(credentials),
    onSuccess: (userData) => {
      queryClient.setQueryData([QUERY_KEYS.USER], userData);
      toast.success('Rejestracja pomyślna! Witaj w InduoHouse.');
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Błąd rejestracji. Spróbuj ponownie.'));
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
