'use client';

import { useState, useEffect, useRef } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import { getProperties } from '@/lib/properties';
import { Property } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import {
  Building2, ChevronLeft, ChevronRight, Search,
  TrendingUp, Shield, Zap, ArrowRight, MapPin, Star
} from 'lucide-react';

const W = '100%';
const MAX = '1280px';
const centerBox = {
  width: W,
  maxWidth: MAX,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
} as const;

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: '#111827', overflow: 'hidden' }}>
      <div style={{ aspectRatio: '16/10' }} className="skeleton" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 14, borderRadius: 8, width: '75%' }} className="skeleton" />
        <div style={{ height: 12, borderRadius: 8, width: '50%' }} className="skeleton" />
        <div style={{ height: 12, borderRadius: 8, width: '35%' }} className="skeleton" />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
        <div style={{ height: 18, borderRadius: 8, width: '45%' }} className="skeleton" />
      </div>
    </div>
  );
}

const STATS = [
  { value: '2 400+', label: 'Aktywnych ofert',       icon: Building2 },
  { value: '32',     label: 'Miast w Polsce',         icon: MapPin    },
  { value: '98%',    label: 'Zadowolonych klientów',  icon: Star      },
];

const FEATURES = [
  { icon: Zap,       title: 'Błyskawiczne wyszukiwanie', desc: 'Tysiące ofert w zasięgu ręki. Filtruj po lokalizacji, cenie i typie.' },
  { icon: Shield,    title: 'Zweryfikowani agenci',       desc: 'Każdy agent przechodzi weryfikację. Twoje bezpieczeństwo to nasz priorytet.' },
  { icon: TrendingUp,title: 'Aktualne ceny rynkowe',      desc: 'Dane aktualizowane w czasie rzeczywistym. Zawsze wiesz ile warto zapłacić.' },
];

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchProperties(); }, [currentPage]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProperties({ page: currentPage, size: 12 });
      setProperties(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Nie udało się pobrać ofert.');
    } finally {
      setIsLoading(false);
    }
  };

  const changePage = (next: number) => {
    setCurrentPage(next);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080b14', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1.5rem',
        overflow: 'hidden',
        width: '100%',
      }}>
        {/* orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'rgba(37,99,235,0.07)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', top: '33%', left: '20%', width: 400, height: 400, background: 'rgba(139,92,246,0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 350, height: 350, background: 'rgba(96,165,250,0.04)', borderRadius: '50%', filter: 'blur(80px)' }} />
        </div>

        {/* grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.015,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* content */}
        <div
          className="animate-fade-up"
          style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '860px', width: '100%' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500,
            marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', animation: 'pulse 2s infinite' }} />
            Portal nieruchomości premium w Polsce
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24 }}>
            <span className="gradient-text">Znajdź swoje</span>
            <br />
            <span className="gradient-text-blue">wymarzone miejsce</span>
          </h1>

          <p style={{ color: '#64748b', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Tysiące ofert nieruchomości w całej Polsce. Mieszkania, domy, działki — kup lub wynajmij z nami.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <a href="#listings" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 12,
                background: '#2563eb', color: 'white',
                fontWeight: 600, fontSize: '0.9rem',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
                transition: 'all 0.2s',
              }}>
                <Search size={16} />
                Przeglądaj oferty
                <ArrowRight size={16} />
              </button>
            </a>
            {!user && (
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#cbd5e1', fontWeight: 600, fontSize: '0.9rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  Zarejestruj się za darmo
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* stats */}
        <div
          className="animate-fade-in"
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 560, padding: '0 1.5rem' }}
        >
          <div className="glass" style={{ borderRadius: 16, padding: '16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {STATS.map(({ value, label }, i) => (
              <div key={label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '0 16px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{value}</p>
                <p style={{ fontSize: '0.72rem', color: '#475569', textAlign: 'center', lineHeight: 1.3 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div className="animate-float" style={{ position: 'absolute', bottom: 130, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#334155' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #334155, transparent)' }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ width: '100%', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={centerBox}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Dlaczego InduoHouse</p>
            <h2 className="gradient-text" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700 }}>Nieruchomości po nowemu</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass card-hover" style={{ borderRadius: 16, padding: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(37,99,235,0.12)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={20} color="#60a5fa" />
                </div>
                <h3 style={{ fontWeight: 600, color: 'white', marginBottom: 8, fontSize: '0.95rem' }}>{title}</h3>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LISTINGS ── */}
      <section
        id="listings"
        ref={listRef}
        style={{ width: '100%', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div style={centerBox}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Dostępne oferty</p>
              <h2 className="gradient-text" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700 }}>Najnowsze ogłoszenia</h2>
              {!isLoading && totalElements > 0 && (
                <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: 6 }}>
                  Znaleziono <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{totalElements}</span> ofert
                </p>
              )}
            </div>
            <Link href="/properties" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent', color: '#94a3b8',
                fontSize: '0.85rem', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                Zobacz wszystkie <ArrowRight size={15} />
              </button>
            </Link>
          </div>

          {/* grid */}
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="glass" style={{ borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', marginBottom: 16 }}>{error}</p>
              <button onClick={fetchProperties} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}>Spróbuj ponownie</button>
            </div>
          ) : properties.length === 0 ? (
            <div className="glass" style={{ borderRadius: 16, padding: '64px 24px', textAlign: 'center' }}>
              <Building2 size={48} color="#1e293b" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: '#cbd5e1', fontWeight: 600, marginBottom: 8 }}>Brak ofert</h3>
              <p style={{ color: '#334155', fontSize: '0.875rem' }}>Nie znaleziono żadnych nieruchomości.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>

              {/* pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 48 }}>
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 0}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '9px 18px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent', color: '#94a3b8',
                      fontSize: '0.85rem', fontWeight: 500,
                      cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 0 ? 0.3 : 1,
                    }}
                  >
                    <ChevronLeft size={16} /> Poprzednia
                  </button>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 2 ? i
                        : currentPage >= totalPages - 3 ? totalPages - 5 + i
                        : currentPage - 2 + i;
                      if (page < 0 || page >= totalPages) return null;
                      return (
                        <button
                          key={page}
                          onClick={() => changePage(page)}
                          style={{
                            width: 36, height: 36, borderRadius: 8,
                            fontSize: '0.85rem', fontWeight: 500,
                            border: page === currentPage ? 'none' : '1px solid rgba(255,255,255,0.08)',
                            background: page === currentPage ? '#2563eb' : 'transparent',
                            color: page === currentPage ? 'white' : '#64748b',
                            cursor: 'pointer',
                            boxShadow: page === currentPage ? '0 4px 14px rgba(37,99,235,0.35)' : 'none',
                          }}
                        >
                          {page + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '9px 18px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent', color: '#94a3b8',
                      fontSize: '0.85rem', fontWeight: 500,
                      cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage >= totalPages - 1 ? 0.3 : 1,
                    }}
                  >
                    Następna <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 0' }}>
        <div style={{ ...centerBox, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Induo<span style={{ color: '#60a5fa' }}>House</span></span>
          </Link>
          <p style={{ color: '#334155', fontSize: '0.8rem' }}>© 2026 InduoHouse. Wszelkie prawa zastrzeżone.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="#" style={{ color: '#334155', fontSize: '0.8rem', textDecoration: 'none' }}>Polityka prywatności</Link>
            <Link href="#" style={{ color: '#334155', fontSize: '0.8rem', textDecoration: 'none' }}>Regulamin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
