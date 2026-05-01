'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Building2, Heart, LogOut, Menu, Moon, Plus, Sun, UserRound, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const NAV_ITEMS = [
  { href: '/', label: 'Start' },
  { href: '/properties', label: 'Oferty' },
  { href: '/favorites', label: 'Ulubione' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const navLinks = (
    <>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? 'active' : ''}
          onClick={() => setOpen(false)}
        >
          {item.label}
        </Link>
      ))}
      {user && (
        <Link href="/chat" className={pathname === '/chat' ? 'active' : ''} onClick={() => setOpen(false)}>
          AI Chat
        </Link>
      )}
    </>
  );

  return (
    <nav className={scrolled ? 'site-nav scrolled' : 'site-nav'}>
      <div className="site-nav-inner">
        <Link href="/" className="site-logo" aria-label="InduoHouse">
          <span>
            <Building2 size={21} />
          </span>
          InduoHouse
        </Link>

        <div className="site-nav-links">{navLinks}</div>

        <div className="site-nav-actions">
          <button type="button" className="site-icon-button" onClick={toggleTheme} title={isDark ? 'Jasny motyw' : 'Ciemny motyw'}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <Link href="/properties/create" className="site-add-button">
                <Plus size={17} />
                Dodaj
              </Link>
              <Link href="/dashboard" className="site-user-pill">
                <UserRound size={16} />
                {user.firstName ?? user.email}
              </Link>
              <button type="button" className="site-icon-button" onClick={logout} title="Wyloguj">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="site-login-link">
                Zaloguj
              </Link>
              <Link href="/register" className="site-add-button">
                Konto
              </Link>
            </>
          )}
        </div>

        <button type="button" className="site-mobile-button" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {open && (
        <div className="site-mobile-menu">
          {navLinks}
          <Link href="/properties/create" onClick={() => setOpen(false)}>
            <Plus size={16} />
            Dodaj ogłoszenie
          </Link>
          <button type="button" onClick={toggleTheme}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Jasny motyw' : 'Ciemny motyw'}
          </button>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <UserRound size={16} />
                Panel
              </Link>
              <button type="button" onClick={() => { logout(); setOpen(false); }}>
                <LogOut size={16} />
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                <UserRound size={16} />
                Zaloguj
              </Link>
              <Link href="/favorites" onClick={() => setOpen(false)}>
                <Heart size={16} />
                Ulubione
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
