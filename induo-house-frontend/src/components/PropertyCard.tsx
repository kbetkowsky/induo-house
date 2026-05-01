'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BedDouble, Building2, Heart, MapPin, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { assetUrl } from '@/lib/api';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { money, pricePerMeter, transactionLabel, typeLabel } from '@/lib/format';
import { PropertyListItem } from '@/types';

export function PropertyCard({ property }: { property: PropertyListItem }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(() => isFavorite(property.id));
  const image = assetUrl(property.thumbnailUrl);
  const ppm = pricePerMeter(property.price, property.area);

  return (
    <article className="property-card" onClick={() => router.push(`/properties/${property.id}`)}>
      <div className="property-media">
        {image ? (
          <Image src={image} alt={property.title} width={720} height={520} unoptimized />
        ) : (
          <div className="property-placeholder" aria-label="Brak zdjęcia"><Building2 size={44} /></div>
        )}
        <div className="badge-row">
          <span className={`badge ${property.transactionType === 'RENT' ? 'rent' : 'sale'}`}>{transactionLabel(property.transactionType)}</span>
          <span className="badge">{typeLabel(property.propertyType)}</span>
        </div>
        <button
          type="button"
          className={favorite ? 'favorite-btn active' : 'favorite-btn'}
          title={favorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          onClick={(event) => {
            event.stopPropagation();
            setFavorite(toggleFavorite(property.id));
          }}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="property-body">
        <h3 className="property-title">{property.title}</h3>
        <p className="meta-line"><MapPin size={16} /> {property.city}</p>
        <div className="facts">
          <span><Maximize2 size={16} /> {property.area} m²</span>
          {property.numberOfRooms ? <span><BedDouble size={16} /> {property.numberOfRooms} pok.</span> : null}
        </div>
      </div>
      <div className="property-footer">
        <strong>{money(property.price)}</strong>
        {ppm ? <span>{ppm}</span> : null}
      </div>
    </article>
  );
}
