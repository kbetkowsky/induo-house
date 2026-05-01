'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await login({ email: String(form.get('email')), password: String(form.get('password')) });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zalogować');
    }
  }

  return (
    <main className="auth-page">
      <section className="container auth-layout">
        <AuthStory title="Wróć do ofert, które warto zobaczyć." text="Twój panel pozwala dodawać ogłoszenia, śledzić zapisane nieruchomości i szybciej wracać do najlepszych okazji." image="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=90" />
        <div className="auth-card">
          <span className="eyebrow"><ShieldCheck size={16} /> Bezpieczne logowanie</span>
          <h1>Logowanie</h1>
          <form className="form" onSubmit={submit}>
            {error ? <div className="error">{error}</div> : null}
            <Field label="Email" icon={<Mail size={18} />}><input name="email" type="email" autoComplete="email" required placeholder="twoj@email.pl" /></Field>
            <Field label="Hasło" icon={<Lock size={18} />} action={<button type="button" onClick={() => setShow((v) => !v)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}><input name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required placeholder="Twoje hasło" /></Field>
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Logowanie...' : 'Zaloguj się'}</button>
          </form>
          <p className="switch-text">Nie masz konta? <Link href="/register">Załóż konto</Link></p>
        </div>
      </section>
    </main>
  );
}

function AuthStory({ title, text, image }: { title: string; text: string; image: string }) {
  return <div className="auth-story"><div className="auth-story-copy"><span className="eyebrow">InduoHouse</span><h1>{title}</h1><p>{text}</p></div><Image src={image} alt="" width={900} height={520} unoptimized /></div>;
}

function Field({ label, icon, action, children }: { label: string; icon: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span><div className="field-box">{icon}{children}{action}</div></label>;
}
