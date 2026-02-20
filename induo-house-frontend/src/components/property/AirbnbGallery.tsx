'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid2X2, X, ZoomIn, Building2 } from 'lucide-react';
import { PropertyImage } from '@/types';

interface Props {
  images: PropertyImage[];
  title: string;
  isOwner?: boolean;
  onDeleteImage?: (id: number) => void;
}

const navBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
  width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', cursor: 'pointer',
};

export default function AirbnbGallery({ images, title, isOwner, onDeleteImage }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [lightbox, setLightbox]       = useState(false);

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightbox(true); };
  const prev = () => setLightboxIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setLightboxIdx(i => (i + 1) % images.length);

  /* ── BRAK ZDJĘĆ ── */
  if (!images.length) {
    return (
      <div style={{ borderRadius: 18, background: '#111827', border: '1px solid rgba(255,255,255,0.07)', aspectRatio: '16/7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Building2 style={{ width: 56, height: 56, color: '#1e293b' }} />
        <span style={{ color: '#334155', fontSize: 14, fontWeight: 500 }}>Brak zdjęć</span>
      </div>
    );
  }

  const main   = images[0];
  const thumbs = images.slice(1, 5);

  return (
    <>
      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Zamknij */}
          <button
            onClick={() => setLightbox(false)}
            style={{ position: 'absolute', top: 20, right: 20, ...navBtn }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>

          {/* Strzałki */}
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', ...navBtn }}>
                <ChevronLeft style={{ width: 24, height: 24 }} />
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', ...navBtn }}>
                <ChevronRight style={{ width: 24, height: 24 }} />
              </button>
            </>
          )}

          {/* Zdjęcie */}
          <img
            src={images[lightboxIdx].url}
            alt={title}
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: 16 }}
          />

          {/* Usuń (owner) */}
          {isOwner && onDeleteImage && (
            <button
              onClick={e => { e.stopPropagation(); onDeleteImage(images[lightboxIdx].id); setLightbox(false); }}
              style={{ position: 'absolute', bottom: 24, right: 24, background: 'rgba(220,38,38,0.8)', border: 'none', borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Usuń zdjęcie
            </button>
          )}

          {/* Licznik */}
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 999 }}>
              {lightboxIdx + 1} / {images.length}
            </div>
          )}
        </div>
      )}

      {/* ── GRID AIRBNB ── */}
      <div style={{
        borderRadius: 18, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'grid',
        gridTemplateColumns: images.length === 1 ? '1fr' : '1fr 1fr',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: 3,
        aspectRatio: '16/7',
      }}>

        {/* Główne zdjęcie — pełna lewa kolumna */}
        <div
          style={{ gridRow: '1 / 3', position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#111827' }}
          onClick={() => openLightbox(0)}
        >
          <img
            src={main.url} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 40%)', pointerEvents: 'none' }} />

          {/* Zoom hint */}
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <button
              onClick={e => { e.stopPropagation(); openLightbox(0); }}
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', border: 'none', borderRadius: 10, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ZoomIn style={{ width: 13, height: 13 }} /> Powiększ
            </button>
          </div>

          {/* Liczba zdjęć */}
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999 }}>
              1 / {images.length}
            </div>
          )}
        </div>

        {/* 4 miniatury po prawej */}
        {[0, 1, 2, 3].map(i => {
          const img    = thumbs[i];
          const isLast = i === 3 && images.length > 5;

          return (
            <div
              key={i}
              style={{ position: 'relative', overflow: 'hidden', background: '#111827', cursor: img ? 'pointer' : 'default' }}
              onClick={() => img && openLightbox(i + 1)}
            >
              {img ? (
                <>
                  <img
                    src={img.url} alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {isLast && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Grid2X2 style={{ width: 22, height: 22, color: '#fff' }} />
                      <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>+{images.length - 5} zdjęć</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#0a0e1a' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Przycisk pokaż wszystkie */}
      {images.length > 5 && (
        <button
          onClick={() => openLightbox(0)}
          style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          <Grid2X2 style={{ width: 15, height: 15 }} />
          Pokaż wszystkie {images.length} zdjęcia
        </button>
      )}
    </>
  );
}
