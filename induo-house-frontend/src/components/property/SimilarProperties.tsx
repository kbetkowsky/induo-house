'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Square, BedDouble } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface SimilarProperty {
  id: number;
  title: string;
  price: number;
  city: string;
  area: number;
  numberOfRooms?: number;
  propertyType: string;
  transactionType: string;
  thumbnailUrl?: string;
}

interface Props {
  currentId: number;
  city: string;
  propertyType: string;
}

export default function SimilarProperties({ currentId, city, propertyType }: Props) {
  const router = useRouter();
  const [items, setItems]     = useState<SimilarProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/properties/search?city=${encodeURIComponent(city)}&propertyType=${propertyType}&size=5&page=0`,
          { credentials: 'include' }
        );
        const data = await res.json();
        const list: SimilarProperty[] = (data.content ?? data)
          .filter((p: SimilarProperty) => p.id !== currentId)
          .slice(0, 4);
        setItems(list);
      } catch {
        // sekcja się nie pokaże
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentId, city, propertyType]);

  const sectionTitle = (
    <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 3, height: 18, borderRadius: 99, background: '#3b82f6', display: 'inline-block', flexShrink: 0 }} />
      Podobne ogłoszenia
    </h2>
  );

  if (loading) {
    return (
      <div style={{ marginTop: 8 }}>
        <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
        {sectionTitle}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ borderRadius: 14, overflow: 'hidden', background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ height: 120, background: 'linear-gradient(90deg,#111827 25%,#1a2235 50%,#111827 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ padding: 12 }}>
                <div style={{ height: 12, background: '#1e293b', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 10, background: '#1e293b', borderRadius: 4, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div style={{ marginTop: 8 }}>
      {sectionTitle}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {items.map(item => {
          const imgUrl = item.thumbnailUrl
            ? item.thumbnailUrl.startsWith('http') ? item.thumbnailUrl : `${API_BASE}${item.thumbnailUrl}`
            : null;
          const isRent = item.transactionType === 'RENT';

          return (
            <div
              key={item.id}
              onClick={() => router.push(`/properties/${item.id}`)}
              style={{
                borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)',
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                display: 'flex', flexDirection: 'column',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-3px)';
                el.style.borderColor = 'rgba(59,130,246,0.3)';
                el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = 'rgba(255,255,255,0.07)';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative', height: 120, background: '#111827', flexShrink: 0, overflow: 'hidden' }}>
                {imgUrl
                  ? <img src={imgUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#1e293b' }}>🏠</div>
                }
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)', pointerEvents: 'none' }} />
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  background: isRent ? 'rgba(245,158,11,0.85)' : 'rgba(34,197,94,0.85)',
                  backdropFilter: 'blur(4px)', color: '#fff',
                  padding: '3px 8px', borderRadius: 8,
                  fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                }}>
                  {isRent ? 'Wynajem' : 'Sprzedaż'}
                </span>
              </div>

              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.35,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
                }}>
                  {item.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#475569', fontSize: 12 }}>
                  <MapPin style={{ width: 12, height: 12, color: '#3b82f6', flexShrink: 0 }} />
                  {item.city}
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#475569' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Square style={{ width: 11, height: 11 }} />{item.area} m²
                  </span>
                  {item.numberOfRooms && item.numberOfRooms > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BedDouble style={{ width: 11, height: 11 }} />{item.numberOfRooms} pok.
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#60a5fa', letterSpacing: '-0.02em' }}>
                  {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(item.price)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
