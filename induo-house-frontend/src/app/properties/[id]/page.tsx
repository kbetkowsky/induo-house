'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPropertyById, deleteProperty } from '@/lib/properties';
import { apiClient } from '@/lib/api';
import { Property, PropertyImage } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  MapPin, Square, BedDouble, Layers, Phone, Mail,
  ChevronLeft, ChevronRight, Building2, Trash2, Pencil,
  X, Heart, Share2, ArrowLeft
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const TYPE_MAP: Record<string, string> = {
  APARTMENT: 'Mieszkanie', HOUSE: 'Dom',
  LAND: 'Działka', COMMERCIAL: 'Komercyjne',
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = Number(params.id);

  const [property, setProperty]     = useState<Property | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [activeImage, setActiveImage] = useState<PropertyImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fav, setFav]               = useState(false);
  const [lightbox, setLightbox]     = useState(false);

  useEffect(() => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem('induo_favorites') ?? '[]');
      setFav(favs.includes(id));
    } catch {}
  }, [id]);

  const toggleFav = () => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem('induo_favorites') ?? '[]');
      const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
      localStorage.setItem('induo_favorites', JSON.stringify(next));
      setFav(next.includes(id));
      toast.success(next.includes(id) ? 'Dodano do ulubionych' : 'Usunięto z ulubionych');
    } catch {}
  };

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        setActiveImage(data.images?.find(img => img.isPrimary) ?? data.images?.[0] ?? null);
      } catch {
        setError('Nie udało się załadować ogłoszenia.');
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [id]);

  const imageUrl = (url: string) =>
    url.startsWith('http') ? url : `${API_BASE}${url}`;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(price);

  const translateTransaction = (type: string) => type === 'SALE' ? 'Sprzedaż' : 'Wynajem';

  const prevImage = () => {
    if (!property?.images || !activeImage) return;
    const idx = property.images.findIndex(i => i.id === activeImage.id);
    setActiveImage(property.images[(idx - 1 + property.images.length) % property.images.length]);
  };
  const nextImage = () => {
    if (!property?.images || !activeImage) return;
    const idx = property.images.findIndex(i => i.id === activeImage.id);
    setActiveImage(property.images[(idx + 1) % property.images.length]);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!property || !confirm('Usunąć to zdjęcie?')) return;
    try {
      await apiClient.delete(`/properties/${property.id}/images/${imageId}`);
      const updated = property.images?.filter(i => i.id !== imageId) ?? [];
      setProperty({ ...property, images: updated });
      if (activeImage?.id === imageId) setActiveImage(updated[0] ?? null);
      toast.success('Zdjęcie usunięte');
    } catch { toast.error('Nie udało się usunąć zdjęcia'); }
  };

  const handleDeleteProperty = async () => {
    if (!property || !confirm('Usunąć ogłoszenie? Tej operacji nie można cofnąć.')) return;
    try {
      setIsDeleting(true);
      await deleteProperty(property.id);
      toast.success('Ogłoszenie usunięte');
      router.push('/');
    } catch {
      toast.error('Nie udało się usunąć');
      setIsDeleting(false);
    }
  };

  const isOwner = user && property && user.id === property.owner.id;
  const hasImages = (property?.images?.length ?? 0) > 0;

  /* ─── Loading ─── */
  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  /* ─── Error ─── */
  if (error || !property) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: '#f87171', fontSize: 16 }}>{error || 'Nie znaleziono ogłoszenia.'}</p>
      <Link href="/" style={{ color: 'var(--accent-bright)', fontSize: 14 }}>← Powrót do listy</Link>
    </div>
  );

  const details: [string, string][] = [
    ['Typ nieruchomości', TYPE_MAP[property.propertyType] ?? property.propertyType],
    ['Oferta',           translateTransaction(property.transactionType)],
    ['Powierzchnia',     `${property.area} m²`],
    ...(property.numberOfRooms ? [['Liczba pokoi', String(property.numberOfRooms)] as [string,string]] : []),
    ...(property.floor != null ? [['Piętro', `${property.floor}${property.totalFloors ? ` / ${property.totalFloors}` : ''}`] as [string,string]] : []),
    ['Miasto',   property.city],
    ...(property.street     ? [['Ulica',        property.street]      as [string,string]] : []),
    ...(property.postalCode ? [['Kod pocztowy', property.postalCode]  as [string,string]] : []),
  ];

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .detail-grid { grid-template-columns: 1fr; }
        }
        .thumb-btn {
          flex-shrink: 0; height: 60px; width: 88px;
          border-radius: 8px; overflow: hidden;
          border: 2px solid transparent;
          opacity: 0.55; transition: opacity 0.2s, border-color 0.2s;
          cursor: pointer; background: none; padding: 0;
        }
        .thumb-btn.active   { border-color: var(--accent); opacity: 1; }
        .thumb-btn:hover    { opacity: 1; }
        .detail-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0; border-bottom: 1px solid var(--border);
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label {
          padding: 11px 16px;
          font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: var(--text-muted);
          border-right: 1px solid var(--border);
        }
        .detail-value {
          padding: 11px 16px;
          font-size: 14px; font-weight: 600;
          color: var(--text-primary);
        }
        .contact-input {
          width: 100%; padding: 10px 14px;
          background: var(--bg-input); border: 1px solid var(--border-input);
          border-radius: 10px; color: var(--text-primary);
          font-size: 13px; font-family: inherit;
          outline: none; transition: border-color 0.2s;
          resize: none;
        }
        .contact-input:focus { border-color: var(--border-hover); }
        .send-btn {
          width: 100%; padding: 12px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: inherit;
        }
        .send-btn:hover { background: var(--accent-hover); }
        .icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid var(--border); background: var(--bg-card);
          color: var(--text-muted); cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn:hover { border-color: var(--border-hover); color: var(--text-primary); }
        .section-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-card);
          border-radius: 18px; overflow: hidden;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 15px; font-weight: 700;
          color: var(--text-primary);
          padding: 18px 20px 0;
          display: flex; align-items: center; gap: 8px;
        }
        .section-title::before {
          content: ''; display: block;
          width: 3px; height: 18px; border-radius: 99px;
          background: var(--accent);
        }
        /* Lightbox */
        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      {/* Lightbox */}
      {lightbox && activeImage && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 10, width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
          <button onClick={e => { e.stopPropagation(); prevImage(); }} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 10, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={22} />
          </button>
          <img src={imageUrl(activeImage.url)} alt="" style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); nextImage(); }} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 10, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

          {/* ── BREADCRUMB ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <ArrowLeft size={14} /> Wszystkie ogłoszenia
            </Link>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="icon-btn" title="Udostępnij" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link skopiowany!'); }}>
                <Share2 size={15} />
              </button>
              <button
                className="icon-btn"
                onClick={toggleFav}
                title={fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                style={{ color: fav ? '#f87171' : 'var(--text-muted)', borderColor: fav ? 'rgba(248,113,113,0.3)' : 'var(--border)' }}
              >
                <Heart size={15} fill={fav ? '#f87171' : 'none'} />
              </button>
              {isOwner && (
                <>
                  <Link href={`/properties/${property.id}/edit`} style={{ textDecoration: 'none' }}>
                    <button className="icon-btn" title="Edytuj">
                      <Pencil size={14} />
                    </button>
                  </Link>
                  <button
                    className="icon-btn"
                    onClick={handleDeleteProperty}
                    disabled={isDeleting}
                    title="Usuń ogłoszenie"
                    style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.25)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="detail-grid">

            {/* LEFT */}
            <div>

              {/* Gallery */}
              <div className="section-card" style={{ marginBottom: 20 }}>
                {hasImages && activeImage ? (
                  <>
                    <div style={{ position: 'relative', height: 420, background: '#000', cursor: 'zoom-in' }} onClick={() => setLightbox(true)}>
                      <img
                        src={imageUrl(activeImage.url)}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }}
                      />
                      {/* Zoom badge */}
                      <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                        🔍 Powiększ
                      </div>
                      {isOwner && (
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteImage(activeImage.id); }}
                          style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(239,68,68,0.85)', border: 'none', color: '#fff', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Usuń zdjęcie"
                        >
                          <X size={14} />
                        </button>
                      )}
                      {property.images!.length > 1 && (
                        <>
                          <button onClick={e => { e.stopPropagation(); prevImage(); }} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', border: 'none', color: '#fff', borderRadius: 10, width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronLeft size={20} />
                          </button>
                          <button onClick={e => { e.stopPropagation(); nextImage(); }} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', border: 'none', color: '#fff', borderRadius: 10, width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronRight size={20} />
                          </button>
                          <div style={{ position: 'absolute', bottom: 12, right: 14, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
                            {property.images!.findIndex(i => i.id === activeImage.id) + 1} / {property.images!.length}
                          </div>
                        </>
                      )}
                    </div>
                    {property.images!.length > 1 && (
                      <div style={{ display: 'flex', gap: 8, padding: '10px 12px', overflowX: 'auto', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
                        {property.images!.map(img => (
                          <button key={img.id} className={`thumb-btn${img.id === activeImage.id ? ' active' : ''}`} onClick={() => setActiveImage(img)}>
                            <img src={imageUrl(img.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-faint)' }}>
                    <Building2 size={64} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Brak zdjęć</span>
                  </div>
                )}
              </div>

              {/* Opis */}
              <div className="section-card">
                <p className="section-title">Opis ogłoszenia</p>
                <p style={{ padding: '14px 20px 20px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                  {property.description || 'Brak opisu.'}
                </p>
              </div>

              {/* Szczegóły */}
              <div className="section-card">
                <p className="section-title" style={{ marginBottom: 14 }}>Szczegóły nieruchomości</p>
                <div style={{ margin: '14px 0 0' }}>
                  {details.map(([label, value]) => (
                    <div key={label} className="detail-row">
                      <div className="detail-label">{label}</div>
                      <div className="detail-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT — sticky sidebar */}
            <div style={{ position: 'sticky', top: 88 }}>

              {/* Cena */}
              <div className="section-card" style={{ padding: 22 }}>
                {/* Badges */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', background: property.transactionType === 'RENT' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.12)', color: property.transactionType === 'RENT' ? '#f59e0b' : '#4ade80' }}>
                    {translateTransaction(property.transactionType)}
                  </span>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    {TYPE_MAP[property.propertyType]}
                  </span>
                </div>

                <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, margin: '0 0 8px' }}>
                  {property.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, marginBottom: 18 }}>
                  <MapPin size={13} style={{ flexShrink: 0 }} />
                  {property.city}{property.street ? `, ${property.street}` : ''}{property.postalCode ? ` ${property.postalCode}` : ''}
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
                  <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--accent-bright)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {formatPrice(property.price)}
                  </div>
                  {property.area > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      {new Intl.NumberFormat('pl-PL').format(Math.round(property.price / property.area))} PLN/m²
                      {property.transactionType === 'RENT' && ' · miesięcznie'}
                    </div>
                  )}
                </div>

                {/* Quick stats */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  {[property.area && { icon: <Square size={13}/>, label: `${property.area} m²` },
                    property.numberOfRooms && { icon: <BedDouble size={13}/>, label: `${property.numberOfRooms} pok.` },
                    property.floor != null && { icon: <Layers size={13}/>, label: `Piętro ${property.floor}${property.totalFloors ? `/${property.totalFloors}` : ''}` },
                  ].filter(Boolean).map((item: any, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px' }}>
                      {item.icon} {item.label}
                    </div>
                  ))}
                </div>

                {/* Kontakt */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginBottom: 18 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>Kontakt z ogłoszeniodawcą</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {(property.owner.firstName?.[0] ?? property.owner.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {property.owner.firstName} {property.owner.lastName}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Właściciel ogłoszenia</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <a href={`mailto:${property.owner.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px' }}>
                      <Mail size={13} style={{ color: 'var(--accent-bright)', flexShrink: 0 }} />
                      {property.owner.email}
                    </a>
                    {property.owner.phoneNumber && (
                      <a href={`tel:${property.owner.phoneNumber}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px' }}>
                        <Phone size={13} style={{ color: 'var(--accent-bright)', flexShrink: 0 }} />
                        {property.owner.phoneNumber}
                      </a>
                    )}
                  </div>
                </div>

                {/* Dodaj do ulubionych */}
                <button
                  onClick={toggleFav}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 12, border: `1px solid ${fav ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`, background: fav ? 'rgba(239,68,68,0.08)' : 'var(--bg-card)', color: fav ? '#f87171' : 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
                >
                  <Heart size={14} fill={fav ? '#f87171' : 'none'} />
                  {fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                </button>
              </div>

              {/* Formularz wiadomości */}
              <div className="section-card" style={{ padding: 20 }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14 }}>Wyślij wiadomość</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>Imię i nazwisko</label>
                      <input className="contact-input" type="text" placeholder="Jan Kowalski" defaultValue={user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : ''} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>E-mail</label>
                      <input className="contact-input" type="email" placeholder="jan@example.com" defaultValue={user?.email ?? ''} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>Telefon <span style={{ opacity: 0.5 }}>(opcjonalny)</span></label>
                      <input className="contact-input" type="tel" placeholder="+48 500 000 000" />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>Wiadomość</label>
                      <textarea className="contact-input" rows={3} defaultValue={`Dzień dobry,\n\njestem zainteresowany/a ogłoszeniem &quot;${property.title}&quot;. Proszę o kontakt.`} />
                    </div>
                  </div>
                  <button className="send-btn">
                    <Mail size={14} /> Wyślij wiadomość
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
