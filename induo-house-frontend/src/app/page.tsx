'use client';

import { useState, useEffect, useRef, CSSProperties } from 'react';
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

const PAGE: CSSProperties = {
  width: '100%',
  maxWidth: '100vw',
  minHeight: '100vh',
  background: '#080b14',
  overflowX: 'hidden',
};

const SECTION: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
};

const INNER: CSSProperties = {
  display: 'block',
  width: '100%',
  maxWidth: 1280,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 24,
  paddingRight: 24,
  boxSizing: 'border-box',
};

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: '#0f1623', overflow: 'hidden' }}>
      <div style={{ paddingTop: '62.5%' }} className="skeleton" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 14, borderRadius: 6, width: '70%' }} className="skeleton" />
        <div style={{ height: 12, borderRadius: 6, width: '45%' }} className="skeleton" />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '4px 0' }} />
        <div style={{ height: 18, borderRadius: 6, width: '40%' }} className="skeleton" />
      </div>
    </div>
  );
}

const STATS = [
  { value: '2 400+', label: 'Aktywnych ofert',        icon: Building2 },
  { value: '32',     label: 'Miast w Polsce',          icon: MapPin    },
  { value: '98%',    label: 'Zadowolonych klient\u00f3w', icon: Star   },
];

const FEATURES = [
  { icon: Zap,        title: 'B\u0142yskawiczne wyszukiwanie', desc: 'Tysi\u0105ce ofert w zasi\u0119gu r\u0119ki. Filtruj po lokalizacji, cenie i typie nieruchomo\u015bci.' },
  { icon: Shield,     title: 'Zweryfikowani agenci',           desc: 'Ka\u017cdy agent przechodzi weryfikacj\u0119 to\u017csamo\u015bci. Twoje bezpiecze\u0144stwo jest naszym priorytetem.' },
  { icon: TrendingUp, title: 'Aktualne ceny rynkowe',          desc: 'Dane aktualizowane na bie\u017c\u0105co. Zawsze wiesz, ile naprawd\u0119 warto zap\u0142aci\u0107.' },
];

// ─── Mouse parallax hook ──────────────────────────────────────────────────────
function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // normalise to -1 … +1
      target.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    const tick = () => {
      // smooth lerp so motion feels silky
      setPos(prev => ({
        x: prev.x + (target.current.x - prev.x) * 0.06,
        y: prev.y + (target.current.y - prev.y) * 0.06,
      }));
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return pos;
}

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties]       = useState<Property[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [currentPage, setCurrentPage]     = useState(0);
  const [totalPages, setTotalPages]       = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError]                 = useState<string | null>(null);
  const listRef = useRef<HTMLElement>(null);
  const mouse = useMouseParallax();

  useEffect(() => { fetchProperties(); }, [currentPage]);

  async function fetchProperties() {
    try {
      setIsLoading(true); setError(null);
      const data = await getProperties({ page: currentPage, size: 12 });
      setProperties(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Nie uda\u0142o si\u0119 pobra\u0107 ofert.');
    } finally {
      setIsLoading(false);
    }
  }

  function changePage(next: number) {
    setCurrentPage(next);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // orb offsets – each orb moves at different speed for depth illusion
  const o1 = { x: mouse.x * 28, y: mouse.y * 28 }; // main centre orb
  const o2 = { x: mouse.x * -18, y: mouse.y * -18 }; // violet orb
  const o3 = { x: mouse.x * 14, y: mouse.y * 14 }; // blue-right orb

  return (
    <div style={PAGE}>
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section style={{
        ...SECTION,
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 200px',
        overflow: 'hidden',
      }}>
        {/* parallax orbs */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* orb 1 – big blue centre */}
          <div style={{
            position: 'absolute',
            top: `calc(22% + ${o1.y}px)`,
            left: `calc(50% + ${o1.x}px)`,
            transform: 'translate(-50%, -50%)',
            width: 820, height: 820,
            background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, transparent 68%)',
            borderRadius: '50%',
            willChange: 'top, left',
          }} />
          {/* orb 2 – violet left */}
          <div style={{
            position: 'absolute',
            top: `calc(42% + ${o2.y}px)`,
            left: `calc(14% + ${o2.x}px)`,
            transform: 'translate(-50%, -50%)',
            width: 520, height: 520,
            background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 68%)',
            borderRadius: '50%',
            willChange: 'top, left',
          }} />
          {/* orb 3 – blue right */}
          <div style={{
            position: 'absolute',
            top: `calc(60% + ${o3.y}px)`,
            left: `calc(82% + ${o3.x}px)`,
            transform: 'translate(-50%, -50%)',
            width: 420, height: 420,
            background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 68%)',
            borderRadius: '50%',
            willChange: 'top, left',
          }} />
        </div>

        {/* dot grid – static */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.32,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* content */}
        <div className="anim-fade-up" style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', maxWidth: 780 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 32,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            Portal nieruchomo\u015bci premium w Polsce
          </div>

          <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.035em', marginBottom: 22 }}>
            <span className="grad-text">Znajd\u017a swoje</span><br />
            <span className="grad-text-blue">wymarzone miejsce</span>
          </h1>

          <p style={{ color: '#64748b', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Tysi\u0105ce ofert nieruchomo\u015bci w ca\u0142ej Polsce.
            Mieszkania, domy, dzia\u0142ki \u2014 kup lub wynajmij z nami.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            <a href="#listings" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '13px 28px', borderRadius: 12,
                background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color: '#fff', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(37,99,235,0.40)',
                letterSpacing: '-0.01em',
              }}>
                <Search size={16} /> Przegl\u0105daj oferty <ArrowRight size={15} />
              </button>
            </a>
            {!user && (
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#cbd5e1', fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', letterSpacing: '-0.01em',
                }}>
                  Zarejestruj si\u0119 za darmo
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* stats */}
        <div className="anim-fade-in" style={{
          position: 'absolute', bottom: 48,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 540, padding: '0 24px',
          boxSizing: 'border-box',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
          }}>
            {STATS.map(({ value, label }, idx) => (
              <div key={label} style={{
                padding: '16px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                borderRight: idx < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: 11, color: '#475569', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div className="anim-float" style={{
          position: 'absolute', bottom: 160, left: '50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          color: '#1e293b',
        }}>
          <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>scroll</span>
          <div style={{ width: 1, height: 30, background: 'linear-gradient(to bottom, #1e293b, transparent)' }} />
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section style={{ ...SECTION, padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={INNER}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Dlaczego InduoHouse</p>
            <h2 className="grad-text" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.025em' }}>Nieruchomo\u015bci po nowemu</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-lift" style={{
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.025)',
                padding: 28,
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 13,
                  background: 'rgba(37,99,235,0.12)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 22,
                }}>
                  <Icon size={22} color="#60a5fa" />
                </div>
                <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#475569', fontSize: 13.5, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ LISTINGS ══════════ */}
      <section
        id="listings"
        ref={listRef as React.RefObject<HTMLElement>}
        style={{ ...SECTION, padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div style={INNER}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Dost\u0119pne oferty</p>
              <h2 className="grad-text" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.025em' }}>Najnowsze og\u0142oszenia</h2>
              {!isLoading && totalElements > 0 && (
                <p style={{ color: '#334155', fontSize: 13, marginTop: 8 }}>
                  Znaleziono <span style={{ color: '#94a3b8', fontWeight: 600 }}>{totalElements}</span> ofert
                </p>
              )}
            </div>
            <Link href="/properties" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent', color: '#94a3b8',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>
                Zobacz wszystkie <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', marginBottom: 16 }}>{error}</p>
              <button onClick={fetchProperties} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#cbd5e1', fontSize: 13, cursor: 'pointer' }}>Spr\u00f3buj ponownie</button>
            </div>
          ) : properties.length === 0 ? (
            <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '72px 24px', textAlign: 'center' }}>
              <Building2 size={44} color="#1e293b" style={{ margin: '0 auto 16px', display: 'block' }} />
              <h3 style={{ color: '#cbd5e1', fontWeight: 700, marginBottom: 8 }}>Brak ofert</h3>
              <p style={{ color: '#334155', fontSize: 13 }}>Nie znaleziono \u017cadnych nieruchomo\u015bci.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
                {properties.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 52 }}>
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 0}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '9px 18px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: currentPage === 0 ? '#1e293b' : '#94a3b8',
                      fontSize: 13, fontWeight: 500,
                      cursor: currentPage === 0 ? 'default' : 'pointer',
                    }}
                  >
                    <ChevronLeft size={15} /> Poprzednia
                  </button>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = currentPage <= 2 ? i
                        : currentPage >= totalPages - 3 ? totalPages - 5 + i
                        : currentPage - 2 + i;
                      if (p < 0 || p >= totalPages) return null;
                      const active = p === currentPage;
                      return (
                        <button key={p} onClick={() => changePage(p)} style={{
                          width: 36, height: 36, borderRadius: 8,
                          fontSize: 13, fontWeight: 600,
                          border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          background: active ? '#2563eb' : 'transparent',
                          color: active ? '#fff' : '#64748b',
                          cursor: 'pointer',
                          boxShadow: active ? '0 4px 16px rgba(37,99,235,0.4)' : 'none',
                        }}>{p + 1}</button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '9px 18px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: currentPage >= totalPages - 1 ? '#1e293b' : '#94a3b8',
                      fontSize: 13, fontWeight: 500,
                      cursor: currentPage >= totalPages - 1 ? 'default' : 'pointer',
                    }}
                  >
                    Nast\u0119pna <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ ...SECTION, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 0' }}>
        <div style={{ ...INNER, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={14} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: 15, letterSpacing: '-0.02em' }}>Induo<span style={{ color: '#60a5fa' }}>House</span></span>
          </Link>
          <p style={{ color: '#1e293b', fontSize: 12 }}>\u00a9 2026 InduoHouse. Wszelkie prawa zastrze\u017cone.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="#" style={{ color: '#1e293b', fontSize: 12, textDecoration: 'none' }}>Polityka prywatno\u015bci</Link>
            <Link href="#" style={{ color: '#1e293b', fontSize: 12, textDecoration: 'none' }}>Regulamin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
