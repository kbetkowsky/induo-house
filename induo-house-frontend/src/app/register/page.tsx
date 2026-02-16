'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RegisterCredentials } from '@/types';
import Link from 'next/link';
import { Eye, EyeOff, Home } from 'lucide-react';

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterCredentials & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = (data: RegisterCredentials & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;
    registerUser(registerData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <Home className="h-8 w-8" />
            <span className="text-2xl font-bold">InduoHouse</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Stwórz konto</h1>
          <p className="text-gray-600 mt-2">Dołącz do InduoHouse już dziś</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Imię"
                placeholder="Jan"
                error={errors.firstName?.message}
                {...register('firstName', {
                  required: 'Imię jest wymagane',
                  minLength: {
                    value: 2,
                    message: 'Minimum 2 znaki',
                  },
                })}
              />

              <Input
                label="Nazwisko"
                placeholder="Kowalski"
                error={errors.lastName?.message}
                {...register('lastName', {
                  required: 'Nazwisko jest wymagane',
                  minLength: {
                    value: 2,
                    message: 'Minimum 2 znaki',
                  },
                })}
              />
            </div>

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

            <Input
              label="Numer telefonu (opcjonalnie)"
              type="tel"
              placeholder="123456789"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber', {
                pattern: {
                  value: /^[0-9]{9,15}$/,
                  message: 'Nieprawidłowy numer telefonu',
                },
              })}
            />

            <div className="relative">
              <Input
                label="Hasło"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Hasło jest wymagane',
                  minLength: {
                    value: 8,
                    message: 'Hasło musi mieć co najmniej 8 znaków',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Hasło musi zawierać małą i wielką literę oraz cyfrę',
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

            <div className="relative">
              <Input
                label="Potwierdź hasło"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Potwierdź hasło',
                  validate: (value) =>
                    value === password || 'Hasła nie są identyczne',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...register('terms', {
                  required: 'Musisz zaakceptować regulamin',
                })}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                Akceptuję{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                  regulamin
                </Link>{' '}
                i{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  politykę prywatności
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600 -mt-2">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isRegistering}
            >
              Utwórz konto
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Masz już konto?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Zaloguj się
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
