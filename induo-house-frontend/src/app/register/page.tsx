'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials } from '@/types';
import Link from 'next/link';
import {
  Eye, EyeOff, Building2, Mail, Lock, User, Phone, ArrowRight, CheckCircle2
} from 'lucide-react';

const PERKS = [
  'Bezpłatne przeglądanie ogłoszeń',
  'Powiadomienia o nowych ofertach',
  'Kontakt bezpośrednio z agentem',
  'Zapisywanie ulubionych ofert',
];

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterCredentials>();

  const inputStyle = (name: string, hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    height: 54,
    padding: '0 16px 0 46px',
    borderRadius: 14,
    border: `1.5px solid ${
      hasError
        ? 'rgba(239,68,68,0.6)'
        : focusedField === name
        ? 'rgba(124,58,237,0.6)'
        : 'rgba(255,255,255,0.09)'
    }`,
    background: focusedField === name
      ? 'rgba(124,58,237,0.06)'
      : 'rgba(255,255,255,0.04)',
    color: '#e2e8f0',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: focusedField === name
      ? '0 0 0 3px rgba(124,58,237,0.1)'
      : 'none',
  });

  const inputStyleNoIcon = (name: string, hasError?: boolean): React.CSSProperties => ({
    ...inputStyle(name, hasError),
    padding: '0 16px',
  });

  const iconColor = (name: string) =>
    focusedField === name ? '#a78bfa' : '#475569';

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-grid">
      <style>{`
        html { scroll-behavior: smooth; }
        .auth-grid { background: #080b14; }
        @media (max-width: 900px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left  { display: none !important; }
          .auth-right { padding: 40px 20px !important; }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0d1525 inset !important;
          -webkit-text-fill-color: #e2e8f0 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        .submit-btn {
          width: 100%; height: 54px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: none; border-radius: 14px;
          color: #fff; font-size: 16px; font-weight: 700;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center; gap: 8px;
          font-family: inherit;
          box-shadow: 0 4px 20px rgba(124,58,237,0.4);
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          letter-spacing: -0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(124,58,237,0.5);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blobMove {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(20px,-15px) scale(1.04); }
          66%      { transform: translate(-15px,10px) scale(0.97); }
        }
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(70px); pointer-events: none;
          animation: blobMove 14s ease-in-out infinite;
        }
      `}</style>

      {/* ── LEWA — branding ── */}
      <div className="auth-left" style={{
        display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(145deg,#0f1729 0%,#160d30 50%,#0a1628 100%)',
        padding: '48px 56px',
        position: 'relative', overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="blob" style={{ width:420, height:420, background:'rgba(124,58,237,0.16)', top:-100, right:-100, animationDelay:'0s' }} />
        <div className="blob" style={{ width:320, height:320, background:'rgba(37,99,235,0.1)',   bottom:-60, left:-60,   animationDelay:'-5s' }} />
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
          backgroundSize:'40px 40px',
        }} />

        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', position:'relative', zIndex:1 }}>
          <div style={{ width:38, height:38, borderRadius:12, background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Building2 style={{ width:20, height:20, color:'#a78bfa' }} />
          </div>
          <span style={{ fontSize:18, fontWeight:800, color:'#f1f5f9', letterSpacing:'-0.02em' }}>InduoHouse</span>
        </Link>

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:1 }}>
          <div style={{ maxWidth:340 }}>
            <h2 style={{ fontSize:36, fontWeight:900, color:'#f1f5f9', lineHeight:1.1, marginBottom:16, letterSpacing:'-0.035em' }}>
              Dołącz do<br />
              <span style={{ background:'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                tysięcy użytkowników
              </span>
            </h2>
            <p style={{ fontSize:15, color:'#64748b', lineHeight:1.75, marginBottom:40 }}>
              Zarejestruj się za darmo i korzystaj z pełnych możliwości portalu nieruchomości.
            </p>

            <ul style={{ display:'flex', flexDirection:'column', gap:14, listStyle:'none', margin:0, padding:0 }}>
              {PERKS.map(perk => (
                <li key={perk} style={{ display:'flex', alignItems:'center', gap:12, fontSize:14, color:'#94a3b8' }}>
                  <div style={{ width:26, height:26, borderRadius:8, background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <CheckCircle2 size={14} style={{ color:'#a78bfa' }} />
                  </div>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ position:'relative', zIndex:1, display:'flex', gap:20, fontSize:12, color:'#334155' }}>
          <span>✓ Darmowe konto</span>
          <span>✓ Bez opłat</span>
          <span>✓ Anuluj kiedy chcesz</span>
        </div>
      </div>

      {/* ── PRAWA — formularz ── */}
      <div className="auth-right" style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'48px 48px',
        background:'#080b14',
        overflowY:'auto',
      }}>
        <div style={{ width:'100%', maxWidth:440 }}>

          <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:36 }}>
            <Building2 style={{ width:22, height:22, color:'#a78bfa' }} />
            <span style={{ fontSize:16, fontWeight:800, color:'#f1f5f9' }}>InduoHouse</span>
          </Link>

          <div style={{ marginBottom:32 }}>
            <h1 style={{ fontSize:30, fontWeight:900, color:'#f1f5f9', margin:'0 0 8px', letterSpacing:'-0.03em' }}>
              Utwórz konto
            </h1>
            <p style={{ fontSize:14, color:'#475569', margin:0 }}>Wypełnij formularz — zajmie to mniej niż minutę</p>
          </div>

          <div style={{
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:22,
            padding:'36px 32px',
          }}>
            <form
              onSubmit={handleSubmit((data) => registerUser(data))}
              autoComplete="off"
              style={{ display:'flex', flexDirection:'column', gap:20 }}
            >

              {/* Imię + Nazwisko */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Imię</label>
                  <div style={{ position:'relative' }}>
                    <User size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:iconColor('firstName'), transition:'color 0.2s', pointerEvents:'none' }} />
                    <input
                      autoComplete="new-given-name"
                      style={inputStyle('firstName', !!errors.firstName)}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      {...register('firstName', { required: 'Imię jest wymagane' })}
                    />
                  </div>
                  {errors.firstName && <p style={{ margin:'6px 0 0', fontSize:12, color:'#f87171' }}>{errors.firstName.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Nazwisko</label>
                  <div style={{ position:'relative' }}>
                    <input
                      autoComplete="new-family-name"
                      style={inputStyleNoIcon('lastName', !!errors.lastName)}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      {...register('lastName', { required: 'Nazwisko jest wymagane' })}
                    />
                  </div>
                  {errors.lastName && <p style={{ margin:'6px 0 0', fontSize:12, color:'#f87171' }}>{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Adres email</label>
                <div style={{ position:'relative' }}>
                  <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:iconColor('email'), transition:'color 0.2s', pointerEvents:'none' }} />
                  <input
                    type="email"
                    autoComplete="new-email"
                    style={inputStyle('email', !!errors.email)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    {...register('email', {
                      required: 'Email jest wymagany',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Nieprawidłowy email' },
                    })}
                  />
                </div>
                {errors.email && <p style={{ margin:'6px 0 0', fontSize:12, color:'#f87171' }}>{errors.email.message}</p>}
              </div>

              {/* Telefon */}
              <div>
                <label style={{ ...labelStyle, display:'flex', justifyContent:'space-between' }}>
                  <span>Telefon</span>
                  <span style={{ color:'#334155', fontWeight:500, textTransform:'none', letterSpacing:0 }}>opcjonalne</span>
                </label>
                <div style={{ position:'relative' }}>
                  <Phone size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:iconColor('phoneNumber'), transition:'color 0.2s', pointerEvents:'none' }} />
                  <input
                    type="tel"
                    autoComplete="new-tel"
                    style={inputStyle('phoneNumber', !!errors.phoneNumber)}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField(null)}
                    {...register('phoneNumber')}
                  />
                </div>
              </div>

              {/* Hasło */}
              <div>
                <label style={labelStyle}>Hasło</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:iconColor('password'), transition:'color 0.2s', pointerEvents:'none' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    style={{ ...inputStyle('password', !!errors.password), paddingRight:50 }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    {...register('password', {
                      required: 'Hasło jest wymagane',
                      minLength: { value: 6, message: 'Min. 6 znaków' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                      color:'#475569', background:'none', border:'none',
                      cursor:'pointer', display:'flex', alignItems:'center', padding:4,
                      transition:'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password
                  ? <p style={{ margin:'6px 0 0', fontSize:12, color:'#f87171' }}>{errors.password.message}</p>
                  : <p style={{ margin:'7px 0 0', fontSize:12, color:'#334155' }}>Min. 6 znaków, najlepiej z cyfrą</p>
                }
              </div>

              <button type="submit" disabled={isRegistering} className="submit-btn" style={{ marginTop:4 }}>
                {isRegistering
                  ? <span style={{ width:20, height:20, borderRadius:'50%', border:'2.5px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite', display:'block' }} />
                  : <><ArrowRight size={17} /> Utwórz konto</>
                }
              </button>
            </form>
          </div>

          <p style={{ textAlign:'center', fontSize:14, color:'#475569', marginTop:28 }}>
            Masz już konto?{' '}
            <Link href="/login" style={{ color:'#a78bfa', textDecoration:'none', fontWeight:700 }}
              onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
              onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
