'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <Link href="/" className="auth-wordmark">InduoHouse</Link>
          <span className="auth-kicker"><ShieldCheck size={16} /> Panel użytkownika</span>
          <h1>Zaloguj się i wróć do swoich ofert.</h1>
          <p>
            Zarządzaj ogłoszeniami, sprawdzaj zapisane nieruchomości i szybciej
            wracaj do mieszkań, które naprawdę warto obejrzeć.
          </p>
          <div className="auth-image-card">
            <Image
              src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1000&q=85"
              alt="Nowoczesne mieszkanie"
              width={760}
              height={520}
              unoptimized
            />
          </div>
        </div>

        <div className="auth-form-card">
          <div className="auth-form-head">
            <span>Witaj ponownie</span>
            <h2>Logowanie</h2>
            <p>Wpisz dane konta, aby przejść do panelu.</p>
          </div>

          <form onSubmit={handleSubmit((data) => login(data))} className="auth-form" noValidate>
            <label className="form-field">
              <span>Email</span>
              <div>
                <Mail size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="twoj@email.pl"
                  {...register('email', {
                    required: 'Email jest wymagany',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Podaj poprawny adres email',
                    },
                  })}
                />
              </div>
              {errors.email && <small>{errors.email.message}</small>}
            </label>

            <label className="form-field">
              <span>Hasło</span>
              <div>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Twoje hasło"
                  {...register('password', {
                    required: 'Hasło jest wymagane',
                    minLength: { value: 6, message: 'Hasło musi mieć min. 6 znaków' },
                  })}
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Pokaż hasło">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <small>{errors.password.message}</small>}
            </label>

            <button className="form-submit" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logowanie...' : 'Zaloguj się'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-switch">
            Nie masz konta? <Link href="/register">Utwórz konto</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
