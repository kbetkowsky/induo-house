'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await register({
        firstName: String(form.get('firstName')),
        lastName: String(form.get('lastName')),
        email: String(form.get('email')),
        phoneNumber: String(form.get('phoneNumber') || ''),
        password: String(form.get('password')),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się utworzyć konta');
    }
  }

  return (
    <main className="auth-page">
      <section className="container auth-layout">
        <div className="auth-story">
          <div className="auth-story-copy">
            <span className="eyebrow"><CheckCircle2 size={16} /> Darmowe konto</span>
            <h1>Publikuj oferty w lepszym otoczeniu.</h1>
            <p>Załóż konto, dodawaj nieruchomości i korzystaj z panelu stworzonego dla wygodnej pracy z ogłoszeniami.</p>
          </div>
          <Image src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1200&q=90" alt="" width={900} height={520} unoptimized />
        </div>
        <div className="auth-card">
          <span className="eyebrow">Nowe konto</span>
          <h1>Rejestracja</h1>
          <form className="form" onSubmit={submit}>
            {error ? <div className="error">{error}</div> : null}
            <div className="form-grid">
              <Field label="Imię" icon={<UserRound size={18} />}><input name="firstName" required placeholder="Kasia" /></Field>
              <Field label="Nazwisko" icon={null}><input name="lastName" required placeholder="Nowak" /></Field>
            </div>
            <Field label="Email" icon={<Mail size={18} />}><input name="email" type="email" autoComplete="email" required placeholder="twoj@email.pl" /></Field>
            <Field label="Telefon" icon={<Phone size={18} />}><input name="phoneNumber" type="tel" placeholder="+48 000 000 000" /></Field>
            <Field label="Hasło" icon={<Lock size={18} />} action={<button type="button" onClick={() => setShow((v) => !v)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}><input name="password" type={show ? 'text' : 'password'} autoComplete="new-password" required minLength={6} placeholder="Minimum 6 znaków" /></Field>
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Tworzenie...' : 'Utwórz konto'}</button>
          </form>
          <p className="switch-text">Masz konto? <Link href="/login">Zaloguj się</Link></p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon, action, children }: { label: string; icon: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span><div className="field-box">{icon}{children}{action}</div></label>;
}
