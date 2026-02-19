'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoginCredentials } from '@/types';
import Link from 'next/link';
import { Eye, EyeOff, Building2, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT — branding panel */}
      <div className="hidden lg:flex flex-col bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-12 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full" />
        </div>

        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Building2 className="h-5 w-5" />
          </div>
          InduoHouse
        </Link>

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div className="max-w-xs">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <Building2 className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Witaj z powrotem!
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Zaloguj się, aby zarządzać swoimi ogłoszeniami i przeglądać najnowsze oferty nieruchomości.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 text-sm text-blue-200">
            <span>✓ Tysiące ofert</span>
            <span>✓ Zaufani agenci</span>
            <span>✓ Bezpieczne transakcje</span>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg mb-10 lg:hidden">
            <Building2 className="h-6 w-6" />
            InduoHouse
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Zaloguj się</h1>
            <p className="text-slate-500 text-sm mt-1">Podaj swoje dane, aby kontynuować</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <form onSubmit={handleSubmit((data) => login(data))} className="space-y-5">
              <Input
                label="Adres email"
                type="email"
                placeholder="jan@kowalski.pl"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email jest wymagany',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Nieprawidłowy adres email',
                  },
                })}
              />

              <div>
                <div className="relative">
                  <Input
                    label="Hasło"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.password?.message}
                    {...register('password', {
                      required: 'Hasło jest wymagane',
                      minLength: { value: 6, message: 'Min. 6 znaków' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
                    Zapomniałeś hasła?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoggingIn}
              >
                {!isLoggingIn && <ArrowRight className="h-4 w-4" />}
                Zaloguj się
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Nie masz konta?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
