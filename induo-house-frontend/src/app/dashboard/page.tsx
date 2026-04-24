'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Building2, User, Mail, Phone, Shield, Plus, ArrowRight, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';
import { getProperties } from '@/lib/properties';
import { PropertyListResponse } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [favProperties, setFavProperties] = useState<PropertyListResponse[]>([]);
  const [favLoading, setFavLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadFavorites = async () => {
      try {
        const ids: number[] = JSON.parse(localStorage.getItem('induo_favorites') ?? '[]');

        if (ids.length === 0) {
          setFavLoading(false);
          return;
        }

        const data = await getProperties({ size: 50 });
        const matched = data.content.filter((property) => ids.includes(property.id));
        setFavProperties(matched);
      } catch {
      } finally {
        setFavLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const isAgent = user.role === 'AGENT' || user.role === 'ADMIN';
  const canCreateProperties = true;

  const initials =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .map((value) => value![0].toUpperCase())
      .join('') || user.email[0].toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 80, paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        .dash-fadein { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .action-card:hover { background: var(--bg-card) !important; border-color: var(--border-hover) !important; }
        .action-card:hover .arrow-icon { transform: translateX(4px); }
        .arrow-icon { transition: transform 0.2s; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div
          className="dash-fadein"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            borderRadius: 24,
            padding: '36px 40px',
            color: '#fff',
            marginBottom: 32,
            position: 'relative',
            overflow: 'hidden',
            animationDelay: '0s',
          }}
        >
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: 160, height: 160, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>Witaj w panelu,</p>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                {user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user.email}
              </h1>
              {isAgent && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginTop: 12 }}>
                  <Shield size={11} /> Agent nieruchomości
                </span>
              )}
            </div>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
              {initials}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          <div className="dash-fadein" style={{ animationDelay: '0.08s' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 20, padding: 28, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={15} style={{ color: 'var(--text-muted)' }} />
                  Dane konta
                </h2>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: isAgent ? 'rgba(59,130,246,0.12)' : 'var(--bg-card)', color: isAgent ? 'var(--accent-bright)' : 'var(--text-muted)', border: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {user.role ?? 'USER'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { icon: <Mail size={14} />, label: 'Email', value: user.email },
                  { icon: <User size={14} />, label: 'Imię i nazwisko', value: user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : '—' },
                  { icon: <Phone size={14} />, label: 'Telefon', value: user.phoneNumber ?? '—' },
                ].map(({ icon, label, value }, index, values) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: index < values.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                      <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 20, padding: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={15} style={{ color: '#f87171' }} />
                Ulubione ogłoszenia
              </h2>

              {favLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                  {[1, 2, 3].map((item) => (
                    <div key={item} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-card)', background: 'var(--bg-card)' }}>
                      <div style={{ height: 140, background: 'var(--bg-card)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      <div style={{ padding: 12 }}>
                        <div style={{ height: 12, borderRadius: 6, background: 'var(--bg-card)', marginBottom: 8, width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                        <div style={{ height: 10, borderRadius: 5, background: 'var(--bg-card)', width: '45%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : favProperties.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 14, border: '1px dashed var(--border)', background: 'var(--bg-card)' }}>
                  <Heart size={32} style={{ color: 'var(--text-faint)', margin: '0 auto 12px', display: 'block' }} />
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 600 }}>Brak ulubionych</p>
                  <p style={{ fontSize: 12, color: 'var(--text-faint)', margin: 0 }}>Kliknij serce na ogłoszeniu, żeby dodać je do ulubionych.</p>
                  <Link href="/properties" style={{ display: 'inline-block', marginTop: 16, fontSize: 13, color: 'var(--accent-bright)', fontWeight: 600, textDecoration: 'none' }}>
                    Przeglądaj oferty →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                  {favProperties.map((property, index) => (
                    <div key={property.id} style={{ animation: `fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s both` }}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="dash-fadein" style={{ display: 'flex', flexDirection: 'column', gap: 14, animationDelay: '0.14s' }}>
            {canCreateProperties && (
              <Link href="/properties/create" style={{ textDecoration: 'none' }}>
                <div
                  style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', borderRadius: 18, padding: 22, color: '#fff', cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.opacity = '1';
                  }}
                >
                  <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Plus size={18} />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>Dodaj ogłoszenie</h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 14px' }}>Opublikuj nową ofertę nieruchomości</p>
                  <ArrowRight size={16} className="arrow-icon" />
                </div>
              </Link>
            )}

            <Link href="/properties" style={{ textDecoration: 'none' }}>
              <div className="action-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 18, padding: 22, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: 40, height: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--text-muted)' }}>
                  <Building2 size={18} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>Przeglądaj oferty</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 14px' }}>Znajdź wymarzoną nieruchomość</p>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} className="arrow-icon" />
              </div>
            </Link>

            {isAgent && (
              <Link href="/dashboard/my-properties" style={{ textDecoration: 'none' }}>
                <div className="action-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 18, padding: 22, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--text-muted)' }}>
                    <TrendingUp size={18} />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>Moje ogłoszenia</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 14px' }}>Zarządzaj swoimi ofertami</p>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} className="arrow-icon" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
