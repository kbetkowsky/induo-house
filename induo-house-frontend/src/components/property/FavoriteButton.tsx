'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface Props {
  propertyId: number;
  propertyTitle: string;
}

const STORAGE_KEY = 'induo_favorites';

function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}

function saveFavorites(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function FavoriteButton({ propertyId, propertyTitle }: Props) {
  const [isFav, setIsFav] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(propertyId));
  }, [propertyId]);

  const toggle = () => {
    const favs = getFavorites();
    const next = favs.includes(propertyId)
      ? favs.filter(id => id !== propertyId)
      : [...favs, propertyId];
    saveFavorites(next);
    setIsFav(next.includes(propertyId));
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  };

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.35s cubic-bezier(.22,1,.36,1); }
      `}</style>
      <button
        onClick={toggle}
        title={isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        className={pulse ? 'heart-pop' : ''}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: isFav ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
          color: isFav ? '#f87171' : '#475569',
          fontSize: 13, fontWeight: 700,
          transition: 'background 0.2s, color 0.2s',
          width: '100%',
        }}
        onMouseEnter={e => {
          if (!isFav) {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.color = '#f87171';
          }
        }}
        onMouseLeave={e => {
          if (!isFav) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#475569';
          }
        }}
      >
        <Heart style={{ width: 16, height: 16 }} fill={isFav ? '#f87171' : 'none'} />
        {isFav ? 'W ulubionych' : 'Dodaj do ulubionych'}
      </button>
    </>
  );
}
