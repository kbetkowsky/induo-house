'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { PropertyListResponse, PageResponse } from '@/types/property';
import { Search, MapPin, Building2, Home, Trees, Briefcase, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

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
  {
    label: 'Mieszkania', type: 'APARTMENT', icon: Building2,
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
  },
  {
    label: 'Domy', type: 'HOUSE', icon: Home,
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80',
  },
  {
    label: 'Działki', type: 'LAND', icon: Trees,
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  },
  {
    label: 'Lokale użytkowe', type: 'COMMERCIAL', icon: Briefcase,
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
  },
];

export default function HomePage() {
  const router = useRouter();

  // search state
  const [city, setCity] = useState('');
  const [txType, setTxType] = useState('');
  const [propType, setPropType] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [areaFrom, setAreaFrom] = useState('');
  const [areaTo, setAreaTo] = useState('');
  const [activeTab, setActiveTab] = useState<'SALE' | 'RENT'>('SALE');

  // listings state
  const [listings, setListings] = useState<PropertyListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadListings = useCallback(async (p = 0) => {
    setLoading(true);
    const filters: Record<string, string> = {};
    if (activeTab) filters.transactionType = activeTab;
    const result = await fetchProperties(p, 12, filters);
    setListings(result.content);
    setTotalPages(result.totalPages);
    setTotalElements(result.totalElements);
    setLoading(false);
  }, [activeTab]);

  useEffect(() => { setPage(0); loadListings(0); }, [activeTab, loadListings]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadListings(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (city) p.set('city', city);
    if (txType || activeTab) p.set('transactionType', txType || activeTab);
    if (propType) p.set('propertyType', propType);
    if (priceFrom) p.set('priceFrom', priceFrom);
    if (priceTo) p.set('priceTo', priceTo);
    if (areaFrom) p.set('areaFrom', areaFrom);
    if (areaTo) p.set('areaTo', areaTo);
    router.push(`/properties?${p.toString()}`);
  };

  return (
    <div style={{ background: '#f2f4f5', minHeight: '100vh' }}>
      <style>{`
        .hero-section {
          position: relative;
          height: 340px;
          background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85') center/cover no-repeat;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.52) 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 0 16px;
        }
        .hero-title {
          color: #fff; font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800; text-align: center; margin-bottom: 6px;
          letter-spacing: -0.02em; text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .hero-sub {
          color: rgba(255,255,255,0.85); font-size: 1rem;
          margin-bottom: 28px; text-align: center;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .search-box {
          background: #fff; border-radius: 8px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.22);
          width: 100%; max-width: 860px;
          overflow: hidden;
        }
        .search-tabs {
          display: flex; border-bottom: 1px solid #e5e7eb;
        }
        .search-tab {
          padding: 12px 24px; font-size: 14px; font-weight: 600;
          cursor: pointer; border: none; background: none;
          color: #6b7280; transition: color 0.2s, border-bottom 0.2s;
          border-bottom: 3px solid transparent; font-family: inherit;
        }
        .search-tab.active {
          color: #c0392b; border-bottom-color: #c0392b;
        }
        .search-fields {
          display: grid;
          grid-template-columns: 1fr 160px 160px 160px auto;
          gap: 0; align-items: stretch;
        }
        .sf-group {
          display: flex; flex-direction: column;
          padding: 10px 16px; border-right: 1px solid #f0f0f0;
        }
        .sf-label {
          font-size: 10px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;
        }
        .sf-input, .sf-select {
          border: none; outline: none; font-size: 14px;
          font-weight: 500; color: #111827; background: none;
          font-family: inherit; width: 100%; padding: 0;
        }
        .sf-select { cursor: pointer; appearance: none; }
        .sf-row { display: flex; align-items: center; gap: 4px; }
        .sf-sep { color: #d1d5db; font-size: 12px; }
        .sf-num { width: 60px; border: none; outline: none; font-size: 14px; font-weight: 500; color: #111827; background: none; font-family: inherit; }
        .sf-unit { font-size: 12px; color: #9ca3af; }
        .search-btn-hero {
          padding: 0 28px; background: #c0392b; color: #fff;
          border: none; cursor: pointer; font-size: 15px; font-weight: 700;
          display: flex; align-items: center; gap: 8px; font-family: inherit;
          transition: background 0.2s;
        }
        .search-btn-hero:hover { background: #a93226; }

        .section-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .section-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; margin-top: 40px; }
        .section-heading { font-size: 1.25rem; font-weight: 800; color: #111827; }
        .see-all-link { font-size: 13px; color: #c0392b; font-weight: 600; text-decoration: none; }
        .see-all-link:hover { text-decoration: underline; }

        .category-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
          margin-bottom: 8px;
        }
        .category-card {
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          text-decoration: none; display: block;
          transition: transform 0.2s, box-shadow 0.2s;
          background: #fff;
        }
        .category-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.14); }
        .category-img { width: 100%; height: 160px; object-fit: cover; display: block; }
        .category-label {
          padding: 12px 14px; font-size: 14px; font-weight: 700;
          color: #111827; display: flex; align-items: center; gap: 6px;
        }

        .listings-tabs {
          display: flex; gap: 0; margin-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .listings-tab {
          padding: 10px 20px; font-size: 14px; font-weight: 700;
          cursor: pointer; border: none; background: none;
          color: #6b7280; border-bottom: 3px solid transparent;
          margin-bottom: -2px; transition: color 0.2s; font-family: inherit;
        }
        .listings-tab.active { color: #c0392b; border-bottom-color: #c0392b; }

        .listings-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(272px, 1fr)); gap: 18px;
        }
        .skeleton-card { border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        .pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin: 40px 0 60px;
        }
        .page-btn {
          min-width: 36px; height: 36px; border-radius: 6px;
          border: 1px solid #e5e7eb; background: #fff;
          font-size: 13px; font-weight: 600; color: #374151;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-family: inherit; transition: all 0.15s; padding: 0 10px;
        }
        .page-btn:hover:not(:disabled) { border-color: #c0392b; color: #c0392b; }
        .page-btn.active { background: #c0392b; border-color: #c0392b; color: #fff; }
        .page-btn:disabled { opacity: 0.35; cursor: default; }

        .total-badge {
          display: inline-flex; align-items: center;
          background: #fff5f5; color: #c0392b;
          border: 1px solid #fecdd3; border-radius: 99px;
          font-size: 12px; font-weight: 700; padding: 3px 12px;
        }

        @media (max-width: 900px) {
          .search-fields { grid-template-columns: 1fr auto !important; }
          .sf-group.hide-mobile { display: none; }
          .category-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .hero-section { height: 400px; }
          .search-fields { grid-template-columns: 1fr auto !important; }
          .category-grid { grid-template-columns: repeat(2, 1fr); }
          .listings-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ══════════ HERO ══════════ */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Adresujemy marzenia</h1>
          <p className="hero-sub">Znajdź dom, który Ci odpowiada</p>

          <div className="search-box">
            {/* Tabs */}
            <div className="search-tabs">
              <button
                className={`search-tab ${activeTab === 'SALE' ? 'active' : ''}`}
                onClick={() => setActiveTab('SALE')}
              >Szukaj</button>
              <button
                className={`search-tab ${activeTab === 'RENT' ? 'active' : ''}`}
                onClick={() => setActiveTab('RENT')}
              >Na wynajem</button>
            </div>

            {/* Fields */}
            <form onSubmit={handleSearch}>
              <div className="search-fields">
                {/* Typ */}
                <div className="sf-group">
                  <span className="sf-label">Typ nieruchomości</span>
                  <div className="sf-row">
                    <select className="sf-select" value={propType} onChange={e => setPropType(e.target.value)}>
                      <option value="">Mieszkania</option>
                      <option value="APARTMENT">Mieszkanie</option>
                      <option value="HOUSE">Dom</option>
                      <option value="LAND">Działka</option>
                      <option value="COMMERCIAL">Komercyjne</option>
                    </select>
                    <ChevronDown size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                  </div>
                </div>

                {/* Lokalizacja */}
                <div className="sf-group" style={{ flex: 1, gridColumn: 'span 1' }}>
                  <span className="sf-label">Lokalizacja</span>
                  <div className="sf-row">
                    <MapPin size={13} style={{ color: '#9ca3af', flexShrink: 0 }} />
                    <input
                      className="sf-input"
                      placeholder="Wpisz lokalizację"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                  </div>
                </div>

                {/* Cena */}
                <div className="sf-group hide-mobile">
                  <span className="sf-label">Cena</span>
                  <div className="sf-row">
                    <input className="sf-num" placeholder="od" value={priceFrom} onChange={e => setPriceFrom(e.target.value)} />
                    <span className="sf-sep">–</span>
                    <input className="sf-num" placeholder="do" value={priceTo} onChange={e => setPriceTo(e.target.value)} />
                    <span className="sf-unit">zł</span>
                  </div>
                </div>

                {/* Powierzchnia */}
                <div className="sf-group hide-mobile">
                  <span className="sf-label">Powierzchnia</span>
                  <div className="sf-row">
                    <input className="sf-num" placeholder="od" value={areaFrom} onChange={e => setAreaFrom(e.target.value)} />
                    <span className="sf-sep">–</span>
                    <input className="sf-num" placeholder="do" value={areaTo} onChange={e => setAreaTo(e.target.value)} />
                    <span className="sf-unit">m²</span>
                  </div>
                </div>

                {/* Button */}
                <button type="submit" className="search-btn-hero">
                  <Search size={16} /> Wyszukaj
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ══════════ KATEGORIE ══════════ */}
      <div className="section-wrap">
        <div className="section-title-row">
          <h2 className="section-heading">Rodzaje nieruchomości</h2>
        </div>

        <div className="category-grid">
          {CATEGORIES.map(({ label, type, icon: Icon, img }) => (
            <Link key={type} href={`/properties?propertyType=${type}&transactionType=${activeTab}`} className="category-card">
              <img src={img} alt={label} className="category-img" />
              <div className="category-label">
                <Icon size={16} style={{ color: '#c0392b' }} />
                {label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════ WSZYSTKIE OGŁOSZENIA ══════════ */}
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

        {/* Tabs sprzedaż/wynajem */}
        <div className="listings-tabs">
          <button
            className={`listings-tab ${activeTab === 'SALE' ? 'active' : ''}`}
            onClick={() => setActiveTab('SALE')}
          >Na sprzedaż</button>
          <button
            className={`listings-tab ${activeTab === 'RENT' ? 'active' : ''}`}
            onClick={() => setActiveTab('RENT')}
          >Na wynajem</button>
        </div>

        {/* Grid ogłoszeń */}
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
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            borderRadius: 12, background: '#fff',
            border: '1px solid #e5e7eb',
          }}>
            <Building2 size={48} style={{ color: '#d1d5db', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: '#9ca3af', fontSize: 15 }}>Brak ogłoszeń w tej kategorii</p>
            <Link href="/properties" style={{ color: '#c0392b', fontSize: 14, fontWeight: 600, marginTop: 8, display: 'inline-block' }}>
              Przeglądaj wszystkie →
            </Link>
          </div>
        )}

        {/* Paginacja */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
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
                <button
                  key={pageNum}
                  className={`page-btn ${pageNum === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              className="page-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages - 1}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
