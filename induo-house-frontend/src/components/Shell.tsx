'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Building2, LogOut, Menu, Plus, UserRound, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const links = [
  { href: '/', label: 'Start' },
  { href: '/properties', label: 'Oferty' },
  { href: '/favorites', label: 'Ulubione' },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''} onClick={() => setOpen(false)}>
          {link.label}
        </Link>
      ))}
      {user && <Link href="/chat" onClick={() => setOpen(false)}>AI Doradca</Link>}
    </>
  );

  return (
    <div className="shell">
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            <span className="brand-mark"><Building2 size={20} /></span>
            InduoHouse
          </Link>
          <div className="nav-links">{navLinks}</div>
          <div className="nav-actions">
            {user ? (
              <>
                <Link href="/properties/create" className="nav-primary"><Plus size={17} /> Dodaj</Link>
                <Link href="/dashboard"><UserRound size={17} /> Panel</Link>
                <button onClick={logout} type="button"><LogOut size={17} /></button>
              </>
            ) : (
              <>
                <Link href="/login">Logowanie</Link>
                <Link href="/register" className="nav-primary">Załóż konto</Link>
              </>
            )}
          </div>
          <button className="icon-button mobile-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="mobile-menu">
            {navLinks}
            <Link href="/properties/create" className="nav-primary" onClick={() => setOpen(false)}><Plus size={17} /> Dodaj ogłoszenie</Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}><UserRound size={17} /> Panel</Link>
                <button type="button" onClick={() => { logout(); setOpen(false); }}><LogOut size={17} /> Wyloguj</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>Logowanie</Link>
                <Link href="/register" onClick={() => setOpen(false)}>Rejestracja</Link>
              </>
            )}
          </div>
        )}
      </nav>
      {children}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-brand">
              <span className="brand-mark"><Building2 size={20} /></span>
              InduoHouse
            </Link>
            <p>Nowy, profesjonalny front dla ogłoszeń nieruchomości: szybkie wyszukiwanie, piękne karty i wygodne zarządzanie ofertami.</p>
          </div>
          <FooterGroup title="Rynek" items={[['/properties?transactionType=SALE', 'Sprzedaż'], ['/properties?transactionType=RENT', 'Wynajem'], ['/properties?propertyType=APARTMENT', 'Mieszkania']]} />
          <FooterGroup title="Konto" items={[['/login', 'Logowanie'], ['/register', 'Rejestracja'], ['/dashboard', 'Panel']]} />
          <FooterGroup title="Narzędzia" items={[['/properties/create', 'Dodaj ofertę'], ['/favorites', 'Ulubione'], ['/chat', 'AI Doradca']]} />
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} InduoHouse</span>
          <span>Projekt frontendowy zbudowany od nowa.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h3>{title}</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}
      </div>
    </div>
  );
}
