'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Building2, LogOut, Plus, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

const MAX_W = 1280;

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [mobile, setMobile]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const isAgent = user?.role === 'AGENT' || user?.role === 'ADMIN';

  const isDark = theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      style={{
        padding: '6px 16px', borderRadius: 8,
        fontSize: 14, fontWeight: 500, textDecoration: 'none',
        transition: 'all 0.2s',
        background: pathname === href ? 'var(--accent-surface)' : 'transparent',
        color: pathname === href ? 'var(--accent-light)' : 'var(--navbar-text-muted)',
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 100,
      transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
      background: scrolled ? 'var(--navbar-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled
        ? '1px solid var(--navbar-border)'
        : '1px solid transparent',
    }}>
      <div style={{ width: '100%', maxWidth: MAX_W, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(37,99,235,0.45)',
            }}>
              <Building2 size={17} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--navbar-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Induo<span style={{ color: 'var(--accent-bright)' }}>House</span>
            </span>
          </Link>

          {/* Desktop center links */}
          {!mobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {navLink('/', 'Home')}
              {navLink('/properties', 'Oferty')}
            </div>
          )}

          {/* Desktop right */}
          {!mobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                title={isDark ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
                style={{
                  width: 34, height: 34, borderRadius: 8, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {isAgent && (
                <Link href="/properties/create" style={{ textDecoration: 'none' }}>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 16px', borderRadius: 9,
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 14px var(--accent-shadow)',
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                  >
                    <Plus size={14} /> Dodaj ogłoszenie
                  </button>
                </Link>
              )}

              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Link href="/dashboard" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', borderRadius: 9,
                    color: 'var(--text-muted)', textDecoration: 'none',
                    fontSize: 13, fontWeight: 500,
                    transition: 'color 0.2s',
                  }}>
                    <div style={{
                      width: 27, height: 27, borderRadius: 7,
                      background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>
                      {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                    </div>
                    {user.firstName ?? user.email}
                  </Link>
                  <button onClick={logout} title="Wyloguj" style={{
                    padding: 7, borderRadius: 8, border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link href="/login" style={{
                    padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 500,
                    color: 'var(--navbar-text-muted)', textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}>
                    Zaloguj się
                  </Link>
                  <Link href="/register" style={{
                    padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                    background: 'var(--accent)', color: '#fff', textDecoration: 'none',
                    boxShadow: '0 2px 10px var(--accent-shadow)',
                    transition: 'background 0.2s',
                  }}>
                    Zarejestruj
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile burger */}
          {mobile && (
            <button onClick={() => setOpen(!open)} style={{
              padding: 8, borderRadius: 8, border: 'none',
              background: 'transparent', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
            }}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobile && open && (
        <div style={{
          background: 'var(--navbar-bg)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--navbar-border)',
          padding: '8px 16px 16px',
        }}>
          {[{ href: '/', label: 'Home' }, { href: '/properties', label: 'Oferty' }].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '10px 12px', borderRadius: 8,
              color: 'var(--text-secondary)', textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
            }}>
              {label}
            </Link>
          ))}
          {isAgent && (
            <Link href="/properties/create" onClick={() => setOpen(false)} style={{
              display: 'block', padding: '10px 12px', borderRadius: 8,
              color: 'var(--accent-bright)', textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
            }}>+ Dodaj ogłoszenie</Link>
          )}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Dashboard</Link>
              <button onClick={() => { logout(); setOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: '#f87171', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Wyloguj</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Zaloguj się</Link>
              <Link href="/register" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, background: 'var(--accent)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, textAlign: 'center', marginTop: 4 }}>Zarejestruj się</Link>
            </>
          )}
          {/* Theme toggle mobile */}
          <button onClick={toggleTheme} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '10px 12px', borderRadius: 8,
            border: 'none', background: 'transparent',
            color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            {isDark ? 'Jasny motyw' : 'Ciemny motyw'}
          </button>
        </div>
      )}
    </nav>
  );
}
