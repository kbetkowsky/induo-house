'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getMyProperties } from '@/lib/properties';
import { Property } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import { PropertyListResponse } from '@/types/property';

function toPropertyCardModel(property: Property): PropertyListResponse {
  return {
    id: property.id,
    title: property.title,
    price: property.price,
    area: property.area,
    city: property.city,
    numberOfRooms: property.numberOfRooms,
    transactionType: property.transactionType,
    propertyType: property.propertyType,
    status: property.status,
    thumbnailUrl: property.thumbnailUrl,
    ownerFirstName: property.owner.firstName,
    ownerLastName: property.owner.lastName,
    ownerPhoneNumber: property.owner.phoneNumber ?? '',
  };
}

export default function MyPropertiesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadProperties = async () => {
      try {
        const data = await getMyProperties();
        setProperties(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 88, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', fontWeight: 500, marginBottom: 12 }}>
              <ArrowLeft size={14} /> Wróć do dashboardu
            </Link>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 12 }}>
              <TrendingUp size={26} />
              Moje ogłoszenia
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
              {loading ? 'Ładowanie ofert...' : properties.length === 0 ? 'Nie masz jeszcze żadnych ofert.' : `Masz obecnie ${properties.length} ${properties.length === 1 ? 'ofertę' : properties.length < 5 ? 'oferty' : 'ofert'}.`}
            </p>
          </div>

          <Link
            href="/properties/create"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 18px',
              borderRadius: 14,
              background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            <Plus size={16} /> Dodaj ogłoszenie
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', height: 320 }} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Building2 size={34} style={{ color: 'var(--accent-bright)' }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Nie masz jeszcze ofert</h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Dodaj pierwsze ogłoszenie i wykorzystaj tę stronę jako swoje portfolio produktowe.
            </p>
            <Link
              href="/properties/create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                borderRadius: 14,
                background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              <Plus size={16} /> Dodaj pierwsze ogłoszenie
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={toPropertyCardModel(property)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
