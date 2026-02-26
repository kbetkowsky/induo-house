'use client';

import { useEffect, useState } from 'react';
import { getPropertyById } from '@/lib/properties';
import { PropertyListResponse } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { Heart, Building2, ArrowLeft, Trash2 } from 'lucide-react';

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', height: 320 }}>
      <div style={{ height: 190, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ padding: '16px' }}>
        <div style={{ height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.06)', marginBottom: 10, width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 11, borderRadius: 6, background: 'rgba(255,255,255,0.04)', marginBottom: 16, width: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.06)', width: '40%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const [ids, setIds]               = useState<number[]>([]);
  const [properties, setProperties] = useState<PropertyListResponse[]>([]);
  const [loading, setLoading]       = useState(true);

  const loadFavorites = async (favIds: number[]) => {
    if (favIds.length === 0) { setProperties([]); setLoading(false); return; }
    try {
      const results = await Promise.allSettled(favIds.map(id => getPropertyById(id)));
      const ok = (results as PromiseSettledResult<PropertyListResponse>[])
        .filter((r): r is PromiseFulfilledResult<PropertyListResponse> => r.status === 'fulfilled')
        .map(r => r.value);
      setProperties(ok);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    try {
      const stored: number[] = JSON.parse(localStorage.getItem('induo_favorites') ?? '[]');
      setIds(stored);
      loadFavorites(stored);
    } catch { setLoading(false); }
  }, []);

  const clearAll = () => {
    localStorage.setItem('induo_favorites', '[]');
    setIds([]);
    setProperties([]);
  };

  const removeOne = (id: number) => {
    const next = ids.filter(i => i !== id);
    localStorage.setItem('induo_favorites', JSON.stringify(next));
    setIds(next);
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 88, paddingBottom: 80 }}>
      <style>{`
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fav-card-wrap { animation: fadeUp 0.4s ease both; }
        .clear-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px;
          border: 1px solid rgba(248,113,113,0.25);
          background: rgba(239,68,68,0.07);
          color: #f87171; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
          font-family: inherit;
        }
        .clear-btn:hover { background: rgba(239,68,68,0.14); }
        .remove-fav {
          position: absolute; top: 10px; left: 10px; z-index: 10;
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f87171; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .remove-fav:hover { background: rgba(239,68,68,0.3); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', fontWeight: 500, marginBottom: 12 }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <ArrowLeft size={14} /> Strona główna
            </Link>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Heart size={24} fill="#f87171" style={{ color: '#f87171', flexShrink: 0 }} />
              Ulubione oferty
            </h1>
            {!loading && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
                {properties.length === 0 ? 'Brak zapisanych ofert' : `${properties.length} ${properties.length === 1 ? 'zapisana oferta' : properties.length < 5 ? 'zapisane oferty' : 'zapisanych ofert'}`}
              </p>
            )}
          </div>
          {properties.length > 0 && (
            <button className="clear-btn" onClick={clearAll}>
              <Trash2 size={14} /> Wyczyść wszystkie
            </button>
          )}
        </div>

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Heart size={36} style={{ color: '#f87171' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Brak ulubionych</h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>Kliknij serduszko przy dowolnym ogłoszeniu,<br />aby zapisać je tutaj.</p>
            <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 26px', borderRadius: 14, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 18px rgba(37,99,235,0.35)' }}>
              <Building2 size={16} /> Przeglądaj oferty
            </Link>
          </div>
        )}

        {!loading && properties.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {properties.map((property, idx) => (
              <div key={property.id} className="fav-card-wrap" style={{ position: 'relative', animationDelay: `${idx * 0.06}s` }}>
                <button className="remove-fav" onClick={() => removeOne(property.id)} title="Usuń z ulubionych">
                  <Trash2 size={13} />
                </button>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
