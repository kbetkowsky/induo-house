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

// Skeleton card
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#111827] overflow-hidden">
      <div className="aspect-[16/10] skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-1/2" />
        <div className="h-3 skeleton rounded-lg w-1/3" />
        <div className="h-px bg-white/5 my-1" />
        <div className="h-5 skeleton rounded-lg w-2/5" />
      </div>
    </div>
  );
}

const STATS = [
  { value: '2,400+', label: 'Aktywnych ofert', icon: Building2 },
  { value: '32', label: 'Miast w Polsce', icon: MapPin },
  { value: '98%', label: 'Zadowolonych klientów', icon: Star },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Błyskawiczne wyszukiwanie',
    desc: 'Tysiące ofert w zasięgu ręki. Filtruj po lokalizacji, cenie i typie.',
  },
  {
    icon: Shield,
    title: 'Zweryfikowani agenci',
    desc: 'Każdy agent przechodzi weryfikację. Twoje bezpieczeństwo to nasz priorytet.',
  },
  {
    icon: TrendingUp,
    title: 'Aktualne ceny rynkowe',
    desc: 'Dane aktualizowane w czasie rzeczywistym. Zawsze wiesz ile warto zapłacić.',
  },
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

  useEffect(() => {
    fetchProperties();
  }, [currentPage]);

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
    <div className="min-h-screen bg-[#080b14]">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">

        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-up">
          {/* Label pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm text-xs text-slate-400 font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Portal nieruchomości premium w Polsce
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            <span className="gradient-text">Znajdź swoje</span>
            <br />
            <span className="gradient-text-blue">wymarzone miejsce</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Tysiące ofert nieruchomości w całej Polsce. Mieszkania, domy, działki — kup lub wynajmij z nami.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#listings">
              <button className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5">
                <Search className="h-4 w-4" />
                Przeglądaj oferty
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>

            {!user && (
              <Link href="/register">
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 text-slate-300 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5">
                  Zarejestruj się za darmo
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats bottom */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 animate-fade-in">
          <div className="glass rounded-2xl p-4 grid grid-cols-3 divide-x divide-white/6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-4">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 text-center leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-float">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-24 px-4 border-t border-white/4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">Dlaczego InduoHouse</p>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Nieruchomości po nowemu</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="glass rounded-2xl p-6 group hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-600/25 transition-colors">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── LISTINGS ───── */}
      <section id="listings" ref={listRef} className="py-24 px-4 border-t border-white/4">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-2">Dostępne oferty</p>
              <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
                Najnowsze ogłoszenia
              </h2>
              {!isLoading && totalElements > 0 && (
                <p className="text-slate-500 text-sm mt-2">
                  Znaleziono <span className="text-slate-300 font-medium">{totalElements}</span> ofert
                </p>
              )}
            </div>
            <Link href="/properties">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-slate-400 hover:text-white hover:border-white/15 text-sm font-medium transition-all duration-200">
                Zobacz wszystkie
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-slate-400 mb-4">{error}</p>
              <button onClick={fetchProperties} className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 text-sm transition-colors">
                Spróbuj ponownie
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <Building2 className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-slate-300 font-semibold mb-2">Brak ofert</h3>
              <p className="text-slate-600 text-sm">Nie znaleziono żadnych nieruchomości.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/8 text-slate-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Poprzednia
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 2
                        ? i
                        : currentPage >= totalPages - 3
                        ? totalPages - 5 + i
                        : currentPage - 2 + i;
                      if (page < 0 || page >= totalPages) return null;
                      return (
                        <button
                          key={page}
                          onClick={() => changePage(page)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                            page === currentPage
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                              : 'border border-white/8 text-slate-500 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {page + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/8 text-slate-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Następna
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-white" />
            </div>
            Induo<span className="text-blue-400">House</span>
          </Link>
          <p className="text-slate-600 text-sm">
            © 2026 InduoHouse. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="#" className="hover:text-slate-400 transition-colors">Polityka prywatności</Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">Regulamin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
