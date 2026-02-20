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
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-grid">
      <style>{`
        .auth-grid { background: #080b14; }
        @media (max-width: 900px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left  { display: none !important; }
          .auth-right { padding: 40px 20px !important; }
        }
        .auth-input-wrap input, .auth-input-wrap select {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.09) !important;
          color: #e2e8f0 !important;
        }
        .auth-input-wrap input::placeholder { color: #475569 !important; }
        .auth-input-wrap input:focus {
          border-color: rgba(59,130,246,0.5) !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important;
        }
        .auth-input-wrap label { color: #94a3b8 !important; }
        .show-pass-btn { transition: color 0.2s; }
        .show-pass-btn:hover { color: #94a3b8 !important; }
      `}</style>

      {/* ── LEWA — branding ── */}
      <div
        className="auth-left"
        style={{
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(145deg, #0f1729 0%, #0d1d3e 50%, #0a1628 100%)',
          padding: '48px 56px',
          position: 'relative', overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Logo */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <Building2 style={{ width: 20, height: 20, color: '#a78bfa' }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>InduoHouse</span>
        </Link>

        {/* Treść */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 340 }}>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.03em' }}>
              Dołącz do tysięcy zadowolonych użytkowników
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 36 }}>
              Zarejestruj się za darmo i korzystaj z pełnych możliwości portalu.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none', margin: 0, padding: 0 }}>
              {perks.map((perk) => (
                <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#94a3b8' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 style={{ width: 13, height: 13, color: '#a78bfa' }} />
                  </div>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 20, fontSize: 12, color: '#334155' }}>
          <span>✓ Darmowe konto</span>
          <span>✓ Bez opłat</span>
          <span>✓ Anuluj kiedy chcesz</span>
        </div>
      </div>

      {/* ── PRAWA — formularz ── */}
      <div
        className="auth-right"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px 40px',
          background: '#080b14',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>

          <Link href="/" className="lg:hidden" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
            <Building2 style={{ width: 22, height: 22, color: '#a78bfa' }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>InduoHouse</span>
          </Link>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', margin: '0 0 8px', letterSpacing: '-0.03em' }}>Utwórz konto</h1>
            <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>Wypełnij formularz — zajmie to mniej niż minutę</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '28px 24px',
            backdropFilter: 'blur(12px)',
          }}>
            <form onSubmit={handleSubmit((data) => registerUser(data))} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Imię + Nazwisko */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="auth-input-wrap">
                  <Input
                    label="Imię"
                    placeholder="Jan"
                    leftIcon={<User style={{ width: 14, height: 14, color: '#475569' }} />}
                    error={errors.firstName?.message}
                    {...register('firstName', { required: 'Imię jest wymagane' })}
                  />
                </div>
                <div className="auth-input-wrap">
                  <Input
                    label="Nazwisko"
                    placeholder="Kowalski"
                    error={errors.lastName?.message}
                    {...register('lastName', { required: 'Nazwisko jest wymagane' })}
                  />
                </div>
              </div>

              <div className="auth-input-wrap">
                <Input
                  label="Adres email"
                  type="email"
                  placeholder="jan@kowalski.pl"
                  leftIcon={<Mail style={{ width: 14, height: 14, color: '#475569' }} />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email jest wymagany',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Nieprawidłowy adres email' },
                  })}
                />
              </div>

              <div className="auth-input-wrap">
                <Input
                  label="Numer telefonu (opcjonalnie)"
                  type="tel"
                  placeholder="+48 500 000 000"
                  leftIcon={<Phone style={{ width: 14, height: 14, color: '#475569' }} />}
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber')}
                />
              </div>

              <div>
                <div style={{ position: 'relative' }} className="auth-input-wrap">
                  <Input
                    label="Hasło"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 znaków"
                    leftIcon={<Lock style={{ width: 14, height: 14, color: '#475569' }} />}
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
                    className="show-pass-btn"
                    style={{ position: 'absolute', right: 12, top: 34, color: '#334155', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isRegistering}
              >
                {!isRegistering && <ArrowRight style={{ width: 16, height: 16 }} />}
                Utwórz konto
              </Button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#475569', marginTop: 24 }}>
            Masz już konto?{' '}
            <Link href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 700 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a78bfa')}
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
