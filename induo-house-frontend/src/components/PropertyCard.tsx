'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { BedDouble, Building2, Heart, MapPin, Maximize2, Phone } from 'lucide-react';
import { PropertyListResponse } from '@/types/property';
import NewBadge from '@/components/NewBadge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const STORAGE_KEY = 'induo_favorites';

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Mieszkanie',
  HOUSE: 'Dom',
  LAND: 'Działka',
  COMMERCIAL: 'Lokal',
};

function isFavorite(id: number): boolean {
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[]).includes(id);
  } catch {
    return false;
  }
}

function toggleFavorite(id: number): boolean {
  try {
    const favorites: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    const next = favorites.includes(id)
      ? favorites.filter((favoriteId) => favoriteId !== id)
      : [...favorites, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next.includes(id);
  } catch {
    return false;
  }
}

function resolveImageUrl(path: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_BASE}${path}`;
}

export default function PropertyCard({ property }: { property: PropertyListResponse }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(() => isFavorite(property.id));

  const imageUrl = resolveImageUrl(property.thumbnailUrl);
  const isRent = property.transactionType === 'RENT';
  const formattedPrice = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(property.price);
  const pricePerMeter = property.area
    ? `${Math.round(property.price / property.area).toLocaleString('pl-PL')} zł/m²`
    : null;

  const handleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorite(toggleFavorite(property.id));
  };

  return (
    <article className="property-card" onClick={() => router.push(`/properties/${property.id}`)}>
      <div className="property-card-media">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            width={720}
            height={480}
            unoptimized
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="property-card-placeholder" aria-label="Brak zdjęcia">
            <Building2 size={42} />
          </div>
        )}

        <div className="property-card-badges">
          <span className={isRent ? 'rent' : 'sale'}>{isRent ? 'Wynajem' : 'Sprzedaż'}</span>
          <span>{TYPE_LABELS[property.propertyType] || property.propertyType}</span>
        </div>

        <button
          type="button"
          className={favorite ? 'property-favorite active' : 'property-favorite'}
          title={favorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          onClick={handleFavorite}
        >
          <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="property-card-body">
        <div className="property-card-title-row">
          <h3>{property.title}</h3>
          <NewBadge createdAt={(property as PropertyListResponse & { createdAt?: string }).createdAt} />
        </div>

        <p className="property-card-location">
          <MapPin size={15} />
          {property.city}
        </p>

        <div className="property-card-facts">
          <span>
            <Maximize2 size={15} />
            {property.area} m²
          </span>
          {property.numberOfRooms != null && property.numberOfRooms > 0 && (
            <span>
              <BedDouble size={15} />
              {property.numberOfRooms} pok.
            </span>
          )}
        </div>

        {(property.ownerFirstName || property.ownerPhoneNumber) && (
          <p className="property-card-owner">
            <Phone size={14} />
            {property.ownerFirstName} {property.ownerLastName}
            {property.ownerPhoneNumber && <span>{property.ownerPhoneNumber}</span>}
          </p>
        )}
      </div>

      <div className="property-card-footer">
        <strong>{formattedPrice}</strong>
        {pricePerMeter && <span>{pricePerMeter}</span>}
      </div>
    </article>
  );
}
