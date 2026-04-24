'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PropertyCard from '@/components/PropertyCard';
import { PropertyListResponse } from '@/types/property';
import { Search, MapPin, Building2, Home, Trees, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchProperties(page = 0, size = 12, filters: Record<string, string> = {}): Promise<{ content: PropertyListResponse[]; totalPages: number; totalElements: number }> {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size), sort: 'createdAt,desc', ...filters });
    const res = await fetch(`${API_BASE}/api/properties?${params}`, { credentials: 'include', cache: 'no-store' });
    if (!res.ok) return { content: [], totalPages: 0, totalElements: 0 };
    const data = await res.json();
    return { content: data.content ?? [], totalPages: data.totalPages ?? 0, totalElements: data.totalElements ?? 0 };
  } catch { return { content: [], totalPages: 0, totalElements: 0 }; }
}

const CATEGORIES = [
  { label: 'Mieszkania', type: 'APARTMENT', icon: Building2, img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80' },
  { label: 'Domy', type: 'HOUSE', icon: Home, img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80' },
  { label: 'Działki', type: 'LAND', icon: Trees, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80' },
  { label: 'Lokale użytkowe', type: 'COMMERCIAL', icon: Briefcase, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
];

const PROP_TYPE_OPTIONS = [
  { value: '', label: 'Wszystkie typy' },
  { value: 'APARTMENT', label: 'Mieszkanie' },
  { value: 'HOUSE', label: 'Dom' },
  { value: 'LAND', label: 'Działka' },
  { value: 'COMMERCIAL', label: 'Komercyjne' },
];

export default function HomePage() {
  const router = useRouter();

  const [city, setCity] = useState('');
  const [propType, setPropType] = useState('');
  const [propTypeOpen, setPropTypeOpen] = useState(false);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [areaFrom, setAreaFrom] = useState('');
  const [areaTo, setAreaTo] = useState('');
  const [activeTab, setActiveTab] = useState<'SALE' | 'RENT'>('SALE');

  const [page, setPage] = useState(0);
  const { data, isLoading: loading } = useQuery({
    queryKey: ['home-properties', activeTab, page],
    queryFn: () => fetchProperties(page, 12, { transactionType: activeTab }),
  });

  const listings = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: 'SALE' | 'RENT') => {
    setActiveTab(tab);
    setPage(0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (city) p.set('city', city);
    p.set('transactionType', activeTab);
    if (propType) p.set('propertyType', propType);
    if (priceFrom) p.set('minPrice', priceFrom);
    if (priceTo) p.set('maxPrice', priceTo);
    if (areaFrom) p.set('minArea', areaFrom);
    if (areaTo) p.set('maxArea', areaTo);
    router.push(`/properties?${p.toString()}`);
  };

  const propTypeLabel = PROP_TYPE_OPTIONS.find(o => o.value === propType)?.label ?? 'Wszystkie typy';

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }} onClick={() => setPropTypeOpen(false)}>
      <style>{`
        .hero-section {
          position: relative;
          height: 480px;
          background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85') center/cover no-repeat;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.58) 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 0 20px;
        }
        .hero-title {
          color: #fff; font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800; text-align: center; margin: 0 0 8px;
          letter-spacing: -0.025em; text-shadow: 0 2px 12px rgba(0,0,0,0.45);
        }
        .hero-sub {
          color: rgba(255,255,255,0.88); font-size: 1.1rem;
          margin: 0 0 36px; text-align: center;
          text-shadow: 0 1px 6px rgba(0,0,0,0.35);
        }

        .search-box {
          background: var(--bg-surface);
          border-radius: 16px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.28);
          width: 100%; max-width: 920px;
          overflow: visible;
        }
        .search-tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
          padding: 0 8px;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
        }
        .search-tab {
          padding: 16px 28px; font-size: 15px; font-weight: 700;
          cursor: pointer; border: none; background: none;
          color: var(--text-muted); border-bottom: 3px solid transparent;
          margin-bottom: -1px; font-family: inherit;
          transition: color 0.18s, border-color 0.18s;
        }
        .search-tab.active { color: #c0392b; border-bottom-color: #c0392b; }

        .search-row1 {
          display: grid;
          grid-template-columns: 1fr 220px auto;
          border-bottom: 1px solid var(--border);
        }
        .search-row2 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          border-radius: 0 0 16px 16px;
          overflow: hidden;
        }

        .sf-cell {
          display: flex; flex-direction: column;
          padding: 14px 20px;
          border-right: 1px solid var(--border);
          min-width: 0;
        }
        .sf-cell:last-child { border-right: none; }
        .sf-label {
          font-size: 11px; font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.07em;
          margin-bottom: 6px; white-space: nowrap;
        }
        .sf-input {
          border: none; outline: none;
          font-size: 15px; font-weight: 500;
          color: var(--foreground);
          background: none;
          font-family: inherit; width: 100%; padding: 0;
        }
        .sf-input::placeholder { color: var(--text-muted); }
        .sf-row-inner { display: flex; align-items: center; gap: 6px; }
        .sf-num {
          flex: 1; min-width: 0; border: none; outline: none;
          font-size: 15px; font-weight: 500;
          color: var(--foreground);
          background: none; font-family: inherit; padding: 0;
        }
        .sf-num::placeholder { color: var(--text-muted); }
        .sf-unit { font-size: 13px; color: var(--text-muted); flex-shrink: 0; }
        .search-btn {
          padding: 0 32px; background: #c0392b; color: #fff;
          border: none; cursor: pointer; font-size: 16px; font-weight: 700;
          display: flex; align-items: center; gap: 9px;
          font-family: inherit; transition: background 0.18s; white-space: nowrap;
        }
        .search-btn:hover { background: #a93226; }

        .dropdown-trigger {
          display: flex; align-items: center; gap: 6px;
          cursor: pointer; user-select: none;
        }
        .dropdown-trigger-text {
          font-size: 15px; font-weight: 500; flex: 1;
          color: var(--foreground);
        }
        .dropdown-arrow { flex-shrink: 0; transition: transform 0.2s; }
        .dropdown-arrow.open { transform: rotate(180deg); }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 6px); left: 0;
          background: var(--bg-surface);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14);
          border: 1px solid var(--border);
          z-index: 9999;
          min-width: 210px;
          overflow: hidden;
        }
        .dropdown-item {
          padding: 12px 18px; font-size: 14px;
          cursor: pointer; border-bottom: 1px solid var(--border);
          transition: background 0.15s;
          display: flex; align-items: center; gap: 8px;
          color: var(--foreground);
        }
        .dropdown-item:last-child { border-bottom: none; }
        .dropdown-item:hover { background: var(--bg-input); }
        .dropdown-item.selected { color: #c0392b; font-weight: 700; background: #fff5f5; }
        .dropdown-item.selected:hover { background: #fff0f0; }
        .dropdown-check { width: 16px; height: 16px; flex-shrink: 0; color: #c0392b; }

        .section-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .section-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; margin-top: 44px; }
        .section-heading { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); }
        .see-all-link { font-size: 13px; color: #c0392b; font-weight: 600; text-decoration: none; }
        .see-all-link:hover { text-decoration: underline; }

        .category-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 8px; }
        .category-card { border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-card); text-decoration: none; display: block; transition: transform 0.2s, box-shadow 0.2s; background: var(--bg-surface); }
        .category-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-card-hover); }
        .category-img { width: 100%; height: 160px; object-fit: cover; display: block; }
        .category-label { padding: 12px 16px; font-size: 14px; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 7px; }

        .listings-tabs { display: flex; margin-bottom: 20px; border-bottom: 2px solid var(--border); }
        .listings-tab { padding: 11px 22px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; background: none; color: var(--text-muted); border-bottom: 3px solid transparent; margin-bottom: -2px; transition: color 0.2s; font-family: inherit; }
        .listings-tab.active { color: #c0392b; border-bottom-color: #c0392b; }

        .listings-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(272px,1fr)); gap: 18px; }
        .skeleton-card { border-radius: 10px; overflow: hidden; background: var(--bg-surface); box-shadow: var(--shadow-card); }

        .pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 40px 0 60px; }
        .page-btn { min-width: 36px; height: 36px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-surface); font-size: 13px; font-weight: 600; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; transition: all 0.15s; padding: 0 10px; }
        .page-btn:hover:not(:disabled) { border-color: #c0392b; color: #c0392b; }
        .page-btn.active { background: #c0392b; border-color: #c0392b; color: #fff; }
        .page-btn:disabled { opacity: 0.35; cursor: default; }

        .total-badge { display: inline-flex; align-items: center; background: #fff5f5; color: #c0392b; border: 1px solid #fecdd3; border-radius: 99px; font-size: 12px; font-weight: 700; padding: 3px 12px; }

        @media (max-width: 860px) {
          .search-row1 { grid-template-columns: 1fr auto; }
          .sf-cell.hide-mob { display: none; }
          .search-row2 { grid-template-columns: 1fr 1fr; }
          .category-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 560px) {
          .hero-section { height: 520px; }
          .search-row2 { grid-template-columns: 1fr; }
          .listings-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Adresujemy marzenia</h1>
          <p className="hero-sub">Znajdź dom, który Ci odpowiada</p>

          <div className="search-box">
            <div className="search-tabs">
              <button className={`search-tab ${activeTab === 'SALE' ? 'active' : ''}`} onClick={() => handleTabChange('SALE')}>Na sprzedaż</button>
              <button className={`search-tab ${activeTab === 'RENT' ? 'active' : ''}`} onClick={() => handleTabChange('RENT')}>Na wynajem</button>
            </div>

            <form onSubmit={handleSearch}>
              <div className="search-row1">
                <div className="sf-cell">
                  <span className="sf-label">Lokalizacja</span>
                  <div className="sf-row-inner">
                    <MapPin size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      className="sf-input"
                      placeholder="Wpisz miasto lub dzielnicę"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div
                  className="sf-cell hide-mob"
                  style={{ position: 'relative' }}
                  onClick={e => { e.stopPropagation(); setPropTypeOpen(o => !o); }}
                >
                  <span className="sf-label">Typ nieruchomości</span>
                  <div className="dropdown-trigger">
                    <span className="dropdown-trigger-text">{propTypeLabel}</span>
                    <svg className={`dropdown-arrow ${propTypeOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  {propTypeOpen && (
                    <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                      {PROP_TYPE_OPTIONS.map(opt => (
                        <div
                          key={opt.value}
                          className={`dropdown-item ${propType === opt.value ? 'selected' : ''}`}
                          onClick={() => { setPropType(opt.value); setPropTypeOpen(false); }}
                        >
                          <span style={{ flex: 1 }}>{opt.label}</span>
                          {propType === opt.value && (
                            <svg className="dropdown-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="search-btn">
                  <Search size={18} /> Szukaj
                </button>
              </div>

              <div className="search-row2">
                <div className="sf-cell">
                  <span className="sf-label">Cena od</span>
                  <div className="sf-row-inner">
                    <input className="sf-num" type="number" placeholder="np. 200 000" value={priceFrom} onChange={e => setPriceFrom(e.target.value)} />
                    <span className="sf-unit">zł</span>
                  </div>
                </div>
                <div className="sf-cell">
                  <span className="sf-label">Cena do</span>
                  <div className="sf-row-inner">
                    <input className="sf-num" type="number" placeholder="np. 800 000" value={priceTo} onChange={e => setPriceTo(e.target.value)} />
                    <span className="sf-unit">zł</span>
                  </div>
                </div>
                <div className="sf-cell">
                  <span className="sf-label">Powierzchnia od</span>
                  <div className="sf-row-inner">
                    <input className="sf-num" type="number" placeholder="np. 30" value={areaFrom} onChange={e => setAreaFrom(e.target.value)} />
                    <span className="sf-unit">m²</span>
                  </div>
                </div>
                <div className="sf-cell">
                  <span className="sf-label">Powierzchnia do</span>
                  <div className="sf-row-inner">
                    <input className="sf-num" type="number" placeholder="np. 150" value={areaTo} onChange={e => setAreaTo(e.target.value)} />
                    <span className="sf-unit">m²</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ══ KATEGORIE ══ */}
      <div className="section-wrap">
        <div className="section-title-row">
          <h2 className="section-heading">Rodzaje nieruchomości</h2>
        </div>
        <div className="category-grid">
          {CATEGORIES.map(({ label, type, icon: Icon, img }) => (
            <Link key={type} href={`/properties?propertyType=${type}&transactionType=${activeTab}`} className="category-card">
              <Image src={img} alt={label} className="category-img" width={400} height={160} unoptimized />
              <div className="category-label">
                <Icon size={16} style={{ color: '#c0392b' }} />
                {label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ OGŁOSZENIA ══ */}
      <div className="section-wrap">
        <div className="section-title-row">
          <div>
            <h2 className="section-heading" style={{ marginBottom: 4 }}>
              {activeTab === 'SALE' ? 'Nieruchomości na sprzedaż' : 'Nieruchomości na wynajem'}
            </h2>
            {totalElements > 0 && (
              <span className="total-badge">{totalElements.toLocaleString('pl-PL')} ogłoszeń</span>
            )}
          </div>
          <Link href="/properties" className="see-all-link">Zobacz wszystkie →</Link>
        </div>

        <div className="listings-tabs">
          <button className={`listings-tab ${activeTab === 'SALE' ? 'active' : ''}`} onClick={() => handleTabChange('SALE')}>Na sprzedaż</button>
          <button className={`listings-tab ${activeTab === 'RENT' ? 'active' : ''}`} onClick={() => handleTabChange('RENT')}>Na wynajem</button>
        </div>

        {loading ? (
          <div className="listings-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton" style={{ height: 200 }} />
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="skeleton" style={{ height: 14, borderRadius: 4, width: '70%' }} />
                  <div className="skeleton" style={{ height: 12, borderRadius: 4, width: '50%' }} />
                  <div className="skeleton" style={{ height: 12, borderRadius: 4, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="listings-grid">
            {listings.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 24px', borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <Building2 size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Brak ogłoszeń w tej kategorii</p>
            <Link href="/properties" style={{ color: '#c0392b', fontSize: 14, fontWeight: 600, marginTop: 8, display: 'inline-block' }}>
              Przeglądaj wszystkie →
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              let pageNum = i;
              if (totalPages > 7) {
                if (page < 4) pageNum = i;
                else if (page > totalPages - 5) pageNum = totalPages - 7 + i;
                else pageNum = page - 3 + i;
              }
              return (
                <button key={pageNum} className={`page-btn ${pageNum === page ? 'active' : ''}`} onClick={() => handlePageChange(pageNum)}>
                  {pageNum + 1}
                </button>
              );
            })}
            <button className="page-btn" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
