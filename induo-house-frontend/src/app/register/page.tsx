'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials } from '@/types';

const PERKS = [
  'Dodawaj i edytuj własne ogłoszenia',
  'Zapisuj interesujące nieruchomości',
  'Kontaktuj się z właścicielami szybciej',
];

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>();

  return (
    <main className="auth-page">
      <section className="auth-panel register-panel">
        <div className="auth-copy">
          <Link href="/" className="auth-wordmark">InduoHouse</Link>
          <span className="auth-kicker"><CheckCircle2 size={16} /> Konto jest bezpłatne</span>
          <h1>Dołącz do rynku nieruchomości w lepszej formie.</h1>
          <p>
            Załóż konto, aby publikować oferty, obserwować mieszkania i prowadzić
            swoje ogłoszenia w jednym uporządkowanym panelu.
          </p>
          <div className="auth-perks">
            {PERKS.map((perk) => (
              <span key={perk}><CheckCircle2 size={17} /> {perk}</span>
            ))}
          </div>
          <div className="auth-image-card">
            <Image
              src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1000&q=85"
              alt="Jasne wnętrze mieszkania"
              width={760}
              height={520}
              unoptimized
            />
          </div>
        </div>

        <div className="auth-form-card">
          <div className="auth-form-head">
            <span>Nowe konto</span>
            <h2>Rejestracja</h2>
            <p>Podaj podstawowe dane. Resztę uzupełnisz później.</p>
          </div>

          <form onSubmit={handleSubmit((data) => registerUser(data))} className="auth-form" noValidate>
            <div className="form-grid-two">
              <label className="form-field">
                <span>Imię</span>
                <div>
                  <UserRound size={18} />
                  <input placeholder="Kasia" {...register('firstName', { required: 'Imię jest wymagane' })} />
                </div>
                {errors.firstName && <small>{errors.firstName.message}</small>}
              </label>

              <label className="form-field">
                <span>Nazwisko</span>
                <div>
                  <input placeholder="Nowak" {...register('lastName', { required: 'Nazwisko jest wymagane' })} />
                </div>
                {errors.lastName && <small>{errors.lastName.message}</small>}
              </label>
            </div>

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
              <span>Telefon <em>opcjonalnie</em></span>
              <div>
                <Phone size={18} />
                <input type="tel" placeholder="+48 000 000 000" {...register('phoneNumber')} />
              </div>
            </label>

            <label className="form-field">
              <span>Hasło</span>
              <div>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Minimum 6 znaków"
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

            <button className="form-submit" type="submit" disabled={isRegistering}>
              {isRegistering ? 'Tworzenie konta...' : 'Utwórz konto'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-switch">
            Masz już konto? <Link href="/login">Zaloguj się</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
