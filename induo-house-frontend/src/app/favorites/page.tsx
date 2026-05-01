'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { getFavorites } from '@/lib/favorites';
import { getProperty } from '@/lib/properties';
import { PropertyListItem } from '@/types';

export default function FavoritesPage() {
  const [items, setItems] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getFavorites();
    Promise.all(ids.map((id) => getProperty(id).then((property) => ({
      id: property.id,
      title: property.title,
      price: property.price,
      area: property.area,
      city: property.city,
      numberOfRooms: property.numberOfRooms,
      transactionType: property.transactionType,
      propertyType: property.propertyType,
      status: property.status,
      thumbnailUrl: property.images?.find((image) => image.isPrimary)?.url || property.images?.[0]?.url || null,
      ownerFirstName: property.owner?.firstName,
      ownerLastName: property.owner?.lastName,
      ownerPhoneNumber: property.owner?.phoneNumber || undefined,
    })))).then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <section className="container page-hero">
        <span className="eyebrow"><Heart size={16} /> Ulubione</span>
        <h1>Zapisane oferty w jednym eleganckim widoku.</h1>
        <p>Ulubione są zapisywane lokalnie w przeglądarce, więc możesz szybko wrócić do interesujących nieruchomości.</p>
      </section>
      <section className="container section">
        {loading ? <div className="panel empty"><h2>Ładowanie...</h2></div> : items.length ? <div className="property-grid">{items.map((item) => <PropertyCard key={item.id} property={item} />)}</div> : <div className="panel empty"><h2>Brak ulubionych</h2><p>Dodaj serduszko przy interesującej ofercie.</p><Link className="btn-primary" href="/properties">Przeglądaj oferty</Link></div>}
      </section>
    </main>
  );
}
