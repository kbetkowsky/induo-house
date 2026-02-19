'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Building2, LogOut, Plus, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAgent = user?.role === 'AGENT' || user?.role === 'ADMIN';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(8,11,20,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
    >
      {/* Inner container - centered */}
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: '64px',
          }}
        >
          {/* Logo - left */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(37,99,235,0.4)',
              }}>
                <Building2 size={16} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white', letterSpacing: '-0.02em' }}>
                Induo<span style={{ color: '#60a5fa' }}>House</span>
              </span>
            </Link>
          </div>

          {/* Nav links - center */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 4 }}>
            {[{ href: '/', label: 'Home' }, { href: '/properties', label: 'Oferty' }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: pathname === href ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: pathname === href ? 'white' : '#94a3b8',
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions - right */}
          <div className="hidden md:flex" style={{ alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
            {isAgent && (
              <Link href="/properties/create">
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', borderRadius: 8,
                  background: '#2563eb', color: 'white',
                  fontSize: '0.875rem', fontWeight: 500,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                }}>
                  <Plus size={15} />
                  Dodaj ogłoszenie
                </button>
              </Link>
            )}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Link href="/dashboard" style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', borderRadius: 8,
                  color: '#94a3b8', textDecoration: 'none',
                  fontSize: '0.875rem', fontWeight: 500,
                  transition: 'all 0.2s',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: 'white',
                  }}>
                    {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                  </div>
                  {user.firstName ?? user.email}
                </Link>
                <button
                  onClick={logout}
                  title="Wyloguj"
                  style={{
                    padding: 8, borderRadius: 8, border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: '#475569', transition: 'all 0.2s',
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href="/login" style={{
                  padding: '7px 16px', borderRadius: 8,
                  fontSize: '0.875rem', fontWeight: 500,
                  color: '#94a3b8', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>Zaloguj się</Link>
                <Link href="/register" style={{
                  padding: '7px 16px', borderRadius: 8,
                  fontSize: '0.875rem', fontWeight: 600,
                  background: 'white', color: '#111827',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>Zarejestruj</Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <div className="md:hidden" style={{ display: 'flex', justifyContent: 'flex-end', gridColumn: 3 }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(13,17,23,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '12px 24px 16px',
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Home</Link>
          <Link href="/properties" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Oferty</Link>
          {isAgent && (
            <Link href="/properties/create" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, color: '#60a5fa', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>+ Dodaj ogłoszenie</Link>
          )}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Dashboard</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: '#f87171', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>Wyloguj</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Zaloguj się</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 12px', borderRadius: 8, background: '#2563eb', color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, textAlign: 'center', marginTop: 4 }}>Zarejestruj się</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
