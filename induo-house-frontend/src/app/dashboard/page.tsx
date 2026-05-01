'use client';

import Link from 'next/link';
import { Building2, Heart, Plus, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getMyProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyListItem } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<PropertyListItem[]>([]);

  useEffect(() => {
    if (user) getMyProperties().then((data) => setItems(data.content)).catch(() => setItems([]));
  }, [user]);

  if (user === undefined) return <main className="page"><div className="container panel empty"><h2>Ładowanie panelu...</h2></div></main>;
  if (user === null) return <main className="page"><div className="container panel empty"><h2>Zaloguj się</h2><p>Panel jest dostępny po zalogowaniu.</p><Link className="btn-primary" href="/login">Przejdź do logowania</Link></div></main>;

  return (
    <main className="page">
      <section className="container page-hero">
        <span className="eyebrow"><UserRound size={16} /> Panel</span>
        <h1>Cześć, {user.firstName || user.email}.</h1>
        <p>Zarządzaj ogłoszeniami i wracaj do najważniejszych działań bez szukania po menu.</p>
        <div className="button-row"><Link href="/properties/create" className="btn-primary"><Plus size={18} /> Dodaj ogłoszenie</Link><Link href="/favorites" className="btn-secondary"><Heart size={18} /> Ulubione</Link></div>
      </section>
      <section className="container section">
        <div className="stats-grid">
          <Stat icon={<Building2 />} value={String(items.length)} label="Twoje ogłoszenia" />
          <Stat icon={<Heart />} value="local" label="Ulubione zapisane w przeglądarce" />
          <Stat icon={<UserRound />} value={user.role} label="Typ konta" />
          <Stat icon={<Plus />} value="1" label="Kliknięcie do publikacji" />
        </div>
      </section>
      <section className="container section">
        <div className="section-head"><div><span className="section-kicker">Twoje oferty</span><h2 className="section-title">Aktywne ogłoszenia</h2></div></div>
        {items.length ? <div className="property-grid">{items.map((item) => <PropertyCard key={item.id} property={item} />)}</div> : <div className="panel empty"><h2>Nie masz jeszcze ogłoszeń</h2><Link href="/properties/create" className="btn-primary">Dodaj pierwsze</Link></div>}
      </section>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="stat-card"><div>{icon}</div><strong>{value}</strong><span>{label}</span></div>;
}
