'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoginCredentials } from '@/types';
import Link from 'next/link';
import { Eye, EyeOff, Home } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <Home className="h-8 w-8" />
            <span className="text-2xl font-bold">InduoHouse</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Zaloguj się</h1>
          <p className="text-gray-600 mt-2">Witaj z powrotem! Wprowadź swoje dane.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="twoj@email.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email jest wymagany',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Nieprawidłowy adres email',
                  },
                })}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Hasło"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Hasło jest wymagane',
                    minLength: {
                      value: 6,
                      message: 'Hasło musi mieć co najmniej 6 znaków',
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Zapomniałeś hasła?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoggingIn}
            >
              Zaloguj się
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nie masz konta?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Zarejestruj się
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo: kamil@test.com / password123</p>
        </div>
      </div>
    </div>
  );
}
