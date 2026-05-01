'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BedDouble, Building2, Mail, MapPin, Maximize2, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { assetUrl } from '@/lib/api';
import { money, pricePerMeter, transactionLabel, typeLabel } from '@/lib/format';
import { getProperty } from '@/lib/properties';
import { PropertyDetail } from '@/types';

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperty(Number(params.id)).then(setProperty).catch(() => setProperty(null)).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <main className="page"><div className="container panel empty"><h2>Ładowanie oferty...</h2></div></main>;
  if (!property) return <main className="page"><div className="container panel empty"><h2>Nie znaleziono oferty</h2><Link href="/properties" className="btn-primary">Wróć do katalogu</Link></div></main>;

  const images = property.images?.map((image) => assetUrl(image.url)).filter(Boolean) as string[] | undefined;
  const mainImage = images?.[0];
  const ppm = pricePerMeter(property.price, property.area);

  return (
    <main className="page">
      <section className="container detail-grid">
        <div>
          <div className="gallery">
            {mainImage ? <Image src={mainImage} alt={property.title} width={1000} height={720} unoptimized /> : <div className="gallery-placeholder"><Building2 size={56} /></div>}
            <div className="gallery-side">
              {(images?.slice(1, 3) || []).map((image) => <Image key={image} src={image} alt="" width={420} height={320} unoptimized />)}
              {!images?.slice(1, 3).length && <div className="gallery-placeholder"><Building2 size={36} /></div>}
            </div>
          </div>
          <div className="panel detail-content" style={{ marginTop: 22 }}>
            <span className="eyebrow">{transactionLabel(property.transactionType)} · {typeLabel(property.propertyType)}</span>
            <h1 className="detail-title">{property.title}</h1>
            <p className="meta-line"><MapPin size={18} /> {property.street ? `${property.street}, ` : ''}{property.city}</p>
            <div className="detail-price"><strong>{money(property.price)}</strong>{ppm ? <span>{ppm}</span> : null}</div>
            <div className="facts">
              <span><Maximize2 size={17} /> {property.area} m²</span>
              {property.numberOfRooms ? <span><BedDouble size={17} /> {property.numberOfRooms} pok.</span> : null}
              {property.floor !== null && property.floor !== undefined ? <span>Piętro {property.floor}</span> : null}
            </div>
            <p className="detail-description">{property.description || 'Właściciel nie dodał jeszcze opisu. Skontaktuj się, aby poznać szczegóły oferty.'}</p>
          </div>
        </div>
        <aside className="panel contact-card">
          <h2>Kontakt</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>Zapytaj o dostępność, termin prezentacji albo dodatkowe informacje.</p>
          <div className="facts" style={{ display: 'grid' }}>
            <span><Phone size={17} /> {property.owner?.phoneNumber || 'Telefon po zalogowaniu'}</span>
            <span><Mail size={17} /> {property.owner?.email || 'Email po zalogowaniu'}</span>
          </div>
          <Link href="/login" className="btn-primary" style={{ width: '100%', marginTop: 18 }}>Napisz do właściciela</Link>
        </aside>
      </section>
    </main>
  );
}
