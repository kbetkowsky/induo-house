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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080b14]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trzy kolumny: logo | nav | akcje */}
        <div className="grid grid-cols-3 items-center h-16">

          {/* Kolumna 1 – Logo (lewa) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-shadow">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Induo<span className="text-blue-400">House</span>
              </span>
            </Link>
          </div>

          {/* Kolumna 2 – Nawigacja (środek) */}
          <div className="hidden md:flex items-center justify-center gap-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/properties', label: 'Oferty' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? 'text-white bg-white/8'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Kolumna 3 – Akcje (prawa) */}
          <div className="hidden md:flex items-center justify-end gap-2">
            {isAgent && (
              <Link href="/properties/create">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
                  <Plus className="h-4 w-4" />
                  Dodaj ogłoszenie
                </button>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                    {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                  </div>
                  <span>{user.firstName ?? user.email}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  title="Wyloguj"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200"
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg"
                >
                  Zarejestruj
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle – wyrównany do prawej */}
          <div className="md:hidden flex items-center justify-end col-start-3">
            <button
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1117]/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-1">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Home</Link>
          <Link href="/properties" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Oferty</Link>
          {isAgent && (
            <Link href="/properties/create" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-sm font-medium transition-colors">
              + Dodaj ogłoszenie
            </Link>
          )}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Dashboard</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors">Wyloguj</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Zaloguj się</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium text-center transition-colors">Zarejestruj się</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
