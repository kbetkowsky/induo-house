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
        {/* Dekoracje tła */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', top: '40%', left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
          {/* Siatka */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Logo */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <Building2 style={{ width: 20, height: 20, color: '#60a5fa' }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>InduoHouse</span>
        </Link>

        {/* Treść */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 340 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, backdropFilter: 'blur(8px)' }}>
              <Building2 style={{ width: 28, height: 28, color: '#60a5fa' }} />
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.03em' }}>
              Witaj<br />z powrotem!
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 40 }}>
              Zaloguj się, aby zarządzać swoimi ogłoszeniami i przeglądać najnowsze oferty nieruchomości.
            </p>

            {/* Statystyki */}
            <div style={{ display: 'flex', gap: 20 }}>
              {[['10k+', 'Ofert'], ['2k+', 'Agentów'], ['99%', 'Zadowolonych']].map(([val, lbl]) => (
                <div key={lbl} style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#60a5fa', letterSpacing: '-0.02em' }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2, fontWeight: 600 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 20, fontSize: 12, color: '#334155' }}>
          <span>✓ Darmowe konto</span>
          <span>✓ Tysiące ofert</span>
          <span>✓ Bezpieczne transakcje</span>
        </div>
      </div>

      {/* ── PRAWA — formularz ── */}
      <div
        className="auth-right"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px 40px',
          background: '#080b14',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
            <Building2 style={{ width: 22, height: 22, color: '#3b82f6' }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>InduoHouse</span>
          </Link>

          {/* Nagłówek */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', margin: '0 0 8px', letterSpacing: '-0.03em' }}>Zaloguj się</h1>
            <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>Podaj swoje dane, aby kontynuować</p>
          </div>

          {/* Karta */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '32px 28px',
            backdropFilter: 'blur(12px)',
          }}>
            <form onSubmit={handleSubmit((data) => login(data))} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div className="auth-input-wrap">
                <Input
                  label="Adres email"
                  type="email"
                  placeholder="jan@kowalski.pl"
                  leftIcon={<Mail style={{ width: 15, height: 15, color: '#475569' }} />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email jest wymagany',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Nieprawidłowy adres email' },
                  })}
                />
              </div>

              <div>
                <div style={{ position: 'relative' }} className="auth-input-wrap">
                  <Input
                    label="Hasło"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    leftIcon={<Lock style={{ width: 15, height: 15, color: '#475569' }} />}
                    error={errors.password?.message}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <Link href="/forgot-password" style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#3b82f6')}
                  >
                    Zapomniałeś hasła?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoggingIn}
              >
                {!isLoggingIn && <ArrowRight style={{ width: 16, height: 16 }} />}
                Zaloguj się
              </Button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#475569', marginTop: 24 }}>
            Nie masz konta?{' '}
            <Link href="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 700 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3b82f6')}
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
