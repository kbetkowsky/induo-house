'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  ownerEmail: string;
  ownerName: string;
  propertyTitle: string;
}

export default function ContactForm({ ownerEmail, ownerName, propertyTitle }: Props) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name:    user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
    email:   user?.email ?? '',
    phone:   '',
    message: `Dzień dobry,\n\njestem zainteresowany/a ogłoszeniem "${propertyTitle}". Proszę o kontakt.`,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = 'Podaj imię';
    if (!form.email.trim())   e.email   = 'Podaj e-mail';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Nieprawidłowy e-mail';
    if (!form.message.trim()) e.message = 'Wpisz wiadomość';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSending(true);
    const subject = encodeURIComponent(`Zapytanie dot. ogłoszenia: ${propertyTitle}`);
    const body = encodeURIComponent(
      `Od: ${form.name} <${form.email}>${form.phone ? `\nTelefon: ${form.phone}` : ''}\n\n${form.message}`
    );
    window.location.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)', color: '#e2e8f0',
    fontSize: 13, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#475569', marginBottom: 5,
    letterSpacing: '0.05em', textTransform: 'uppercase' as const,
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <CheckCircle2 style={{ width: 40, height: 40, color: '#4ade80', margin: '0 auto 12px' }} />
        <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>Wiadomość wysłana!</p>
        <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>{ownerName} wkrótce się z Tobą skontaktuje.</p>
        <button
          onClick={() => setSent(false)}
          style={{ marginTop: 16, fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Wyślij kolejną wiadomość
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Wyślij wiadomość
      </p>

      <div>
        <label style={labelStyle}>Imię i nazwisko</label>
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Jan Kowalski"
          style={{ ...fieldStyle, borderColor: errors.name ? '#f87171' : 'rgba(255,255,255,0.08)' }}
          onFocus={e => (e.target.style.borderColor = '#3b82f6')}
          onBlur={e  => (e.target.style.borderColor = errors.name ? '#f87171' : 'rgba(255,255,255,0.08)')}
        />
        {errors.name && <p style={{ fontSize: 11, color: '#f87171', marginTop: 3 }}>{errors.name}</p>}
      </div>

      <div>
        <label style={labelStyle}>E-mail</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="jan@example.com"
          style={{ ...fieldStyle, borderColor: errors.email ? '#f87171' : 'rgba(255,255,255,0.08)' }}
          onFocus={e => (e.target.style.borderColor = '#3b82f6')}
          onBlur={e  => (e.target.style.borderColor = errors.email ? '#f87171' : 'rgba(255,255,255,0.08)')}
        />
        {errors.email && <p style={{ fontSize: 11, color: '#f87171', marginTop: 3 }}>{errors.email}</p>}
      </div>

      <div>
        <label style={labelStyle}>Telefon <span style={{ color: '#334155', fontWeight: 400, textTransform: 'none' }}>(opcjonalny)</span></label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          placeholder="+48 500 000 000"
          style={fieldStyle}
          onFocus={e => (e.target.style.borderColor = '#3b82f6')}
          onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
      </div>

      <div>
        <label style={labelStyle}>Wiadomość</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          style={{
            ...fieldStyle, resize: 'vertical', minHeight: 90,
            borderColor: errors.message ? '#f87171' : 'rgba(255,255,255,0.08)',
          }}
          onFocus={e => (e.target.style.borderColor = '#3b82f6')}
          onBlur={e  => (e.target.style.borderColor = errors.message ? '#f87171' : 'rgba(255,255,255,0.08)')}
        />
        {errors.message && <p style={{ fontSize: 11, color: '#f87171', marginTop: 3 }}>{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={sending}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px 0', borderRadius: 12, border: 'none',
          cursor: sending ? 'not-allowed' : 'pointer',
          background: sending ? 'rgba(37,99,235,0.5)' : '#2563eb',
          color: '#fff', fontSize: 14, fontWeight: 700,
          transition: 'background 0.2s', width: '100%',
        }}
        onMouseEnter={e => { if (!sending) (e.currentTarget.style.background = '#1d4ed8'); }}
        onMouseLeave={e => { if (!sending) (e.currentTarget.style.background = '#2563eb'); }}
      >
        <Send style={{ width: 15, height: 15 }} />
        {sending ? 'Wysyłanie…' : 'Wyślij wiadomość'}
      </button>
    </form>
  );
}
