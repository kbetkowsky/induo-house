'use client';

import { useEffect, useState } from 'react';
import { getProperties } from '@/lib/properties';
import { PropertyListResponse } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import { Building2 } from 'lucide-react';

interface Props {
  currentId: number;
  city: string;
  propertyType: string;
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ height: 180, background: 'rgba(255,255,255,0.05)', animation: 'sl-pulse 1.5s ease-in-out infinite' }} />
      <div style={{ padding: '14px' }}>
        <div style={{ height: 13, borderRadius: 6, background: 'rgba(255,255,255,0.06)', marginBottom: 8, width: '65%', animation: 'sl-pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.04)', width: '45%', animation: 'sl-pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

export default function SimilarListings({ currentId, city, propertyType }: Props) {
  const [items, setItems]     = useState<PropertyListResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getProperties({ city, propertyType, page: 0, size: 7 });
        const filtered = data.content
          .filter(p => p.id !== currentId)
          .slice(0, 3);
        setItems(filtered);
      } catch {}
      finally { setLoading(false); }
    };
    run();
  }, [currentId, city, propertyType]);

  if (!loading && items.length === 0) return null;

  return (
    <div style={{ marginTop: 48 }}>
      <style>{`
        @keyframes sl-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @keyframes sl-fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sl-card { animation: sl-fadeUp 0.4s ease both; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 3, height: 22, borderRadius: 99, background: 'var(--accent)' }} />
        <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Podobne oferty w {city}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((p, i) => (
              <div key={p.id} className="sl-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <PropertyCard property={p} />
              </div>
            ))
        }
      </div>
    </div>
  );
}
