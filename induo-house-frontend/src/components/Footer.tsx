'use client';

import Link from 'next/link';
import { Building2, Github, Twitter, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const NAV: Record<string, { href: string; label: string }[]> = {
  Oferty: [
    { href: '/properties?transactionType=SALE',      label: 'Na sprzedaż' },
    { href: '/properties?transactionType=RENT',      label: 'Do wynajęcia' },
    { href: '/properties?propertyType=APARTMENT',   label: 'Mieszkania' },
    { href: '/properties?propertyType=HOUSE',        label: 'Domy' },
    { href: '/properties?propertyType=LAND',         label: 'Działki' },
  ],
  Konto: [
    { href: '/login',               label: 'Zaloguj się' },
    { href: '/register',            label: 'Zarejestruj się' },
    { href: '/dashboard',           label: 'Dashboard' },
    { href: '/dashboard/favorites', label: 'Ulubione' },
  ],
  Firma: [
    { href: '#', label: 'O nas' },
    { href: '#', label: 'Kontakt' },
    { href: '#', label: 'Regulamin' },
    { href: '#', label: 'Polityka prywatności' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--footer-bg)',
      borderTop: '1px solid var(--footer-border)',
      fontFamily: 'var(--font-inter), system-ui, sans-serif',
    }}>
      <style>{`
        .footer-link {
          display: block; font-size: 13px;
          color: var(--text-muted);
          text-decoration: none; padding: 4px 0;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--text-secondary); }
        .footer-social {
          width: 34px; height: 34px; border-radius: 10px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); text-decoration: none;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .footer-social:hover {
          background: var(--accent-surface);
          border-color: var(--border-hover);
          color: var(--accent-bright);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 500px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 24px 40px' }}>
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                <Building2 style={{ width: 18, height: 18, color: '#fff' }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Induo<span style={{ color: 'var(--accent-bright)' }}>House</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 260, margin: '0 0 18px' }}>
              Nowoczesna platforma nieruchomości. Tysiące ofert mieszkań, domów i działek w całej Polsce.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
              {[
                { icon: <MapPin size={12}/>, text: 'Kraków, Polska' },
                { icon: <Mail size={12}/>,   text: 'kontakt@induohouse.pl' },
                { icon: <Phone size={12}/>,  text: '+48 000 000 000' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent-bright)', display: 'flex' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { href: '#', icon: <Github size={15} /> },
                { href: '#', icon: <Twitter size={15} /> },
                { href: '#', icon: <Linkedin size={15} /> },
              ].map((s, i) => (
                <a key={i} href={s.href} className="footer-social">{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Kolumny */}
          {Object.entries(NAV).map(([title, items]) => (
            <div key={title}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>
                {title}
              </p>
              <nav style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map(({ href, label }) => (
                  <Link key={label} href={href} className="footer-link">{label}</Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--footer-border)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12, color: 'var(--text-faint)', margin: 0 }}>
            © {year} InduoHouse. Wszelkie prawa zastrzeżone.
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-faint)', margin: 0 }}>
            Zbudowano z ❤️ w Polsce
          </p>
        </div>
      </div>
    </footer>
  );
}
