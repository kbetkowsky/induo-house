// induo-house-frontend/src/app/properties/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertyCard } from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import { getProperties, PropertyFilters } from '@/lib/properties';
import { Property } from '@/types';
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  Building2, X
} from 'lucide-react';

const PROPERTY_TYPES = [
  { value: '', label: 'Wszystkie typy' },
  { value: 'APARTMENT', label: 'Mieszkanie' },
  { value: 'HOUSE', label: 'Dom' },
  { value: 'LAND', label: 'Działka' },
  { value: 'COMMERCIAL', label: 'Komercyjne' },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function PropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- state filtrów (inicjalizacja z URL params) ---
  const [city, setCity]               = useState(searchParams.get('city') ?? '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') ?? '');
  const [minPrice, setMinPrice]       = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice]       = useState(searchParams.get('maxPrice') ?? '');
  const [minArea, setMinArea]         = useState(searchParams.get('minArea') ?? '');
  const [maxArea, setMaxArea]         = useState(searchParams.get('maxArea') ?? '');
  const [bedrooms, setBedrooms]       = useState(searchParams.get('bedrooms') ?? '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // --- state wyników ---
  const [properties, setProperties]       = useState<Property[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [currentPage, setCurrentPage]     = useState(Number(searchParams.get('page') ?? 0));
  const [totalPages, setTotalPages]       = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);

  // debounce pól tekstowych żeby nie strzelać requestem przy każdym znaku
  const debouncedCity     = useDebounce(city, 400);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);
  const debouncedMinArea  = useDebounce(minArea, 500);
  const debouncedMaxArea  = useDebounce(maxArea, 500);

  // --- budowanie filtrów z aktualnego stanu ---
  const buildFilters = useCallback((): PropertyFilters => ({
    city:         debouncedCity || undefined,
    propertyType: propertyType || undefined,
    minPrice:     debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
    maxPrice:     debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
    minArea:      debouncedMinArea  ? Number(debouncedMinArea)  : undefined,
    maxArea:      debouncedMaxArea  ? Number(debouncedMaxArea)  : undefined,
    bedrooms:     bedrooms          ? Number(bedrooms)          : undefined,
    page:         currentPage,
    size:         12,
  }), [
    debouncedCity, propertyType, debouncedMinPrice, debouncedMaxPrice,
    debouncedMinArea, debouncedMaxArea, bedrooms, currentPage
  ]);

  // --- fetch ---
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProperties(buildFilters());
      setProperties(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Nie udało się pobrać ofert. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  }, [buildFilters]);

  // --- sync URL z filtrami ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (city)         params.set('city', city);
    if (propertyType) params.set('propertyType', propertyType);
    if (minPrice)     params.set('minPrice', minPrice);
    if (maxPrice)     params.set('maxPrice', maxPrice);
    if (minArea)      params.set('minArea', minArea);
    if (maxArea)      params.set('maxArea', maxArea);
    if (bedrooms)     params.set('bedrooms', bedrooms);
    if (currentPage)  params.set('page', String(currentPage));
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  }, [city, propertyType, minPrice, maxPrice, minArea, maxArea, bedrooms, currentPage]);

  // --- reset strony gdy zmienia się filtr (nie strona sama w sobie) ---
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedCity, propertyType, debouncedMinPrice, debouncedMaxPrice,
      debouncedMinArea, debouncedMaxArea, bedrooms]);

  // --- efekt główny ---
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function changePage(p: number) {
    setCurrentPage(p);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clearFilters() {
    setCity('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setBedrooms('');
    setCurrentPage(0);
  }

  const hasActiveFilters = city || propertyType || minPrice || maxPrice
                         || minArea || maxArea || bedrooms;

  return (
    <div style={{ minHeight: '100vh', background: '#080b14', color: '#f1f5f9' }}>
      <Navbar />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 60px', boxSizing: 'border-box' }}>

        {/* ── nagłówek ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
            Wszystkie oferty
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.025em', margin: 0 }}>
            Przeglądaj nieruchomości
          </h1>
          {!isLoading && totalElements > 0 && (
            <p style={{ color: '#475569', fontSize: 13, marginTop: 8 }}>
              Znaleziono <span style={{ color: '#94a3b8', fontWeight: 600 }}>{totalElements}</span> ofert
            </p>
          )}
        </div>

        {/* ── pasek wyszukiwania ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Szukaj po mieście…"
              value={city}
              onChange={e => setCity(e.target.value)}
              style={inputStyle({ paddingLeft: 40 })}
            />
          </div>

          <select
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
            style={inputStyle()}
          >
            {PROPERTY_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <button
            onClick={() => setFiltersOpen(v => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '0 18px', height: 44, borderRadius: 10,
              border: `1px solid ${filtersOpen ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: filtersOpen ? 'rgba(37,99,235,0.12)' : 'rgba(255,255,255,0.04)',
              color: filtersOpen ? '#60a5fa' : '#94a3b8',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={15} />
            Filtry
            {hasActiveFilters && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6' }} />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '0 14px', height: 44, borderRadius: 10,
                border: '1px solid rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.08)',
                color: '#f87171', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              <X size={13} /> Wyczyść filtry
            </button>
          )}
        </div>

        {/* ── rozwijany panel filtrów ── */}
        {filtersOpen && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12, marginBottom: 24,
            padding: 20, borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div>
              <label style={labelStyle}>Cena min (zł)</label>
              <input type="number" placeholder="np. 200 000" value={minPrice}
                onChange={e => setMinPrice(e.target.value)} style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle}>Cena max (zł)</label>
              <input type="number" placeholder="np. 800 000" value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)} style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle}>Pow. min (m²)</label>
              <input type="number" placeholder="np. 40" value={minArea}
                onChange={e => setMinArea(e.target.value)} style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle}>Pow. max (m²)</label>
              <input type="number" placeholder="np. 120" value={maxArea}
                onChange={e => setMaxArea(e.target.value)} style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle}>Liczba sypialni</label>
              <select value={bedrooms} onChange={e => setBedrooms(e.target.value)} style={inputStyle()}>
                <option value="">Dowolna</option>
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ── wyniki ── */}
        <div ref={listRef}>
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: '#0f1623', overflow: 'hidden' }}>
                  <div style={{ paddingTop: '62.5%', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ height: 14, borderRadius: 6, width: '70%', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <div style={{ height: 12, borderRadius: 6, width: '45%', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '72px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ color: '#94a3b8', marginBottom: 16 }}>{error}</p>
              <button onClick={fetchProperties} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#cbd5e1', fontSize: 13, cursor: 'pointer' }}>
                Spróbuj ponownie
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <Building2 size={44} color="#1e293b" style={{ margin: '0 auto 16px', display: 'block' }} />
              <h3 style={{ color: '#cbd5e1', fontWeight: 700, marginBottom: 8 }}>Brak wyników</h3>
              <p style={{ color: '#334155', fontSize: 13 }}>Zmień kryteria wyszukiwania.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ marginTop: 16, padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#cbd5e1', fontSize: 13, cursor: 'pointer' }}>
                  Wyczyść filtry
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20 }}>
                {properties.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>

              {/* paginacja */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 52 }}>
                  <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 0}
                    style={pageBtn(currentPage === 0)}>
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
                          width: 36, height: 36, borderRadius: 8, fontSize: 13, fontWeight: 600,
                          border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          background: active ? '#2563eb' : 'transparent',
                          color: active ? '#fff' : '#64748b', cursor: 'pointer',
                          boxShadow: active ? '0 4px 16px rgba(37,99,235,0.4)' : 'none',
                        }}>{p + 1}</button>
                      );
                    })}
                  </div>
                  <button onClick={() => changePage(currentPage + 1)} disabled={currentPage >= totalPages - 1}
                    style={pageBtn(currentPage >= totalPages - 1)}>
                    Następna <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── style helpers ──────────────────────────────────────────────────────────────
function inputStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    width: '100%', height: 44, borderRadius: 10, boxSizing: 'border-box',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#f1f5f9', fontSize: 13, padding: '0 14px',
    outline: 'none', appearance: 'none',
    ...extra,
  };
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, color: '#475569',
  marginBottom: 6, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
};

function pageBtn(disabled: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 18px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    color: disabled ? '#1e293b' : '#94a3b8',
    fontSize: 13, fontWeight: 500,
    cursor: disabled ? 'default' : 'pointer',
  };
}
