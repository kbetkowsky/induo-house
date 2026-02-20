'use client';

import Link from 'next/link';
import { Building2, Home, Search, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ minHeight: '100vh', background: '#080b14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes blobMove {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(20px,-15px) scale(1.04); }
          66%      { transform: translate(-15px,10px) scale(0.97); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        .nf-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          animation: blobMove 16s ease-in-out infinite;
        }
        .nf-card {
          animation: fadeUp 0.6s ease both;
        }
        .nf-icon-wrap {
          animation: float 4s ease-in-out infinite;
        }
        .nf-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 14px;
          background: linear-gradient(135deg,#2563eb,#1d4ed8);
          color: #fff; text-decoration: none; font-size: 15px; font-weight: 700;
          box-shadow: 0 4px 20px rgba(37,99,235,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .nf-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,0.5); }
        .nf-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 24px; border-radius: 14px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          color: #94a3b8; text-decoration: none; font-size: 15px; font-weight: 600;
          transition: background 0.2s, color 0.2s;
        }
        .nf-btn-secondary:hover { background: rgba(255,255,255,0.09); color: #f1f5f9; }
        .nf-grid-bg {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
      `}</style>

      {/* Dekoracje */}
      <div className="nf-grid-bg" />
      <div className="nf-blob" style={{ width: 500, height: 500, background: 'rgba(37,99,235,0.12)', top: -150, right: -150, animationDelay: '0s' }} />
      <div className="nf-blob" style={{ width: 380, height: 380, background: 'rgba(124,58,237,0.09)', bottom: -100, left: -100, animationDelay: '-6s' }} />

      <div className="nf-card" style={{ textAlign: 'center', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* Ikona */}
        <div className="nf-icon-wrap" style={{ display: 'inline-flex', marginBottom: 32 }}>
          <div style={{ width: 100, height: 100, borderRadius: 28, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={48} style={{ color: '#60a5fa' }} />
          </div>
        </div>

        {/* Numer 404 */}
        <div style={{
          fontSize: 96, fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 20,
          letterSpacing: '-0.04em',
        }}>404</div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Strona nie istnieje
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 40 }}>
          Ogłoszenie mogło zostać usunięte, przeniesione lub podany adres jest nieprawidłowy.
        </p>

        {/* Przyciski */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="nf-btn-primary">
            <Home size={17} /> Strona główna
          </Link>
          <Link href="/properties" className="nf-btn-secondary">
            <Search size={17} /> Przeglądaj oferty
          </Link>
        </div>

        {/* Logo na dole */}
        <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Building2 size={16} style={{ color: '#334155' }} />
          <span style={{ fontSize: 13, color: '#334155', fontWeight: 700 }}>InduoHouse</span>
        </div>
      </div>
    </div>
  );
}
