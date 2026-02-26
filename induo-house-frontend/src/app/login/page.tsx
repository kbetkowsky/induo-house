'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types';
import Link from 'next/link';
import { Eye, EyeOff, Building2, ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const inputStyle = (name: string, hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    height: 54,
    padding: '0 16px 0 48px',
    borderRadius: 14,
    border: `1.5px solid ${
      hasError
        ? 'rgba(239,68,68,0.6)'
        : focusedField === name
        ? 'rgba(59,130,246,0.6)'
        : 'rgba(255,255,255,0.09)'
    }`,
    background: focusedField === name
      ? 'rgba(37,99,235,0.06)'
      : 'rgba(255,255,255,0.04)',
    color: '#e2e8f0',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: focusedField === name
      ? '0 0 0 3px rgba(59,130,246,0.1)'
      : 'none',
  });

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
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border: none; border-radius: 14px;
          color: #fff; font-size: 16px; font-weight: 700;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center; gap: 8px;
          font-family: inherit;
          box-shadow: 0 4px 20px rgba(37,99,235,0.4);
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          letter-spacing: -0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(37,99,235,0.5);
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
        background: 'linear-gradient(145deg,#0f1729 0%,#0d1d3e 50%,#0a1628 100%)',
        padding: '48px 56px',
        position: 'relative', overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="blob" style={{ width:420, height:420, background:'rgba(37,99,235,0.16)', top:-100, right:-100, animationDelay:'0s' }} />
        <div className="blob" style={{ width:320, height:320, background:'rgba(124,58,237,0.1)',  bottom:-60, left:-60,   animationDelay:'-5s' }} />
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
          backgroundSize:'40px 40px',
        }} />

        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', position:'relative', zIndex:1 }}>
          <div style={{ width:38, height:38, borderRadius:12, background:'rgba(37,99,235,0.2)', border:'1px solid rgba(37,99,235,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Building2 style={{ width:20, height:20, color:'#60a5fa' }} />
          </div>
          <span style={{ fontSize:18, fontWeight:800, color:'#f1f5f9', letterSpacing:'-0.02em' }}>InduoHouse</span>
        </Link>

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:1 }}>
          <div style={{ maxWidth:340 }}>
            <h2 style={{ fontSize:38, fontWeight:900, color:'#f1f5f9', lineHeight:1.1, marginBottom:16, letterSpacing:'-0.035em' }}>
              Witaj<br />z powrotem!
            </h2>
            <p style={{ fontSize:15, color:'#64748b', lineHeight:1.75, marginBottom:44 }}>
              Zaloguj się, aby zarządzać swoimi ogłoszeniami i przeglądać najnowsze oferty nieruchomości.
            </p>
            <div style={{ display:'flex', gap:12 }}>
              {[['10k+','Ofert'],['2k+','Agentów'],['99%','Zadowolonych']].map(([v,l]) => (
                <div key={l} style={{ padding:'14px 0', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center', flex:1 }}>
                  <div style={{ fontSize:20, fontWeight:900, color:'#60a5fa', letterSpacing:'-0.02em' }}>{v}</div>
                  <div style={{ fontSize:11, color:'#475569', marginTop:3, fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position:'relative', zIndex:1, display:'flex', gap:20, fontSize:12, color:'#334155' }}>
          <span>✓ Darmowe konto</span>
          <span>✓ Tysiące ofert</span>
          <span>✓ Bezpieczne transakcje</span>
        </div>
      </div>

      {/* ── PRAWA — formularz ── */}
      <div className="auth-right" style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'48px 48px',
        background:'#080b14',
      }}>
        <div style={{ width:'100%', maxWidth:440 }}>

          {/* Mobile logo */}
          <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:40 }}>
            <Building2 style={{ width:22, height:22, color:'#3b82f6' }} />
            <span style={{ fontSize:16, fontWeight:800, color:'#f1f5f9' }}>InduoHouse</span>
          </Link>

          <div style={{ marginBottom:36 }}>
            <h1 style={{ fontSize:30, fontWeight:900, color:'#f1f5f9', margin:'0 0 8px', letterSpacing:'-0.03em' }}>
              Zaloguj się
            </h1>
            <p style={{ fontSize:14, color:'#475569', margin:0 }}>Wprowadź dane swojego konta</p>
          </div>

          <div style={{
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:22,
            padding:'36px 32px',
          }}>
            <form
              onSubmit={handleSubmit((data) => login(data))}
              autoComplete="off"
              style={{ display:'flex', flexDirection:'column', gap:22 }}
            >
              {/* Email */}
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#64748b', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.07em' }}>
                  Adres email
                </label>
                <div style={{ position:'relative' }}>
                  <Mail size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color: focusedField === 'email' ? '#60a5fa' : '#475569', transition:'color 0.2s', pointerEvents:'none' }} />
                  <input
                    type="email"
                    autoComplete="new-email"
                    style={inputStyle('email', !!errors.email)}
                    onFocus={() => setFocusedField('email')}
                    {...register('email', {
                      required: 'Email jest wymagany',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Nieprawidłowy adres email' },
                      onBlur: () => setFocusedField(null),
                    })}
                  />
                </div>
                {errors.email && (
                  <p style={{ margin:'7px 0 0', fontSize:12, color:'#f87171' }}>{errors.email.message}</p>
                )}
              </div>

              {/* Hasło */}
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#64748b', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.07em' }}>
                  Hasło
                </label>
                <div style={{ position:'relative' }}>
                  <Lock size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color: focusedField === 'password' ? '#60a5fa' : '#475569', transition:'color 0.2s', pointerEvents:'none' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    style={{ ...inputStyle('password', !!errors.password), paddingRight:50 }}
                    onFocus={() => setFocusedField('password')}
                    {...register('password', {
                      required: 'Hasło jest wymagane',
                      minLength: { value: 6, message: 'Min. 6 znaków' },
                      onBlur: () => setFocusedField(null),
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
                  ? <p style={{ margin:'7px 0 0', fontSize:12, color:'#f87171' }}>{errors.password.message}</p>
                  : <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
                      <Link href="/forgot-password" style={{ fontSize:12, color:'#3b82f6', textDecoration:'none', fontWeight:600 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                        onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}
                      >
                        Zapomniałeś hasła?
                      </Link>
                    </div>
                }
              </div>

              <button type="submit" disabled={isLoggingIn} className="submit-btn" style={{ marginTop:4 }}>
                {isLoggingIn
                  ? <span style={{ width:20, height:20, borderRadius:'50%', border:'2.5px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite', display:'block' }} />
                  : <><ArrowRight size={17} /> Zaloguj się</>
                }
              </button>
            </form>
          </div>

          <p style={{ textAlign:'center', fontSize:14, color:'#475569', marginTop:28 }}>
            Nie masz konta?{' '}
            <Link href="/register" style={{ color:'#3b82f6', textDecoration:'none', fontWeight:700 }}
              onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
              onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
