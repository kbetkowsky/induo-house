'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from './api';
import { LoginPayload, RegisterPayload, User } from '@/types';

type AuthContextValue = {
  user: User | null | undefined;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api<User>('/auth/me')
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(payload) {
      setLoading(true);
      try {
        const next = await api<User>('/auth/login', { method: 'POST', json: payload });
        setUser(next);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    },
    async register(payload) {
      setLoading(true);
      try {
        const next = await api<User>('/auth/register', { method: 'POST', json: payload });
        setUser(next);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    },
    async logout() {
      await api<void>('/auth/logout', { method: 'POST' }).catch((error) => {
        if (!(error instanceof ApiError)) throw error;
      });
      setUser(null);
      router.push('/');
    },
  }), [loading, router, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
