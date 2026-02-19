'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RegisterCredentials } from '@/types';
import Link from 'next/link';
import {
  Eye, EyeOff, Building2, Mail, Lock, User, Phone, ArrowRight, CheckCircle2
} from 'lucide-react';

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterCredentials>();
  const password = watch('password');

  const perks = [
    'Bezpłatne przeglądanie ogłoszeń',
    'Powiadomienia o nowych ofertach',
    'Kontakt bezpośrednio z agentem',
    'Zapisywanie ulubionych ofert',
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT — branding panel */}
      <div className="hidden lg:flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full" />
        </div>

        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          InduoHouse
        </Link>

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div className="max-w-xs">
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Dołącz do tysięcy zadowolonych użytkowników
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Zarejestruj się za darmo i korzystaj z pełnych możliwości portalu.
            </p>
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg mb-10 lg:hidden">
            <Building2 className="h-6 w-6" />
            InduoHouse
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Utwórz konto</h1>
            <p className="text-slate-500 text-sm mt-1">Wypełnij formularz — zajmie to mniej niż minutę</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Imię"
                  placeholder="Jan"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.firstName?.message}
                  {...register('firstName', { required: 'Imię jest wymagane' })}
                />
                <Input
                  label="Nazwisko"
                  placeholder="Kowalski"
                  error={errors.lastName?.message}
                  {...register('lastName', { required: 'Nazwisko jest wymagane' })}
                />
              </div>

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

              <Input
                label="Numer telefonu (opcjonalnie)"
                type="tel"
                placeholder="+48 500 000 000"
                leftIcon={<Phone className="h-4 w-4" />}
                error={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />

              <div className="relative">
                <Input
                  label="Hasło"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 znaków"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  helperText={!errors.password ? 'Min. 6 znaków, najlepiej z cyfrą' : undefined}
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isRegistering}
              >
                {!isRegistering && <ArrowRight className="h-4 w-4" />}
                Utwórz konto
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Masz już konto?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
