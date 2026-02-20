'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Heart, Eye } from 'lucide-react';
import { PropertyListResponse } from '@/types/property';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Mieszkanie', HOUSE: 'Dom', LAND: 'Działka', COMMERCIAL: 'Lokal',
};

const STORAGE_KEY = 'induo_favorites';

function isFav(id: number): boolean {
  try { return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[]).includes(id); }
  catch { return false; }
}
function toggleFav(id: number): boolean {
  try {
    const favs: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next.includes(id);
  } catch { return false; }
}

export default function PropertyCard({ property }: { property: PropertyListResponse }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [fav, setFav]         = useState(false);
  const [favPop, setFavPop]   = useState(false);

  useEffect(() => { setFav(isFav(property.id)); }, [property.id]);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleFav(property.id);
    setFav(next);
    setFavPop(true);
    setTimeout(() => setFavPop(false), 350);
  };

  const imageUrl = property.thumbnailUrl
    ? property.thumbnailUrl.startsWith('http')
      ? property.thumbnailUrl
      : `${API_BASE}${property.thumbnailUrl}`
    : null;

  const formattedPrice = new Intl.NumberFormat('pl-PL', {
    style: 'currency', currency: 'PLN', maximumFractionDigits: 0,
  }).format(property.price);

  const pricePerM2 = property.area
    ? Math.round(property.price / property.area).toLocaleString('pl-PL')
    : null;

  const isRent = property.transactionType === 'RENT';

  return (
    <>
      <style>{`
        @keyframes favPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.45); }
          100% { transform: scale(1); }
        }
        .fav-pop { animation: favPop 0.35s cubic-bezier(.22,1,.36,1); }
      `}</style>

      <div
        onClick={() => router.push(`/properties/${property.id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border-card)'}`,
          cursor: 'pointer',
          transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── ZDJĘCIE ── */}
        <div style={{
          position: 'relative', height: 200, overflow: 'hidden',
          background: 'var(--bg-card)', flexShrink: 0,
        }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 48, color: 'var(--text-faint)',
            }}>🏠</div>
          )}

          {/* Gradient na zdjęciu */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)',
            pointerEvents: 'none',
          }} />

          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s',
            pointerEvents: 'none',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', padding: '9px 18px', borderRadius: 999,
              fontSize: 13, fontWeight: 700,
              transform: hovered ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.95)',
              transition: 'transform 0.25s',
            }}>
              <Eye style={{ width: 15, height: 15 }} />
              Zobacz ofertę
            </div>
          </div>

          {/* Badge: transakcja */}
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: isRent ? 'rgba(245,158,11,0.85)' : 'rgba(34,197,94,0.85)',
            backdropFilter: 'blur(4px)',
            color: '#fff', padding: '3px 10px', borderRadius: 20,
            fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {isRent ? 'Wynajem' : 'Sprzedaż'}
          </span>

          {/* Badge: typ */}
          <span style={{
            position: 'absolute', top: 10, right: 42,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 10,
          }}>
            {TYPE_LABELS[property.propertyType] || property.propertyType}
          </span>

          {/* Serce ❤️ */}
          <button
            onClick={handleFav}
            className={favPop ? 'fav-pop' : ''}
            title={fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 30, height: 30, borderRadius: '50%',
              background: fav ? 'rgba(239,68,68,0.88)' : 'rgba(0,0,0,0.42)',
              backdropFilter: 'blur(6px)',
              border: fav ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: fav ? '#fff' : '#94a3b8',
              transition: 'background 0.2s, border-color 0.2s, color 0.2s',
            }}
          >
            <Heart style={{ width: 14, height: 14 }} fill={fav ? '#fff' : 'none'} />
          </button>
        </div>

        {/* ── TREŚĆ ── */}
        <div style={{
          padding: '14px 16px', flex: 1,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <h3 style={{
            margin: 0, fontSize: 15, fontWeight: 700,
            color: 'var(--text-primary)', lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {property.title}
          </h3>

          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            📍 {property.city}
          </p>

          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            <span>📐 {property.area} m²</span>
            {property.numberOfRooms != null && property.numberOfRooms > 0 && (
              <span>🛏 {property.numberOfRooms} pok.</span>
            )}
          </div>

          {property.ownerFirstName && (
            <p style={{
              margin: '6px 0 0', fontSize: 12, color: 'var(--text-muted)',
              borderTop: '1px solid var(--border)', paddingTop: 8,
            }}>
              👤 {property.ownerFirstName} {property.ownerLastName}
              {property.ownerPhoneNumber && ` · 📞 ${property.ownerPhoneNumber}`}
            </p>
          )}
        </div>

        {/* ── CENA ── */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontSize: 18, fontWeight: 900,
            color: 'var(--accent-bright)', letterSpacing: '-0.02em',
          }}>
            {formattedPrice}
          </span>
          {pricePerM2 && (
            <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>
              {pricePerM2} zł/m²
            </span>
          )}
        </div>
      </div>
    </>
  );
}
